# Restaurant Intelligence

A local, TypeScript-first restaurant operations prototype. It turns historical menu sales into explainable purchase recommendations, supports manager approval and purchase orders, and records receiving, inventory, prep yield, and waste data.

## Run locally

Requirements: Node.js 20+ and pnpm 10+.

```bash
pnpm install
cp .env.example apps/web/.env.local
pnpm dev
```

- Web application: http://localhost:3000
- NestJS API: http://localhost:4000/api

`API_BASE_URL` defaults to `http://localhost:4000/api`, so copying the environment file is optional for the standard local setup.

Useful checks:

```bash
pnpm typecheck
pnpm build
```

AWS deployment files are included for Amplify Hosting and ECS Express Mode. Once the AWS resources and GitHub variables are configured, pushes to `main` deploy the API through GitHub Actions and the UI through Amplify continuous deployment. See [docs/aws-deployment.md](docs/aws-deployment.md).

## Architecture

```text
Browser → Next.js App Router (SSR + focused client forms) → NestJS REST API
        → application/domain services → JsonStore repository → data/*.json
```

The repository uses plain pnpm workspaces:

- `apps/web` — Next.js, React, Tailwind, shadcn-style UI primitives, and Recharts
- `apps/api` — one modular NestJS server
- `packages/shared` — domain interfaces shared by both applications
- `data` — immutable prototype seed data

All calculations live in NestJS services. React pages request completed forecasts, yields, recommendations, and explanations. JSON reads are isolated in `JsonStore`; mutations live only in server memory and are restored using `POST /api/demo/reset` or the development UI button.

## Domain flow

1. `ForecastingService` weighs four comparable weekdays 40/30/20/10 and applies deterministic trend and seasonal modifiers.
2. `RecipeService` recursively expands menu and prep recipes, accumulating usable ingredient demand and rejecting cycles.
3. `YieldService` blends baseline, full history, recent prep sessions, and supplier observations.
4. `PurchasingService` converts usable demand to raw demand, subtracts stock and incoming orders, adds safety stock, rounds to supplier package sizes, and compares usable supplier cost.
5. Approved recommendations generate purchase orders. Receiving updates in-memory inventory.

## Main routes

Web pages: `/dashboard`, `/inventory`, `/forecast`, `/purchasing`, `/purchase-orders`, `/yield`, and `/waste`.

The API exposes the corresponding REST resources under `/api`, including mutations for counts, prep sessions, waste, recommendation decisions, purchase orders, receiving, and demo reset.
