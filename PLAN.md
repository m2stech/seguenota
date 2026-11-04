# PLAN — Segue Nota

Plano de execução do projeto, dividido em milestones sequenciais. Cada milestone roda em sua própria branch, criada a partir de `main`, e termina com merge (ou PR) + commit final na própria branch antes do próximo milestone começar.

Referências: [docs/PRD.md](docs/PRD.md) (o quê) e [CLAUDE.md](CLAUDE.md) (como). Requisitos funcionais citados como RF-xx, decisões como D-xx, pendências como P-xx referem-se ao PRD.

**Estratégia geral:** interface primeiro, com dados mockados/fixtures, depois backend real ligado por trás das mesmas telas. Isso valida UX e design system rápido, mas significa que todo mock introduzido nos milestones 2-6 precisa ser varrido e substituído nos milestones 7+ — cada milestone de backend lista explicitamente qual mock ele substitui.

**Convenção de branch:** `milestone/NN-slug` a partir de `main`.

---

## Milestone 0 — Setup do repositório e ambiente

**Branch:** `milestone/00-setup`

**Objetivo:** preparar o monorepo, ferramentas e acessos necessários para começar a desenvolver, sem nenhuma funcionalidade de produto ainda.

**Entregas:**
- [x] Inicializar monorepo com `apps/web`, `apps/agent`, `packages/shared`, `supabase/` (estrutura do CLAUDE.md)
- [x] Scaffold do Next.js (App Router, TypeScript strict) em `apps/web`
- [x] Configurar Tailwind CSS + shadcn/ui (tokens CSS, light/dark) em `apps/web`
- [x] Configurar ESLint, Prettier, tsconfig compartilhado
- [x] Configurar Vitest (unidade) e Playwright (e2e) em `apps/web`
- [x] Criar projeto Supabase novo (separado do legado) e vincular localmente (Supabase CLI)
- [x] Criar `.env.example` com todas as variáveis conhecidas (Supabase, `NEXT_PUBLIC_SITE_URL`, etc.) — nunca segredos reais versionados
- [x] Criar projeto Vercel e linkar o repositório (`vercel link`)
- [x] Scaffold inicial do projeto .NET 10 em `apps/agent` (console/worker vazio, só para validar o SDK)
- [x] `packages/shared`: esqueleto para DTOs/contratos compartilhados (ainda vazio ou com placeholder)
- [x] README raiz com instruções de setup local (como subir `apps/web`, rodar Supabase local, etc.)
- [x] CI básico (lint + typecheck + testes unitários) — GitHub Actions ou equivalente

**Commit final:** `chore(setup): inicializa monorepo, Next.js, Supabase e tooling base`

---

## Milestone 1 — Design system e shell da aplicação

**Branch:** `milestone/01-design-system`

**Objetivo:** estabelecer a identidade visual (PRD §16) e o shell de navegação que todas as telas futuras vão usar, sem nenhuma lógica de negócio ainda.

**Entregas:**
- [x] Tokens de cor (paleta neutra + índigo/violeta de destaque), tipografia e espaçamento configuráveis sem refatoração (pendência P13 — deixar fácil trocar depois)
- [x] Tema light/dark persistido (preferência do usuário, com opção "seguir sistema")
- [x] Layout shell: menu lateral recolhível, seletor de organização/empresa/competência (placeholders funcionais, sem dados reais ainda)
- [x] Paleta de comandos (⌘K / Ctrl+K) com ações básicas de navegação
- [x] Componentes base shadcn/ui instalados e customizados (botão, input, select, dialog, tabela, toast, badge de status)
- [x] Estados padrão: carregamento (skeleton), vazio, erro — componentes reutilizáveis
- [x] Cores semânticas (sucesso, atenção, erro, cancelada, substituída, extemporânea) sempre com texto/ícone, nunca só cor
- [x] Página de storybook/showcase interna (`/dev/ui`) para revisar todos os componentes e estados juntos
- [x] Checagem de acessibilidade básica (contraste, foco visível, navegação por teclado) nos componentes base

