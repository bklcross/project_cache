# Antonio AI

A focused kitchen planning tool inspired by Chef Antonio Friscia. It helps restaurants track current inventory, save recipes, and calculate the ingredients needed for planned production.

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

- `apps/web` — Next.js, React, Tailwind, and small shared UI primitives
- `apps/api` — one modular NestJS server
- `packages/shared` — domain interfaces shared by both applications
- `data` — immutable prototype seed data

Planning calculations live in NestJS rather than React. JSON reads are isolated in `JsonStore`; inventory updates and newly created recipes are stored in server memory for the prototype. Restarting the API restores the seed data.

## Domain flow

1. View and update current ingredient inventory.
2. Create a recipe with its batch yield and ingredient quantities.
3. Enter planned portions for one or more recipes.
4. `PlanningService` scales and combines the recipes, then shows required quantities, inventory remaining, and shortages.

## Main routes

Web pages: `/inventory`, `/recipes`, and `/planner`.

API routes:

- `GET /api/inventory`
- `POST /api/inventory/counts`
- `GET /api/ingredients`
- `POST /api/ingredients`
- `GET /api/recipes`
- `POST /api/recipes`
- `POST /api/plans/calculate`
