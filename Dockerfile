FROM node:22-alpine AS build
WORKDIR /workspace
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc tsconfig.base.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
RUN pnpm install --frozen-lockfile
COPY apps/api apps/api
COPY packages/shared packages/shared
RUN pnpm --filter @restaurant/shared build && pnpm --filter @restaurant/api build

FROM node:22-alpine AS runtime
ENV NODE_ENV=production PORT=4000 DATA_DIR=/app/data
WORKDIR /app
COPY --from=build /workspace/node_modules ./node_modules
COPY --from=build /workspace/packages/shared ./packages/shared
COPY --from=build /workspace/apps/api/package.json ./package.json
COPY --from=build /workspace/apps/api/dist ./dist
COPY data ./data
EXPOSE 4000
USER node
CMD ["node", "dist/main.js"]
