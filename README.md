# Segue Nota

SaaS de gestão e monitoramento de NFS-e para escritórios contábeis e empresas.

Documentação:

- [docs/PRD.md](docs/PRD.md) — especificação de produto (requisitos funcionais, regras fiscais, modelo de dados)
- [CLAUDE.md](CLAUDE.md) — briefing técnico (stack, convenções, princípios de arquitetura)
- [PLAN.md](PLAN.md) — plano de execução por milestones

## Estrutura do monorepo

```
seguenota/
├── apps/
│   ├── web/              # Next.js (App Router) — frontend + backend
│   └── agent/             # Agente Windows em .NET 10
├── packages/
│   └── shared/            # DTOs/contratos compartilhados agente ↔ backend
├── supabase/
│   └── migrations/        # Migrations versionadas (Supabase CLI)
└── docs/
    └── PRD.md
```

## Requisitos

- Node.js 22+ e npm 10+
- .NET 10 SDK
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) (`supabase --version`)
- [Vercel CLI](https://vercel.com/docs/cli) (`vercel --version`)
- Docker Desktop (necessário para `supabase start` rodar o banco local)

## Setup local

1. Clonar o repositório e instalar dependências do workspace:

   ```bash
   npm install
   ```

2. Copiar as variáveis de ambiente:

   ```bash
   cp .env.example apps/web/.env.local
   ```

   Preencher com as credenciais do projeto Supabase (ver abaixo) e demais serviços.

3. Subir o Supabase local (Postgres, Auth, Storage):

   ```bash
   supabase start
   ```

   Isso imprime a URL e as chaves locais (`anon`, `service_role`) — usar em `apps/web/.env.local`.

4. Rodar as migrations:

   ```bash
   supabase db reset
   ```

5. Subir o frontend/backend web:

   ```bash
   npm run dev
   ```

   Acessar http://localhost:3000.

## Testes

```bash
npm run lint         # ESLint
npm run typecheck    # TypeScript (apps/web + packages/shared)
npm run test         # Vitest (unidade)
npm run test:e2e     # Playwright (e2e, requer navegadores instalados: npx playwright install)
```

## Agente Windows (apps/agent)

```bash
cd apps/agent
dotnet build
dotnet run
```

O agente ainda é um esqueleto (Worker Service vazio) — a PoC obrigatória (PRD §9.9) e a implementação real do protocolo chegam nos Milestones 8-9.

## Deploy

- **Vercel:** projeto `seguenota` linkado via `vercel link`. Deploy de preview com `vercel`, produção com `vercel --prod`.
- **Supabase:** projeto remoto vinculado via `supabase link --project-ref <ref>`. Migrations aplicadas com `supabase db push`.

## Convenções

Ver [CLAUDE.md](CLAUDE.md) para convenções de código, segurança, RLS, identidade visual e áreas sensíveis do projeto.
