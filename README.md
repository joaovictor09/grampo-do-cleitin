# grampo-do-cleitin

Monorepo com a API e o frontend do projeto.

## Estrutura

```
.
├── server/   # API HTTP (Fastify), recebe e distribui webhooks em tempo real
└── web/      # Frontend (TanStack Start)
```

## server

Stack: Fastify, Zod, Drizzle ORM (Postgres) e Redis (pub/sub).

Recebe webhooks via HTTP e transmite os eventos em tempo real por SSE (Server-Sent Events), usando Redis pub/sub para distribuir eventos entre instâncias.

### Setup

```bash
cd server
npm install
cp .env.example .env

# sobe Postgres e Redis
docker compose up -d

# gera e aplica as migrations
npm run db:generate
npm run db:migrate

npm run dev
```

### Scripts

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe o servidor em modo desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Roda o build de produção |
| `npm run test` | Roda os testes |
| `npm run test:watch` | Roda os testes em modo watch |
| `npm run db:generate` | Gera as migrations a partir do schema |
| `npm run db:migrate` | Aplica as migrations pendentes |
| `npm run db:push` | Sincroniza o schema direto no banco (dev) |
| `npm run db:studio` | Abre o Drizzle Studio |

## web

Stack: TanStack Start, TanStack Router, React, Tailwind CSS.

### Setup

```bash
cd web
npm install
npm run dev
```
