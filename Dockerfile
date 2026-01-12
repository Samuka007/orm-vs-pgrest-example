# Dockerfile
# Next.js 应用多阶段构建

# ===========================================
# Stage 1: Dependencies
# ===========================================
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@9 --activate

# 复制依赖文件
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# 安装依赖
RUN pnpm install --frozen-lockfile

# ===========================================
# Stage 2: Builder
# ===========================================
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9 --activate

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 构建时注入环境变量
ARG NEXT_PUBLIC_POSTGREST_URL=https://pgrest-k8s-argocd-au.samuka007.com
ARG NEXT_PUBLIC_APP_URL=https://cmp-k8s-argocd-au.samuka007.com
ENV NEXT_PUBLIC_POSTGREST_URL=${NEXT_PUBLIC_POSTGREST_URL}
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# 生成 Prisma Client（需要 DATABASE_URL 但不实际连接）
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN pnpm db:generate

# 构建 Next.js
RUN pnpm build

# ===========================================
# Stage 3: Runner
# ===========================================
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 复制必要文件
# 如果存在 public 目录则复制，否则创建空目录
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
# 创建空的 public 目录（如果项目有 public 目录，需要取消下面的注释）
RUN mkdir -p ./public

# 设置权限
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]