**Commit final:** `feat(ui): design system, tema light/dark e shell de navegação`

---

## Milestone 2 — Telas de autenticação e onboarding (mockado)

**Branch:** `milestone/02-ui-auth-onboarding`

**Objetivo:** construir as telas de RF-01 (autenticação) e RF-14 (onboarding) com fluxo completo navegável, usando estado local/mock — sem Supabase Auth real ainda.

**Entregas:**
- [x] Telas: cadastro, login, confirmação de e-mail, recuperação de senha
- [x] Tela de convite de usuário (aceite + definição de senha)
- [x] Tela de configuração de 2FA (TOTP) — fluxo visual completo
- [x] Tela de gestão de sessões ativas (listar, revogar, "encerrar todas")
- [x] Fluxo de onboarding guiado (RF-14): criar organização → baixar/instalar agente → ativar com código → revisar certificados detectados → cadastrar empresas → escolher competência inicial → iniciar sincronização — todas as etapas navegáveis com dados mockados e indicador de progresso
- [x] Validações de formulário (Zod no client) com mensagens em pt-BR
- [x] Testes de componente (Vitest) para os formulários principais

**Commit final:** `feat(ui): telas de autenticação e onboarding com dados mockados`

---

## Milestone 3 — Telas de organizações, empresas, agentes e certificados (mockado)

**Branch:** `milestone/03-ui-orgs-companies-agents`

**Objetivo:** construir a gestão de organizações/empresas/agentes/certificados (RF-02, RF-03) e perfis de usuário (seção 5), com dados mockados.

**Entregas:**
- [ ] Seletor de organização (multi-org por usuário — D12) com troca de contexto
- [ ] Tela de cadastro de empresa por CNPJ (validação de dígitos verificadores no client)
- [ ] Estados visuais da empresa: `pendente_vinculo` → `ativa` → `desativada` (com reativação)
- [ ] Tela de gestão de agentes: listar, gerar código de ativação, revogar
- [ ] Tela de certificados detectados por agente (metadados: thumbprint, CNPJ titular, emissor, validade) e vínculo com empresa, incluindo os estados válido/vencendo/vencido/indisponível
- [ ] UI das regras de negócio como validação visual (feedback imediato, mesmo mockado): um certificado por CNPJ, um agente por CNPJ, recusa quando CNPJ do certificado ≠ CNPJ da empresa
- [ ] Tela de gestão de usuários e permissões por organização/empresa (perfis: Admin Organização, Operador Fiscal, Usuário de Consulta)
- [ ] Testes de componente para as validações de vínculo

**Commit final:** `feat(ui): telas de organizações, empresas, agentes e certificados com dados mockados`

---

## Milestone 4 — Telas de documentos fiscais, busca e competências (mockado)

**Branch:** `milestone/04-ui-documents-search`

**Objetivo:** construir o núcleo de consulta do produto (RF-07, RF-08, RF-09) com dados mockados representativos (incluindo casos de cancelamento, substituição e extemporâneos).

**Entregas:**
- [ ] Tabela de documentos: busca, todos os filtros combináveis de RF-08, ordenação, paginação (client-side por ora), colunas configuráveis
- [ ] Filtros salvos por usuário (mockado) e URL refletindo o estado dos filtros
- [ ] Tela de detalhe da nota: dados estruturados, linha do tempo de eventos, botão de download de XML (mock), botão de DANFSe (mock)
- [ ] Navegação bidirecional entre nota substituída ↔ substituta
- [ ] Badges de situação fiscal (autorizada, cancelada, substituída, cancelamento em análise, bloqueada) sempre com texto/ícone
- [ ] Tela de competências: visão por competência/empresa (quantidades, valores, situação), ação de fechar/reabrir competência, destaque de documentos extemporâneos
- [ ] Massa de dados mock variada (fixtures) cobrindo os casos acima para testar a UI de ponta a ponta

**Commit final:** `feat(ui): telas de documentos fiscais, busca e competências com dados mockados`

---

## Milestone 5 — Telas de dashboards, notificações e exportações (mockado)

