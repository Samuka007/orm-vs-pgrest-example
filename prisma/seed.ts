import { PrismaClient, PostStatus } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 创建连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// 创建 Prisma adapter
const adapter = new PrismaPg(pool)

// 创建 Prisma 客户端
const prisma = new PrismaClient({
  adapter,
})

async function main() {
  console.log('🌱 开始播种数据...')

  // ===========================================
  // 创建用户
  // ===========================================
  console.log('📝 创建用户...')

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        name: 'Alice Chen',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        bio: '全栈开发者，热爱开源技术和技术写作。',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        name: 'Bob Wang',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        bio: '前端工程师，专注于 React 和 TypeScript。',
      },
    }),
    prisma.user.upsert({
      where: { email: 'charlie@example.com' },
      update: {},
      create: {
        email: 'charlie@example.com',
        name: 'Charlie Liu',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
        bio: '后端开发者，擅长数据库设计和系统架构。',
      },
    }),
  ])

  console.log(`✅ 创建了 ${users.length} 个用户`)

  // ===========================================
  // 创建分类
  // ===========================================
  console.log('📁 创建分类...')

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'frontend' },
      update: {},
      create: {
        name: '前端开发',
        slug: 'frontend',
        description: '前端技术相关文章，包括 React、Vue、CSS 等',
        sortOrder: 1,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'backend' },
      update: {},
      create: {
        name: '后端开发',
        slug: 'backend',
        description: '后端技术相关文章，包括 Node.js、数据库、API 设计等',
        sortOrder: 2,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'devops' },
      update: {},
      create: {
        name: 'DevOps',
        slug: 'devops',
        description: '运维和部署相关文章，包括 Docker、CI/CD、云服务等',
        sortOrder: 3,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: '教程',
        slug: 'tutorial',
        description: '各类技术教程和入门指南',
        sortOrder: 4,
      },
    }),
  ])

  console.log(`✅ 创建了 ${categories.length} 个分类`)

  // ===========================================
  // 创建标签
  // ===========================================
  console.log('🏷️ 创建标签...')

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react', color: '#61DAFB' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nextjs' },
      update: {},
      create: { name: 'Next.js', slug: 'nextjs', color: '#000000' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript', color: '#3178C6' },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: { name: 'Prisma', slug: 'prisma', color: '#2D3748' },
    }),
    prisma.tag.upsert({
      where: { slug: 'postgresql' },
      update: {},
      create: { name: 'PostgreSQL', slug: 'postgresql', color: '#336791' },
    }),
    prisma.tag.upsert({
      where: { slug: 'docker' },
      update: {},
      create: { name: 'Docker', slug: 'docker', color: '#2496ED' },
    }),
    prisma.tag.upsert({
      where: { slug: 'tailwindcss' },
      update: {},
      create: { name: 'Tailwind CSS', slug: 'tailwindcss', color: '#06B6D4' },
    }),
    prisma.tag.upsert({
      where: { slug: 'api' },
      update: {},
      create: { name: 'API', slug: 'api', color: '#10B981' },
    }),
  ])

  console.log(`✅ 创建了 ${tags.length} 个标签`)

  // ===========================================
  // 创建文章
  // ===========================================
  console.log('📄 创建文章...')

  const [alice, bob, charlie] = users
  const [frontend, backend, devops, tutorial] = categories
  const tagMap = Object.fromEntries(tags.map((t) => [t.slug, t]))

  const posts = await Promise.all([
    // 文章 1: Next.js 入门
    prisma.post.upsert({
      where: { slug: 'getting-started-with-nextjs-15' },
      update: {},
      create: {
        title: 'Next.js 15 入门指南：从零开始构建现代 Web 应用',
        slug: 'getting-started-with-nextjs-15',
        content: `
# Next.js 15 入门指南

Next.js 是一个基于 React 的全栈框架，提供了服务端渲染、静态生成、API 路由等强大功能。

## 为什么选择 Next.js？

1. **零配置**：开箱即用的 TypeScript、ESLint 支持
2. **混合渲染**：支持 SSR、SSG、ISR 多种渲染模式
3. **App Router**：基于文件系统的路由，支持布局、加载状态等
4. **Server Components**：默认使用服务端组件，提升性能

## 快速开始

\`\`\`bash
npx create-next-app@latest my-app
cd my-app
npm run dev
\`\`\`

## 项目结构

\`\`\`
my-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── components/
├── public/
└── package.json
\`\`\`

## 总结

Next.js 15 带来了许多激动人心的新特性，是构建现代 Web 应用的绝佳选择。
        `.trim(),
        excerpt:
          'Next.js 是一个基于 React 的全栈框架，本文将带你从零开始学习 Next.js 15 的核心概念和最佳实践。',
        coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
        status: PostStatus.PUBLISHED,
        viewCount: 1234,
        publishedAt: new Date('2024-01-15'),
        authorId: alice.id,
        categoryId: tutorial.id,
        tags: {
          create: [
            { tagId: tagMap['nextjs'].id },
            { tagId: tagMap['react'].id },
            { tagId: tagMap['typescript'].id },
          ],
        },
      },
    }),

    // 文章 2: Prisma ORM
    prisma.post.upsert({
      where: { slug: 'prisma-orm-complete-guide' },
      update: {},
      create: {
        title: 'Prisma ORM 完全指南：类型安全的数据库访问',
        slug: 'prisma-orm-complete-guide',
        content: `
# Prisma ORM 完全指南

Prisma 是一个现代化的 ORM，提供类型安全的数据库访问和自动生成的查询构建器。

## 核心概念

### Schema 定义

\`\`\`prisma
model User {
  id    String @id @default(uuid())
  email String @unique
  name  String
  posts Post[]
}

model Post {
  id       String @id @default(uuid())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}
\`\`\`

### 类型安全查询

\`\`\`typescript
const user = await prisma.user.findUnique({
  where: { email: 'alice@example.com' },
  include: { posts: true }
})
// user 的类型会自动推断，包含 posts 关联
\`\`\`

## 迁移管理

\`\`\`bash
# 创建迁移
npx prisma migrate dev --name init

# 应用迁移
npx prisma migrate deploy
\`\`\`

## 总结

Prisma 让数据库操作变得简单且类型安全，是 Node.js 项目的首选 ORM。
        `.trim(),
        excerpt:
          'Prisma 是一个现代化的 ORM，本文将深入介绍 Prisma 的核心概念、查询语法和最佳实践。',
        coverImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d',
        status: PostStatus.PUBLISHED,
        viewCount: 856,
        publishedAt: new Date('2024-01-20'),
        authorId: bob.id,
        categoryId: backend.id,
        tags: {
          create: [
            { tagId: tagMap['prisma'].id },
            { tagId: tagMap['postgresql'].id },
            { tagId: tagMap['typescript'].id },
          ],
        },
      },
    }),

    // 文章 3: Docker 部署
    prisma.post.upsert({
      where: { slug: 'docker-deployment-best-practices' },
      update: {},
      create: {
        title: 'Docker 部署最佳实践：从开发到生产',
        slug: 'docker-deployment-best-practices',
        content: `
# Docker 部署最佳实践

Docker 让应用部署变得简单可重复，本文分享一些实用的部署技巧。

## Dockerfile 优化

### 多阶段构建

\`\`\`dockerfile
# 构建阶段
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 运行阶段
FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
CMD ["npm", "start"]
\`\`\`

## Docker Compose

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://...
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
\`\`\`

## 总结

合理使用 Docker 可以大大简化部署流程，提高应用的可移植性。
        `.trim(),
        excerpt:
          'Docker 让应用部署变得简单可重复，本文分享从开发到生产的 Docker 部署最佳实践。',
        coverImage: 'https://images.unsplash.com/photo-1605745341112-85968b19335b',
        status: PostStatus.PUBLISHED,
        viewCount: 567,
        publishedAt: new Date('2024-01-25'),
        authorId: charlie.id,
        categoryId: devops.id,
        tags: {
          create: [{ tagId: tagMap['docker'].id }, { tagId: tagMap['postgresql'].id }],
        },
      },
    }),

    // 文章 4: Tailwind CSS
    prisma.post.upsert({
      where: { slug: 'tailwindcss-tips-and-tricks' },
      update: {},
      create: {
        title: 'Tailwind CSS 实用技巧：提升开发效率',
        slug: 'tailwindcss-tips-and-tricks',
        content: `
# Tailwind CSS 实用技巧

Tailwind CSS 是一个实用优先的 CSS 框架，本文分享一些提升开发效率的技巧。

## 常用模式

### 响应式设计

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 卡片内容 -->
</div>
\`\`\`

### 暗色模式

\`\`\`html
<div class="bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
  内容
</div>
\`\`\`

## 自定义配置

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#0ea5e9',
      },
    },
  },
}
\`\`\`

## 总结

掌握这些技巧可以让你更高效地使用 Tailwind CSS 构建美观的界面。
        `.trim(),
        excerpt:
          'Tailwind CSS 是一个实用优先的 CSS 框架，本文分享一些提升开发效率的实用技巧。',
        coverImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2',
        status: PostStatus.PUBLISHED,
        viewCount: 432,
        publishedAt: new Date('2024-02-01'),
        authorId: alice.id,
        categoryId: frontend.id,
        tags: {
          create: [{ tagId: tagMap['tailwindcss'].id }, { tagId: tagMap['react'].id }],
        },
      },
    }),

    // 文章 5: 草稿文章
    prisma.post.upsert({
      where: { slug: 'upcoming-features-preview' },
      update: {},
      create: {
        title: '即将推出的新功能预览',
        slug: 'upcoming-features-preview',
        content: `
# 即将推出的新功能

这是一篇草稿文章，预览即将推出的新功能...

## 功能列表

- [ ] 实时协作编辑
- [ ] AI 辅助写作
- [ ] 高级分析面板

敬请期待！
        `.trim(),
        excerpt: '预览即将推出的新功能，包括实时协作、AI 辅助写作等。',
        status: PostStatus.DRAFT,
        viewCount: 0,
        authorId: bob.id,
        categoryId: tutorial.id,
        tags: {
          create: [{ tagId: tagMap['nextjs'].id }],
        },
      },
    }),
  ])

  console.log(`✅ 创建了 ${posts.length} 篇文章`)

  // ===========================================
  // 创建评论
  // ===========================================
  console.log('💬 创建评论...')

  const publishedPosts = posts.filter((p) => p.status === PostStatus.PUBLISHED)

  const comments = await Promise.all([
    // 文章 1 的评论
    prisma.comment.create({
      data: {
        content: '非常棒的入门教程！Next.js 15 的新特性确实很强大。',
        postId: publishedPosts[0].id,
        authorId: bob.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: '请问 App Router 和 Pages Router 有什么主要区别？',
        postId: publishedPosts[0].id,
        authorId: charlie.id,
      },
    }),

    // 文章 2 的评论
    prisma.comment.create({
      data: {
        content: 'Prisma 的类型推断真的太好用了，再也不用担心类型错误。',
        postId: publishedPosts[1].id,
        authorId: alice.id,
      },
    }),

    // 文章 3 的评论
    prisma.comment.create({
      data: {
        content: '多阶段构建确实能大幅减小镜像体积，学到了！',
        postId: publishedPosts[2].id,
        authorId: alice.id,
      },
    }),
    prisma.comment.create({
      data: {
        content: '能否分享一下生产环境的 Docker Compose 配置？',
        postId: publishedPosts[2].id,
        authorId: bob.id,
      },
    }),
  ])

  // 创建嵌套评论（回复）
  const nestedComments = await Promise.all([
    prisma.comment.create({
      data: {
        content:
          'App Router 使用 React Server Components，默认在服务端渲染，性能更好。Pages Router 是传统的客户端渲染模式。',
        postId: publishedPosts[0].id,
        authorId: alice.id,
        parentId: comments[1].id, // 回复 Charlie 的问题
      },
    }),
    prisma.comment.create({
      data: {
        content: '感谢解答！我这就去试试 App Router。',
        postId: publishedPosts[0].id,
        authorId: charlie.id,
        parentId: comments[1].id, // 继续回复
      },
    }),
  ])

  console.log(`✅ 创建了 ${comments.length + nestedComments.length} 条评论`)

  console.log('🎉 数据播种完成！')
}

main()
  .catch((e) => {
    console.error('❌ 播种失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })