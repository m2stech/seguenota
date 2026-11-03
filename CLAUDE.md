# Segue Nota — CLAUDE.md

Briefing técnico para desenvolvimento assistido por Claude Code. O produto está especificado em [docs/PRD.md](docs/PRD.md) — leia-o para entender requisitos funcionais (RF-xx), regras fiscais, modelo de dados e decisões/pendências (seções 20-21). Este arquivo cobre como construir, não o que construir.

## O que é o Segue Nota

SaaS de gestão e monitoramento de NFS-e para escritórios contábeis e empresas. Arquitetura híbrida com três componentes:

1. **Interface Web** (Next.js) — autenticação, organizações, consultas, dashboards, exportações, DANFSe.
2. **Backend SaaS** (Next.js Route Handlers/Server Actions) — usuários, permissões, ingestão de XML, cobrança, notificações.
3. **Agente Local Windows** (.NET) — única peça que fala com a API ADN via mTLS com certificados A1 do cliente. Nunca envia certificados ao backend, só metadados.

## Princípios não negociáveis (ver PRD §2.2)

- Certificados, senhas e chaves privadas **nunca** saem do computador do cliente nem chegam ao backend.
- Toda chamada à API ADN (nacional) é feita pelo agente — o backend não tem certificado e não acessa o ADN diretamente.
- Tudo que pode ser feito a partir do XML já armazenado (consultas, filtros, dashboards, exportações, DANFSe) é feito **no backend**, sem depender do agente online.
- A comunicação é sempre iniciada pelo agente (HTTPS de saída). Nenhuma porta de entrada no computador do cliente.
- O cursor de NSU só avança após o backend confirmar a persistência dos documentos.
- Isolamento multi-tenant garantido por RLS no banco e validado no backend — nunca só no frontend.
- Cada CNPJ: exatamente um certificado A1 próprio, sincronizado por exatamente um agente por vez.

## Repositório e código legado

- Repositório próprio: `E:\seguenota` (monorepo, do zero).
- `E:\M2S\NF_tracker` é o legado (Python) — **somente leitura**, nunca criar/alterar/remover nada ali. Serve só para consulta de regras de negócio e algoritmos (ex.: localização de NSU, geração de DANFSe). A lógica é **reimplementada a partir da especificação do PRD**, nunca copiada literalmente.
- Segredos/credenciais do legado nunca são reaproveitados no novo projeto.

## Stack técnica (PRD §17)

| Camada | Tecnologia |
|---|---|
| Linguagem web | TypeScript (strict) |
| Frontend | Next.js (App Router), React, Tailwind CSS, shadcn/ui (Radix), Lucide React, Recharts |
| Backend web | Next.js Route Handlers e Server Actions (Node.js runtime) |
| Validação | Zod — toda entrada de API, formulários e payloads do agente |
| Banco | Supabase PostgreSQL com RLS; migrations via Supabase CLI; tipos TS gerados do schema |
| Autenticação | Supabase Auth (e-mail/senha, convite, TOTP) |
| Arquivos | Supabase Storage (buckets privados, URLs assinadas de curta duração) |
| Fila assíncrona | A decidir (Vercel Queues/Workflow ou Supabase Queues/pgmq + Cron) — pendência P5 |
| Pagamentos | Stripe Billing, Checkout, Customer Portal |
| E-mail transacional | A definir (ex.: Resend) com domínio autenticado (SPF/DKIM/DMARC) — pendência P4 |
| Hospedagem | Vercel (web/APIs) + Supabase (banco, auth, storage) |
| Agente | .NET 10 (LTS), Windows Service, instalador MSI assinado (Authenticode) — sujeito à PoC (§9.9) |
| Testes | Vitest (unidade), Playwright (e2e), testes de RLS/autorização; xUnit (agente) |
| Observabilidade | Logs estruturados sem dados fiscais; Sentry (ou equivalente) com scrubbing de dados sensíveis |

## Estrutura de pastas (monorepo)

```
seguenota/
├── apps/
│   ├── web/              # Next.js — frontend + backend (route handlers/server actions)
│   └── agent/             # Agente Windows em .NET 10, versionamento próprio
├── packages/
│   └── shared/            # DTOs/contratos agente↔backend versionados (OpenAPI), tipos compartilhados
├── supabase/
│   ├── migrations/        # Migrations versionadas (Supabase CLI)
│   └── ...
├── docs/
│   └── PRD.md              # Especificação de produto (fonte de verdade de requisitos)
└── CLAUDE.md               # Este arquivo
```

Ajustar conforme o projeto evoluir, mas manter a separação `apps/web`, `apps/agent`, `packages/shared`, `supabase/` como já decidida no PRD.

## Convenções de desenvolvimento