**Branch:** `milestone/05-ui-dashboards-notifications`

**Objetivo:** construir dashboards (RF-10), central de notificações (RF-12) e fluxos de exportação/DANFSe (RF-11), com dados mockados.

**Entregas:**
- [ ] Dashboard fiscal: gráficos Recharts (notas por competência, cancelamentos, substituições, extemporâneas, ISS retido)
- [ ] Dashboard operacional: situação dos agentes (online/offline/erro/desatualizado), última sincronização por CNPJ, tarefas com falha, certificados vencendo — com a distinção clara "agente conectado" vs. "documentos atualizados"
- [ ] Central de notificações na plataforma (lista, marcar como lida) e tela de preferências por tipo de evento/canal
- [ ] Fluxo de exportação de XML (individual/lote) e Excel (padrão/completa) — UI de seleção de filtros, acompanhamento assíncrono (mock de job em progresso) e link de download final
- [ ] Fluxo de geração de DANFSe individual (preview mockado do PDF) e em lote
- [ ] Indicador visual de agente offline com fila de tarefas pendentes (seção 2.3)

**Commit final:** `feat(ui): telas de dashboards, notificações e exportações com dados mockados`

---

## Milestone 6 — Telas administrativas e landing page

**Branch:** `milestone/06-ui-admin-landing`

**Objetivo:** construir o painel do administrador da plataforma (RF-15), auditoria (RF-16) e a landing page pública com SEO técnico (seção 15), fechando a superfície de UI do MVP.

**Entregas:**
- [ ] Painel admin M2S: organizações, assinaturas, uso (CNPJs ativos, volume, armazenamento) — mockado
- [ ] Painel admin: catálogo comercial (planos, preços, trial) e saúde da plataforma (agentes por versão, filas, erros do ADN) — mockado
- [ ] Tela de auditoria (trilha de eventos, filtros) — mockado
- [ ] Fluxo de acesso excepcional de suporte (solicitação, prazo, escopo, auditoria) — mockado
- [ ] Landing page pública: proposta de valor, funcionalidades, planos/preços, FAQ, CTAs de cadastro/trial
- [ ] SEO técnico (Etapa 1, §15.2): Metadata API, `sitemap.xml`, `robots.txt`, canonical, Open Graph/Twitter Cards, `lang="pt-BR"`, `noindex` em preview/homologação
- [ ] JSON-LD básico (`Organization`, `SoftwareApplication`, `WebSite`)
- [ ] Checagem de Core Web Vitals na landing (next/image, next/font)

**Commit final:** `feat(ui): paineis administrativos, auditoria e landing page com SEO técnico`

---

## Milestone 7 — Banco de dados, RLS e autenticação real

**Branch:** `milestone/07-backend-database-auth`

**Objetivo:** criar o schema real (PRD §10) com RLS e ligar a autenticação real, substituindo os primeiros mocks.

**Mocks substituídos:** autenticação/sessões do Milestone 2; organizações/usuários/permissões do Milestone 3 (parte de dados).

**Entregas:**
- [ ] Migrations Supabase: `organizations`, `organization_members`, `member_company_access`, `companies`, perfis/permissões em tabelas (extensível, não fixo no código)
- [ ] Políticas RLS para cada tabela de dado de cliente (`organization_id` obrigatório)
- [ ] Tipos TypeScript gerados a partir do schema
- [ ] Supabase Auth real: cadastro, confirmação de e-mail, login, logout, recuperação de senha, convite, TOTP, sessões revogáveis — ligados às telas do Milestone 2
- [ ] Middleware/guards de autorização no backend (nunca só no frontend)
- [ ] Testes automatizados de RLS e autorização entre organizações (isolamento multi-tenant)
- [ ] CRUD real de organizações, empresas (com validação de CNPJ no backend) e membros — ligado às telas do Milestone 3
- [ ] Remover os mocks de auth/org/empresa das telas correspondentes

**Commit final:** `feat(backend): schema, RLS e autenticação real substituindo mocks de auth e organizações`

---

## Milestone 8 — Agente Windows: PoC e esqueleto

**Branch:** `milestone/08-agent-poc`

**Objetivo:** executar a prova de conceito obrigatória do agente (PRD §9.9) e construir o esqueleto funcional minimamente viável, antes de integrá-lo ao fluxo completo de sincronização.

**Entregas:**
- [ ] PoC: acesso a certificados A1 exportáveis/não exportáveis em `CurrentUser\My` e `LocalMachine\My`
- [ ] PoC: acesso a certificados sob Windows Service vs. execução por usuário — decisão registrada (resolve pendência P6)
- [ ] PoC: mTLS com o ADN (produção restrita) via Schannel
- [ ] PoC: listagem/filtragem de certificados com dezenas de A1 instalados
- [ ] PoC: inicialização automática e funcionamento sem usuário logado
- [ ] Documentar decisão final de arquitetura do agente com base na PoC (atualizar CLAUDE.md/PRD se necessário)
- [ ] Esqueleto do agente: identidade (`agent_id`), leitura de certificados A1 e envio de metadados (sem chave) para um endpoint de teste
- [ ] Logs locais sem dados sensíveis, rotacionados

**Commit final:** `feat(agent): PoC validada e esqueleto do agente com leitura de certificados A1`

---

## Milestone 9 — Protocolo agente ↔ backend e ativação

**Branch:** `milestone/09-agent-backend-protocol`

**Objetivo:** implementar o protocolo de comunicação (RF-03, PRD §9.3-9.5) e substituir os mocks de agentes/certificados por dados reais.

**Mocks substituídos:** gestão de agentes e certificados do Milestone 3.

**Entregas:**
- [ ] Contratos DTO versionados (OpenAPI) em `packages/shared` para ativação, heartbeat, tarefas e envio de documentos
- [ ] Backend: geração de código de ativação de uso único, endpoint de ativação, emissão de credenciais de escopo limitado por agente
- [ ] Agente: ativação por código, armazenamento de credenciais via DPAPI, rotação/revogação
- [ ] Backend: endpoint de heartbeat (versão, situação, certificados detectados, recursos) e tabela `agents`
- [ ] Backend: vínculo certificado↔CNPJ com as regras 1 e 2 (um certificado por CNPJ, um agente por CNPJ) e validação de CNPJ titular = CNPJ empresa
- [ ] Fluxo de renovação de certificado (substituição de vínculo mantendo cursor de NSU)
- [ ] Versão mínima do agente e recusa de agentes revogados/desatualizados
- [ ] Ligar as telas do Milestone 3 (agentes/certificados) aos dados reais

**Commit final:** `feat(backend,agent): protocolo de ativação, heartbeat e vínculo de certificados substituindo mocks`

---

## Milestone 10 — Sincronização: ingestão, NSU e filas

**Branch:** `milestone/10-sync-ingestion`

**Objetivo:** implementar a sincronização inicial, incremental e retroativa (RF-04, RF-05, RF-06) com a lógica de NSU, deduplicação e filas (PRD §7.4, §9.4, §9.6), substituindo os mocks de documentos e onboarding.

**Mocks substituídos:** fluxo de sincronização do onboarding (Milestone 2); dados de documentos/competências (Milestone 4).

**Entregas:**
- [ ] Decisão e configuração da fila assíncrona (pendência P5 — Vercel Queues/Workflow ou Supabase pgmq+Cron)
- [ ] Backend: `sync_cursors`, `sync_tasks` (inicial, incremental, retroativa, reconsulta de eventos) com concessão/lease e expiração
- [ ] Agente: cliente ADN com mTLS por certificado, chamadas a `/DFe/{NSU}` e `/NFSe/{chave}/Eventos`, tratamento de erros conforme a tabela do PRD §8 (429, 408/5xx, 404 com 3 confirmações, 400/REJEICAO)
- [ ] Agente: algoritmo de localização de NSU inicial (sondagem exponencial + busca binária + recuo de segurança)
- [ ] Backend: ingestão de lotes de documentos — gravação do XML no Storage, dados estruturados no banco, confirmação do maior NSU persistido, idempotência por `(empresa, NSU)`, `ChaveAcesso` e `(chave, tipo, sequencial)` para eventos
- [ ] Sincronização incremental contínua (intervalo configurável, padrão 60 min — pendência P7) e botão "Sincronizar agora" com limite de frequência
- [ ] Carga retroativa sob demanda como tarefa separada
- [ ] Progresso de sincronização refletido na UI (NSU atual, documentos recebidos, competência processada) — ligar ao onboarding e aos dashboards operacionais
- [ ] Testes de idempotência (reenvio de lote não duplica)