- **Idioma e formato:** interface e mensagens em pt-BR; moeda BRL; datas `dd/mm/aaaa`; fuso de exibição `America/Sao_Paulo`. Datas armazenadas em `timestamptz` (UTC), exceto competência (`date`, primeiro dia do mês) — nunca derivar competência por conversão de fuso, sempre do valor do XML.
- **Valores monetários:** `numeric(15,2)`; alíquotas `numeric(7,4)`. Nunca `float`.
- **RLS obrigatório:** toda tabela com dado de cliente tem `organization_id` e política RLS. Permissões sempre verificadas no backend e no banco — nunca confiar em checagem só no frontend.
- **Idempotência:** toda ingestão de documento/evento do ADN é idempotente (chaves únicas por NSU, ChaveAcesso, e evento). Reenvio nunca duplica.
- **Leitura de XML:** ignorar namespaces, buscar por nome local da tag, tolerar variações de versão/município (como no legado).
- **Segredos:** nunca no repositório. Variáveis de ambiente via Vercel/Supabase.
- **Service role key:** só no servidor, nunca exposta ao cliente.
- **Logs:** nunca contêm conteúdo fiscal, senhas, chaves ou tokens.
- **Frontend nunca calcula preço/cobrança** — isso é responsabilidade exclusiva do backend.
- Perfis e permissões ficam em tabelas (extensível), não fixos no código.

## Identidade visual (PRD §16)

**Direção:** *Modern Fiscal Intelligence SaaS* — moderno, sofisticado, minimalista. Transmitir tecnologia, precisão e confiabilidade, evitando a estética tradicional de ERP/sistema contábil.

**Referências:** Linear (navegação, hierarquia, menu lateral recolhível, microinterações, light/dark), Ramp (dashboards financeiros, tabelas densas, números objetivos), Vercel (minimalismo, tipografia, indicadores de status).

**Cores e tokens:**
- Design system próprio sobre shadcn/ui, tokens CSS, suporte nativo Light + Dark.
- Paleta inicial neutra (branco gelo / grafite) com índigo/violeta como destaque — tokens devem permitir troca de cor sem refatoração (cores definitivas = pendência P13).
- Cores semânticas (sucesso, atenção, erro, cancelada, substituída, extemporânea, estados de sync) sempre acompanhadas de texto/ícone, nunca só cor (acessibilidade).

**UX:**
- Desktop-first, totalmente responsivo.
- Menu lateral recolhível; seletores rápidos de organização/empresa/competência sempre visíveis.
- Tabelas densas: busca, filtros avançados, ordenação, paginação no servidor, colunas configuráveis.
- Paleta de comandos (⌘K / Ctrl+K), atalhos de teclado.
- Estados de carregamento/vazio/erro bem definidos; progresso visível em sincronizações.
- Gráficos com Recharts (sóbrios); ícones Lucide.
- WCAG 2.1 AA: contraste, foco visível, navegação por teclado, ARIA.

## Áreas sensíveis — atenção extra

- **Agente Windows** (`apps/agent`): mTLS com certificado do cliente, acesso a `X509Store`, Windows Service vs. execução por usuário. Decisões dependem da PoC obrigatória (PRD §9.9) — não assumir o modo de execução final sem validar.
- **Situação fiscal da nota**: sempre derivada da sequência de eventos (ordenados por data/hora), nunca do `cStat` do XML isoladamente (PRD §7.3).
- **DANFSe**: gerado no backend a partir do XML armazenado, seguindo a NT-008 — a API pública de DANFSe do ADN está sobrestada e não deve ser usada (PRD §11).
- **Cobrança Stripe**: webhooks com verificação de assinatura, idempotentes, fail-closed (evento não verificado é rejeitado).
- **LGPD**: dados fiscais podem conter dados pessoais. Retenção/exclusão após desativação de CNPJ é pendência jurídica (P2) — por padrão, nenhuma exclusão automática até definição.

## Pendências relevantes para decisões de implementação (PRD §21)

Ao implementar algo que dependa de uma destas pendências, usar o "padrão até a definição" indicado e deixar o ponto de configuração explícito (variável de ambiente, tabela de catálogo, etc.), nunca hardcoded:

- **P3** domínio oficial → usar `NEXT_PUBLIC_SITE_URL`.
- **P4** provedor de e-mail → abstrair detrás de uma interface de envio.
- **P5** fila assíncrona → decidir no início do desenvolvimento (Vercel Queues/Workflow vs. Supabase pgmq+Cron).
- **P6** modo de execução do agente / local dos certificados → aguardar resultado da PoC.
- **P7** intervalo de sincronização → padrão 60 min, configurável.
- **P1/P10** preços, planos, meios de pagamento → catálogo comercial configurável no banco, nunca no código.

## Fluxo de trabalho recomendado

1. Milestones incrementais, cada um testável isoladamente antes de avançar (PRD §22).
2. Priorizar funcionalidade core antes de iterar em polish.
3. Para banco/RLS: usar a skill `supabase-postgres-best-practices`.
4. Para frontend: skills `nextjs`, `shadcn`, `react-best-practices`, `frontend-design`, `dataviz`.
5. Para pagamentos: skills `stripe-best-practices`, `stripe-docs`.
6. Para deploy: skills `vercel:deploy`, `vercel:env`.
7. Antes de cada entrega relevante: `/code-review` e `/security-review`.