**Commit final:** `feat(backend,agent): sincronização inicial/incremental/retroativa com NSU e deduplicação substituindo mocks`

---

## Milestone 11 — Regras fiscais: classificação, eventos e situação

**Branch:** `milestone/11-fiscal-rules`

**Objetivo:** implementar as regras de negócio fiscais (PRD §7.1-7.3, §7.5) sobre os documentos já ingeridos: classificação por empresa, mapeamento de eventos em situação fiscal e extemporâneos.

**Entregas:**
- [ ] Parser de XML tolerante a namespace/versão/município (busca por nome local da tag)
- [ ] Classificação emitida/recebida/intermediada por CNPJ, com vínculo de um documento a duas empresas quando aplicável (`nfse_company_links`)
- [ ] Mapeamento `TipoEvento` → situação fiscal (tabela do PRD §7.3), incluindo fallback por código de evento/`xDesc`/`xMotivo` quando `TipoEvento` ausente
- [ ] Tratamento de evento chegando antes da nota (fica pendente, aplicado quando a nota chegar)
- [ ] `nfse_status_history` (linha do tempo) e vínculo substituída↔substituta (`chSubstda`)
- [ ] Fechamento/reabertura de competência real (RF-09) com registro de quem/quando
- [ ] Marcação de documento/evento extemporâneo e recálculo automático dos indicadores da competência afetada
- [ ] Ligar as telas do Milestone 4 (documentos, linha do tempo, competências) aos dados reais, removendo os mocks
- [ ] Testes unitários do mapeamento de eventos e dos casos de evento fora de ordem

**Commit final:** `feat(backend): classificação fiscal, situação por eventos e competências substituindo mocks de documentos`

---

## Milestone 12 — Busca, filtros e exportações reais

**Branch:** `milestone/12-search-exports`

**Objetivo:** mover a busca/filtros (RF-08) para paginação no servidor com os dados reais, e implementar exportação de XML/Excel (RF-11, seção 12) de verdade.

**Entregas:**
- [ ] Índices de banco para os filtros de RF-08 (empresa+competência, chave, número, documento prestador/tomador, situação)
- [ ] Endpoint de busca com paginação no servidor, ordenação e filtros combináveis reais
- [ ] Filtros salvos por usuário persistidos
- [ ] Exportação de XML (individual e lote ZIP, organizado por empresa/tipo/competência) via Storage com URL assinada
- [ ] Exportação Excel padrão (colunas de negócio, §10.3) e completa (achatamento de XML) com abas Notas/Eventos/Canceladas-Substituídas/Resumo
- [ ] Exportações grandes assíncronas (fila) com notificação de conclusão e link temporário
- [ ] Registro de toda exportação em `audit_logs`
- [ ] Ligar as telas do Milestone 5 (exportações) aos dados/jobs reais

**Commit final:** `feat(backend): busca paginada no servidor e exportações de XML/Excel reais`

---

## Milestone 13 — DANFSe real

**Branch:** `milestone/13-danfse`

**Objetivo:** implementar a geração real do DANFSe a partir do XML (PRD §11), seguindo a NT-008.

**Entregas:**
- [ ] Biblioteca de PDF escolhida (ex.: `pdfkit`/`pdf-lib`) compatível com função serverless
- [ ] Layout A4 único com os 12 blocos na ordem do Anexo I (identificação, prestador, tomador, destinatário, intermediário, serviço, ISSQN, tributação federal, IBS/CBS, valor total, informações complementares, canhoto)
- [ ] Cabeçalho com logo oficial (asset da aplicação), título, município, ambiente; QR Code de consulta pública
- [ ] Tradução de códigos (`cStat`, `finNFSe`, `opSimpNac`, `tribISSQN`, `tpRetISSQN`, `tpAmb`, `ambGer`, `tpEmit`) com fallback "Código N" (nunca texto inventado)
- [ ] Marca-d'água CANCELADA/SUBSTITUÍDA conforme situação calculada pela plataforma; aviso de homologação quando `tpAmb = 2`
- [ ] Geração individual em streaming; lote assíncrono em ZIP (reaproveitando a fila do Milestone 12)
- [ ] Testes de regressão visual com XMLs anonimizados (normal, cancelada, substituída, com retenções, IBS/CBS, descrição longa, homologação)
- [ ] Ligar o botão de DANFSe das telas do Milestone 4/5 à geração real

**Commit final:** `feat(backend): geração de DANFSe a partir do XML conforme NT-008`

---

## Milestone 14 — Notificações reais

**Branch:** `milestone/14-notifications`

**Objetivo:** implementar o sistema de notificações (RF-12) na plataforma e por e-mail, substituindo os mocks do Milestone 5.

**Entregas:**
- [ ] Escolha e integração do provedor de e-mail transacional (pendência P4), abstraído detrás de uma interface de envio
- [ ] Domínio de e-mail autenticado (SPF/DKIM/DMARC) — depende de P3 (domínio oficial)
- [ ] Geração de eventos notificáveis: falha de sincronização, agente offline > N horas, certificado vencendo (30/15/7 dias)/vencido, nota cancelada/substituída, extemporâneo em competência fechada, exportação concluída, problemas de assinatura
- [ ] Preferências por usuário (tipo de evento × canal) e opção de resumo diário
- [ ] Templates de e-mail sem conteúdo fiscal (apenas resumo + link)
- [ ] Central de notificações na plataforma ligada a dados reais
- [ ] Testes de geração de eventos (ex.: job de verificação de certificados vencendo)

**Commit final:** `feat(backend): notificações reais na plataforma e por e-mail substituindo mocks`

---

## Milestone 15 — Assinaturas e cobrança (Stripe)

**Branch:** `milestone/15-billing-stripe`

**Objetivo:** implementar monetização via Stripe (seção 13), incluindo catálogo comercial centralizado.

**Entregas:**
- [ ] Catálogo comercial no banco (`plans`, `prices`, `price_tiers`) vinculado a produtos/preços do Stripe, nunca hardcoded (resolve parte de P1)
- [ ] Stripe Checkout para criação/ativação de assinatura; Customer Portal para cartão/faturas
- [ ] Cobrança por quantidade de CNPJs ativos, com faixas de desconto progressivas
- [ ] Trial com duração/limites configuráveis (valores de teste até definição de P1)
- [ ] Webhooks Stripe com verificação de assinatura, idempotentes (`stripe_events`), fail-closed
- [ ] Gestão de CNPJs contratados: adicionar/desativar/reativar, cobrança proporcional, histórico
- [ ] Inadimplência: período de tolerância, bloqueio de sincronizações, política de consulta
- [ ] Backend calcula e valida todo preço/quantidade — frontend nunca envia valores
- [ ] Landing page e área autenticada lendo o mesmo catálogo (Milestone 6 atualizado)
- [ ] Testes com Stripe test cards e webhooks simulados

**Commit final:** `feat(backend): assinaturas, cobrança por CNPJ e catálogo comercial via Stripe`

---

## Milestone 16 — Painel administrativo real e auditoria completa

**Branch:** `milestone/16-admin-audit`

**Objetivo:** ligar o painel do administrador da plataforma (RF-15) e a auditoria (RF-16) a dados reais, substituindo os mocks do Milestone 6.

**Entregas:**
- [ ] Dados reais de organizações/assinaturas/uso no painel admin M2S
- [ ] Saúde da plataforma real: agentes por versão, falhas agregadas, filas, erros do ADN
- [ ] Versão mínima do agente configurável pelo admin, aplicada na validação do Milestone 9
- [ ] Fluxo de acesso excepcional de suporte real: autorização da organização, prazo/escopo limitados, registro em auditoria
- [ ] `audit_logs` cobrindo todos os eventos do RF-16 (login, permissões, vínculo/revogação de agente e certificado, fechamento/reabertura de competência, exportações/DANFSe em lote, desativação de empresa, acessos de suporte)
- [ ] Tela de auditoria real (Milestone 6) com filtros funcionais

**Commit final:** `feat(backend): painel administrativo e auditoria completa substituindo últimos mocks`

---

## Milestone 17 — Segurança, LGPD e hardening

**Branch:** `milestone/17-security-lgpd`

**Objetivo:** validar os requisitos de segurança e LGPD (PRD §14, §14.9) antes do lançamento, como gate final de qualidade.

**Entregas:**
- [ ] Revisão completa de RLS e isolamento multi-tenant (testes automatizados de autorização entre organizações/CNPJs)
- [ ] Revisão de armazenamento (buckets privados, URLs assinadas de curta duração), transmissão (TLS) e logs (sem dados fiscais/sensíveis)
- [ ] Confirmação de que `service_role` key nunca chega ao cliente
- [ ] Política de retenção aplicada por padrão (nenhuma exclusão automática até definição de P2)
- [ ] Rate limiting e proteção contra abuso em endpoints públicos e de autenticação
- [ ] `/security-review` e `/code-review` executados sobre o código acumulado, achados corrigidos
- [ ] Observabilidade: Sentry (ou equivalente) configurado com scrubbing de dados sensíveis
- [ ] Documentos de Política de Privacidade e Termos de Uso coerentes com as operações reais (texto — não é código, mas é entrega do milestone)
- [ ] Checklist de P14.9 revisado item a item com status

**Commit final:** `chore(security): hardening de segurança, RLS e conformidade LGPD pré-lançamento`

---

## Milestone 18 — Deploy e lançamento

**Branch:** `milestone/18-deploy-launch`

**Objetivo:** configurar ambientes finais e publicar a plataforma em produção.

**Entregas:**
- [ ] Ambientes configurados: desenvolvimento, preview/homologação (`noindex`, ADN produção restrita) e produção (ADN produção, indexável)
- [ ] Variáveis de ambiente de produção configuradas na Vercel e no Supabase (incluindo `NEXT_PUBLIC_SITE_URL` definitivo — resolve P3)
- [ ] Domínio oficial configurado e certificado TLS validado
- [ ] Certificado de assinatura de código (Authenticode) adquirido e instalador do agente assinado (resolve P11)
- [ ] Pipeline de release do agente (build assinado, versão mínima publicada no backend)
- [ ] Deploy de produção na Vercel com checklist de smoke test pós-deploy (login, sincronização de um CNPJ de teste, exportação, DANFSe, checkout Stripe em modo teste)
- [ ] Monitoramento ativo (erros, filas, heartbeat de agentes) confirmado em produção
- [ ] Rollback testado (reverter deploy e/ou versão do agente)

**Commit final:** `chore(release): configura ambientes de produção e publica o lançamento inicial do Segue Nota`

---

## Observações de execução

- Cada milestone deve ser testável isoladamente antes de avançar (PRD §22) — não pular para o próximo com testes conhecidos quebrados.
- Pendências do PRD (§21) que ainda não tiverem decisão ao chegar no milestone correspondente seguem o "padrão até a definição" indicado no PRD, nunca bloqueiam o milestone.
- A PoC do agente (Milestone 8) pode mudar decisões estruturais (Windows Service vs. usuário, local do certificado) — se isso acontecer, atualizar o CLAUDE.md e os milestones 9-10 antes de continuar.
- Milestones 2-6 (UI mockada) e 7-16 (backend real) podem, na prática, ter alguma sobreposição de branches de curta duração para não bloquear um time pequeno — mas a ordem de entrega e substituição de mocks deve ser respeitada.
