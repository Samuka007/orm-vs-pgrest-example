# 前端数据库查询对比项目架构设计

## 1. 项目概述

### 1.1 目标
比较两种前端数据库查询方式在实际应用中的代码范式、易用程度与解耦程度：

| 方案 | 数据获取端 | 技术栈 | 渲染方式 |
|------|-----------|--------|---------|
| **Client 端方案** | 浏览器 | `@supabase/postgrest-js` + PostgREST | Client Component |
| **Server 端方案** | Node.js 服务器 | Prisma ORM | Server Component (SSR) |

### 1.2 核心约束
- **零 CRUD 接口**：不创建任何 `/api` 端点
- **直接数据访问**：Client 端直接访问 PostgREST，Server 端直接使用 ORM
- **最终一致性**：两种方案展示相同的数据，便于对比

---

## 2. 数据模型设计

### 2.1 业务场景：博客内容管理系统

选择博客系统作为业务场景，因为它能充分展示：
- 一对多关系（作者 → 文章，文章 → 评论）
- 多对多关系（文章 ↔ 标签）
- 分页、过滤、排序等常见查询模式
- 聚合统计场景

### 2.2 实体关系图 (ERD)

```mermaid
erDiagram
    User ||--o{ Post : writes
    User ||--o{ Comment : writes
    Post ||--o{ Comment : has
    Post }o--o{ Tag : tagged_with
    Category ||--o{ Post : contains

    User {
        uuid id PK
        string email UK
        string name
        string avatar_url
        string bio
        timestamp created_at
        timestamp updated_at
    }

    Post {
        uuid id PK
        string title
        string slug UK
        text content
        text excerpt
        string cover_image
        enum status
        uuid author_id FK
        uuid category_id FK
        int view_count
        timestamp published_at
        timestamp created_at
        timestamp updated_at
    }

    Comment {
        uuid id PK
        text content
        uuid post_id FK
        uuid author_id FK
        uuid parent_id FK
        timestamp created_at
        timestamp updated_at
    }

    Category {
        uuid id PK
        string name UK
        string slug UK
        string description
        int sort_order
    }

    Tag {
        uuid id PK
        string name UK
        string slug UK
        string color
    }

    PostTag {
        uuid post_id FK
        uuid tag_id FK
    }
```

### 2.3 数据模型详细定义

#### User（用户）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱 |
| name | VARCHAR(100) | NOT NULL | 显示名称 |
| avatar_url | VARCHAR(500) | | 头像 URL |
| bio | TEXT | | 个人简介 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | | 更新时间 |

#### Post（文章）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| title | VARCHAR(200) | NOT NULL | 标题 |
| slug | VARCHAR(200) | UNIQUE, NOT NULL | URL 友好标识 |
| content | TEXT | NOT NULL | Markdown 内容 |
| excerpt | TEXT | | 摘要 |
| cover_image | VARCHAR(500) | | 封面图 URL |
| status | ENUM | DEFAULT draft | draft/published/archived |
| author_id | UUID | FK → User | 作者 |
| category_id | UUID | FK → Category | 分类 |
| view_count | INTEGER | DEFAULT 0 | 浏览次数 |
| published_at | TIMESTAMP | | 发布时间 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | | 更新时间 |

#### Comment（评论）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| content | TEXT | NOT NULL | 评论内容 |
| post_id | UUID | FK → Post | 所属文章 |
| author_id | UUID | FK → User | 评论者 |
| parent_id | UUID | FK → Comment, NULL | 父评论（支持嵌套） |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |
| updated_at | TIMESTAMP | | 更新时间 |

#### Category（分类）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(50) | UNIQUE, NOT NULL | 分类名 |
| slug | VARCHAR(50) | UNIQUE, NOT NULL | URL 标识 |
| description | TEXT | | 描述 |
| sort_order | INTEGER | DEFAULT 0 | 排序权重 |

#### Tag（标签）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| name | VARCHAR(30) | UNIQUE, NOT NULL | 标签名 |
| slug | VARCHAR(30) | UNIQUE, NOT NULL | URL 标识 |
| color | VARCHAR(7) | | 颜色代码 |

#### PostTag（文章-标签关联）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| post_id | UUID | FK → Post | 文章 ID |
| tag_id | UUID | FK → Tag | 标签 ID |
| | | PK(post_id, tag_id) | 联合主键 |

---

## 3. 技术栈选型

### 3.1 核心框架

| 技术 | 版本 | 用途 |
|------|------|------|
| **Next.js** | 15.x | React 全栈框架，使用 App Router |
| **React** | 19.x | UI 库 |
| **TypeScript** | 5.x | 类型安全 |

### 3.2 数据层

| 技术 | 版本 | 用途 |
|------|------|------|
| **PostgreSQL** | 16.x | 关系型数据库 |
| **Prisma** | 6.x | Server 端 ORM |
| **PostgREST** | 12.x | RESTful API 自动生成 |
| **@supabase/postgrest-js** | 1.x | Client 端 PostgREST 客户端 |

### 3.3 开发工具

| 技术 | 用途 |
|------|------|
| **Docker / Docker Compose** | 容器化部署 |
| **Nix Flake** | 开发环境管理 |
| **ESLint + Prettier** | 代码规范 |
| **Tailwind CSS** | 样式框架 |

### 3.4 配置文件规划

#### TypeScript 配置 (tsconfig.json)
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

#### Prisma Schema 结构
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String
  avatarUrl String?   @map("avatar_url")
  bio       String?
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  @@map("users")
}

// ... 其他模型定义
```

---

## 4. 项目目录结构

```
db-frontend-example/
├── plan/                          # 规划文档
│   ├── requirement.md
│   └── architecture.md
│
├── docker/                        # Docker 相关配置
│   ├── postgres/
│   │   └── init.sql              # 数据库初始化脚本
│   └── postgrest/
│       └── postgrest.conf        # PostgREST 配置
│
├── prisma/
│   ├── schema.prisma             # Prisma 数据模型
│   ├── migrations/               # 数据库迁移文件
│   └── seed.ts                   # 种子数据
│
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # 根布局
│   │   ├── page.tsx              # 首页
│   │   ├── globals.css           # 全局样式
│   │   │
│   │   ├── (client)/             # Client 端方案路由组
│   │   │   ├── layout.tsx
│   │   │   └── posts/
│   │   │       ├── page.tsx      # 文章列表 (Client)
│   │   │       └── [slug]/
│   │   │           └── page.tsx  # 文章详情 (Client)
│   │   │
│   │   └── (server)/             # Server 端方案路由组
│   │       ├── layout.tsx
│   │       └── posts/
│   │           ├── page.tsx      # 文章列表 (Server)
│   │           └── [slug]/
│   │               └── page.tsx  # 文章详情 (Server)
│   │
│   ├── components/
│   │   ├── ui/                   # 基础 UI 组件
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── pagination.tsx
│   │   │   └── skeleton.tsx
│   │   │
│   │   ├── posts/                # 文章相关组件
│   │   │   ├── post-card.tsx     # 文章卡片 (共享)
│   │   │   ├── post-list.tsx     # 文章列表 (共享)
│   │   │   ├── post-detail.tsx   # 文章详情 (共享)
│   │   │   └── post-filters.tsx  # 筛选器 (共享)
│   │   │
│   │   ├── comments/             # 评论相关组件
│   │   │   ├── comment-list.tsx
│   │   │   └── comment-item.tsx
│   │   │
│   │   └── layout/               # 布局组件
│   │       ├── header.tsx
│   │       ├── sidebar.tsx
│   │       └── footer.tsx
│   │
│   ├── lib/
│   │   ├── prisma.ts             # Prisma 客户端单例
│   │   ├── postgrest.ts          # PostgREST 客户端配置
│   │   └── utils.ts              # 工具函数
│   │
│   ├── hooks/                    # 自定义 Hooks (Client 端)
│   │   ├── use-posts.ts          # 文章数据 Hook
│   │   ├── use-comments.ts       # 评论数据 Hook
│   │   └── use-pagination.ts     # 分页 Hook
│   │
│   ├── actions/                  # Server Actions (Server 端)
│   │   ├── posts.ts              # 文章相关 Actions
│   │   └── comments.ts           # 评论相关 Actions
│   │
│   └── types/
│       ├── index.ts              # 类型导出
│       ├── database.ts           # 数据库类型 (Prisma 生成)
│       └── api.ts                # API 响应类型
│
├── docker-compose.yml            # Docker Compose 配置
├── flake.nix                     # Nix Flake 开发环境
├── flake.lock
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── next.config.ts
├── .env.example
├── .env.local                    # 本地环境变量 (gitignore)
└── README.md
```

### 4.1 目录设计说明

#### 路由组设计
使用 Next.js 的路由组 `(client)` 和 `(server)` 来分离两种方案：
- `/(client)/posts` → Client 端方案的文章页面
- `/(server)/posts` → Server 端方案的文章页面

这样可以在同一个项目中并行展示两种方案，便于对比。

#### 组件复用策略
- **UI 组件** (`components/ui/`)：纯展示组件，两种方案共享
- **业务组件** (`components/posts/`, `components/comments/`)：接收数据作为 props，两种方案共享
- **数据获取逻辑**：分别在 `hooks/`（Client）和 `actions/`（Server）中实现

---

## 5. Docker 服务架构

### 5.1 服务拓扑图

```mermaid
graph TB
    subgraph Docker Network
        PG[PostgreSQL:5432]
        PR[PostgREST:3001]
        NX[Next.js:3000]
    end

    Browser[浏览器]

    Browser -->|SSR 请求| NX
    NX -->|Prisma ORM| PG
    Browser -->|PostgREST API| PR
    PR -->|SQL| PG

    style PG fill:#336791
    style PR fill:#4CAF50
    style NX fill:#000000,color:#fff
```

### 5.2 Docker Compose 配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL 数据库
  postgres:
    image: postgres:16-alpine
    container_name: blog_postgres
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: blog
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/postgres/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5
    networks:
      - blog_network

  # PostgREST API 服务
  postgrest:
    image: postgrest/postgrest:v12.2.3
    container_name: blog_postgrest
    environment:
      PGRST_DB_URI: postgres://postgres:postgres@postgres:5432/blog
      PGRST_DB_SCHEMA: public
      PGRST_DB_ANON_ROLE: anon
      PGRST_SERVER_PORT: 3001
      PGRST_OPENAPI_SERVER_PROXY_URI: http://localhost:3001
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - blog_network

  # Next.js 应用 (开发模式)
  nextjs:
    build:
      context: .
      dockerfile: Dockerfile.dev
    container_name: blog_nextjs
    environment:
      DATABASE_URL: postgres://postgres:postgres@postgres:5432/blog
      NEXT_PUBLIC_POSTGREST_URL: http://localhost:3001
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
      - /app/.next
    depends_on:
      postgres:
        condition: service_healthy
      postgrest:
        condition: service_started
    networks:
      - blog_network

volumes:
  postgres_data:

networks:
  blog_network:
    driver: bridge
```

### 5.3 数据库初始化脚本

```sql
-- docker/postgres/init.sql

-- 创建匿名角色供 PostgREST 使用
CREATE ROLE anon NOLOGIN;

-- 创建枚举类型
CREATE TYPE post_status AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- 创建表结构
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_url VARCHAR(500),
    bio TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(30) UNIQUE NOT NULL,
    slug VARCHAR(30) UNIQUE NOT NULL,
    color VARCHAR(7)
);

CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    cover_image VARCHAR(500),
    status post_status DEFAULT 'DRAFT',
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    view_count INTEGER DEFAULT 0,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE post_tags (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- 创建索引
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_category ON posts(category_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);

-- 授予 anon 角色读取权限
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

-- 创建视图供 PostgREST 使用（带关联数据）
CREATE VIEW posts_with_author AS
SELECT 
    p.*,
    json_build_object(
        'id', u.id,
        'name', u.name,
        'avatar_url', u.avatar_url
    ) as author
FROM posts p
LEFT JOIN users u ON p.author_id = u.id;

GRANT SELECT ON posts_with_author TO anon;
```

### 5.4 环境变量配置

```bash
# .env.example

# Database
DATABASE_URL="postgres://postgres:postgres@localhost:5432/blog"

# PostgREST (Client 端使用)
NEXT_PUBLIC_POSTGREST_URL="http://localhost:3001"

# Next.js
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 6. 对比用例设计

### 6.1 用例矩阵

| 用例 | 场景描述 | Client 端特点 | Server 端特点 |
|------|---------|--------------|--------------|
| UC1 | 文章列表（分页） | 客户端分页，无刷新 | 服务端分页，SEO 友好 |
| UC2 | 文章详情（关联查询） | 多次请求或嵌入查询 | 单次 ORM 查询 |
| UC3 | 按标签筛选 | URL 参数 + 客户端过滤 | 服务端过滤 |
| UC4 | 评论加载 | 实时加载，乐观更新 | 页面刷新获取 |
| UC5 | 热门文章统计 | 需要额外聚合请求 | ORM 聚合查询 |
| UC6 | 全文搜索 | PostgREST 全文搜索 | Prisma 全文搜索 |

### 6.2 详细用例说明

#### UC1: 文章列表（分页）

**场景**：展示已发布文章列表，支持分页

**Client 端实现**：
```typescript
// hooks/use-posts.ts
import { useEffect, useState } from 'react'
import { postgrest } from '@/lib/postgrest'

export function usePosts(page: number, pageSize: number = 10) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const { data, count } = await postgrest
        .from('posts')
        .select('*, author:users(id, name, avatar_url)', { count: 'exact' })
        .eq('status', 'PUBLISHED')
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)
      
      setPosts(data ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    }
    fetchPosts()
  }, [page, pageSize])

  return { posts, loading, total }
}
```

**Server 端实现**：
```typescript
// actions/posts.ts
import { prisma } from '@/lib/prisma'

export async function getPosts(page: number, pageSize: number = 10) {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ])

  return { posts, total }
}
```

**对比分析**：
| 维度 | Client 端 | Server 端 |
|------|----------|----------|
| 首屏加载 | 需要等待 JS 执行后请求 | HTML 直出，更快 |
| SEO | 需要额外处理 | 天然支持 |
| 用户体验 | 分页无刷新 | 需要页面跳转 |
| 代码复杂度 | 需要管理状态 | 更简洁 |

---

#### UC2: 文章详情（关联查询）

**场景**：展示文章详情，包含作者信息、分类、标签

**Client 端实现**：
```typescript
// 使用 PostgREST 的嵌入查询
const { data: post } = await postgrest
  .from('posts')
  .select(`
    *,
    author:users(id, name, avatar_url, bio),
    category:categories(id, name, slug),
    tags:post_tags(tag:tags(id, name, slug, color))
  `)
  .eq('slug', slug)
  .single()
```

**Server 端实现**：
```typescript
// 使用 Prisma 的 include
const post = await prisma.post.findUnique({
  where: { slug },
  include: {
    author: true,
    category: true,
    tags: {
      include: { tag: true }
    }
  }
})
```

**对比分析**：
| 维度 | Client 端 | Server 端 |
|------|----------|----------|
| 查询语法 | 字符串模板，易出错 | 类型安全，IDE 提示 |
| 类型推断 | 需要手动定义 | 自动推断 |
| N+1 问题 | PostgREST 自动处理 | Prisma 自动处理 |

---

#### UC3: 按标签筛选

**场景**：根据标签筛选文章列表

**Client 端实现**：
```typescript
// 使用 PostgREST 的关联过滤
const { data } = await postgrest
  .from('posts')
  .select('*, tags:post_tags!inner(tag:tags!inner(*))')
  .eq('tags.tag.slug', tagSlug)
  .eq('status', 'PUBLISHED')
```

**Server 端实现**：
```typescript
const posts = await prisma.post.findMany({
  where: {
    status: 'PUBLISHED',
    tags: {
      some: {
        tag: { slug: tagSlug }
      }
    }
  },
  include: {
    author: true,
    tags: { include: { tag: true } }
  }
})
```

---

#### UC4: 评论加载

**场景**：文章详情页加载评论，支持实时更新

**Client 端实现**（优势场景）：
```typescript
// hooks/use-comments.ts
export function useComments(postId: string) {
  const [comments, setComments] = useState([])
  
  // 初始加载
  useEffect(() => {
    loadComments()
  }, [postId])

  const loadComments = async () => {
    const { data } = await postgrest
      .from('comments')
      .select('*, author:users(id, name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
  }

  // 乐观更新：添加评论
  const addComment = async (content: string, authorId: string) => {
    const optimisticComment = {
      id: crypto.randomUUID(),
      content,
      author_id: authorId,
      post_id: postId,
      created_at: new Date().toISOString(),
    }
    
    // 立即更新 UI
    setComments(prev => [...prev, optimisticComment])
    
    // 后台同步
    await postgrest.from('comments').insert({
      content,
      author_id: authorId,
      post_id: postId,
    })
  }

  return { comments, addComment, refresh: loadComments }
}
```

**Server 端实现**：
```typescript
// 需要配合 Server Action 实现
// actions/comments.ts
'use server'

export async function getComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId },
    include: { author: true },
    orderBy: { createdAt: 'asc' }
  })
}

export async function addComment(postId: string, content: string, authorId: string) {
  await prisma.comment.create({
    data: { postId, content, authorId }
  })
  revalidatePath(`/server/posts/${postId}`)
}
```

**对比分析**：
| 维度 | Client 端 | Server 端 |
|------|----------|----------|
| 实时性 | 乐观更新，即时反馈 | 需要 revalidate |
| 用户体验 | 更流畅 | 有短暂延迟 |
| 数据一致性 | 需要处理冲突 | 服务端保证 |
| 适用场景 | 高交互场景 | 低频更新场景 |

---

#### UC5: 热门文章统计

**场景**：展示浏览量最高的文章

**Server 端实现**（优势场景）：
```typescript
// 使用 Prisma ORM 进行聚合查询
const popularPosts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' },
  orderBy: { viewCount: 'desc' },
  take: 10,
  include: {
    author: { select: { name: true } },
    _count: { select: { comments: true } }
  }
})

// 分类统计 - 使用 Prisma 的 groupBy 进行聚合
const categoryStats = await prisma.post.groupBy({
  by: ['categoryId'],
  where: { status: 'PUBLISHED' },
  _count: { id: true },
  _sum: { viewCount: true },
  orderBy: { _sum: { viewCount: 'desc' } }
})

// 获取分类名称并组合结果
const categoriesWithStats = await Promise.all(
  categoryStats.map(async (stat) => {
    const category = stat.categoryId
      ? await prisma.category.findUnique({
          where: { id: stat.categoryId },
          select: { name: true }
        })
      : null
    return {
      categoryName: category?.name ?? 'Uncategorized',
      postCount: stat._count.id,
      totalViews: stat._sum.viewCount ?? 0
    }
  })
)

// 或者使用更优雅的单次查询方式
const statsWithCategory = await prisma.category.findMany({
  select: {
    name: true,
    posts: {
      where: { status: 'PUBLISHED' },
      select: { viewCount: true }
    }
  }
}).then(categories =>
  categories.map(cat => ({
    categoryName: cat.name,
    postCount: cat.posts.length,
    totalViews: cat.posts.reduce((sum, p) => sum + p.viewCount, 0)
  })).sort((a, b) => b.totalViews - a.totalViews)
)
```

**Client 端实现**：
```typescript
// PostgREST 聚合能力有限，需要创建数据库视图
// 或者在客户端进行计算（不推荐大数据量）
const { data } = await postgrest
  .from('posts')
  .select('category:categories(name), view_count')
  .eq('status', 'PUBLISHED')

// 客户端聚合（仅适用于小数据量）
const stats = data?.reduce((acc, post) => {
  const cat = post.category?.name ?? 'Uncategorized'
  acc[cat] = (acc[cat] ?? 0) + post.view_count
  return acc
}, {})
```

**对比分析**：
| 维度 | Client 端 | Server 端 |
|------|----------|----------|
| 聚合能力 | 有限，依赖视图 | 强大，Prisma groupBy |
| 性能 | 大数据量时差 | 数据库层面优化 |
| 灵活性 | 需要预定义视图 | 动态查询，类型安全 |

---

#### UC6: 全文搜索

**场景**：搜索文章标题和内容

**Client 端实现**：
```typescript
// PostgREST 全文搜索（需要数据库配置 tsvector）
const { data } = await postgrest
  .from('posts')
  .select('*')
  .textSearch('title', searchQuery, { type: 'websearch' })
```

**Server 端实现**：
```typescript
// Prisma 全文搜索 - 使用 contains 进行模糊匹配
const posts = await prisma.post.findMany({
  where: {
    OR: [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { content: { contains: searchQuery, mode: 'insensitive' } },
    ],
    status: 'PUBLISHED',
  },
  include: {
    author: { select: { id: true, name: true, avatarUrl: true } },
    category: true,
  },
  orderBy: { publishedAt: 'desc' },
})

// 使用 Prisma 的 PostgreSQL 全文搜索扩展（需要在 schema 中启用）
// 首先在 schema.prisma 中添加：
// generator client {
//   provider        = "prisma-client-js"
//   previewFeatures = ["fullTextSearch", "fullTextIndex"]
// }

// 然后可以使用 search 进行全文搜索
const postsWithFullText = await prisma.post.findMany({
  where: {
    status: 'PUBLISHED',
    OR: [
      { title: { search: searchQuery } },
      { content: { search: searchQuery } },
    ],
  },
  include: {
    author: { select: { id: true, name: true, avatarUrl: true } },
    category: true,
  },
})
```

---

## 7. 数据流架构

### 7.1 Client 端数据流

```mermaid
sequenceDiagram
    participant Browser as 浏览器
    participant Next as Next.js Server
    participant PR as PostgREST
    participant PG as PostgreSQL

    Browser->>Next: 请求页面
    Next-->>Browser: 返回 HTML + JS Bundle
    Browser->>Browser: React Hydration
    Browser->>PR: fetch 数据请求
    PR->>PG: SQL 查询
    PG-->>PR: 查询结果
    PR-->>Browser: JSON 响应
    Browser->>Browser: 更新 UI
```

### 7.2 Server 端数据流

```mermaid
sequenceDiagram
    participant Browser as 浏览器
    participant Next as Next.js Server
    participant Prisma as Prisma ORM
    participant PG as PostgreSQL

    Browser->>Next: 请求页面
    Next->>Prisma: 调用 ORM 方法
    Prisma->>PG: SQL 查询
    PG-->>Prisma: 查询结果
    Prisma-->>Next: 类型化数据
    Next->>Next: 渲染 React 组件
    Next-->>Browser: 返回完整 HTML
    Browser->>Browser: React Hydration - 可选
```

---

## 8. 类型系统设计

### 8.1 共享类型定义

```typescript
// src/types/index.ts

// 基础实体类型
export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  status: PostStatus
  authorId: string
  categoryId: string | null
  viewCount: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  color: string | null
}

export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

// 关联类型
export interface PostWithRelations extends Post {
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>
  category: Category | null
  tags: Array<{ tag: Tag }>
}

export interface CommentWithAuthor extends Comment {
  author: Pick<User, 'id' | 'name' | 'avatarUrl'>
}

// 分页类型
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 查询参数类型
export interface PostQueryParams {
  page?: number
  pageSize?: number
  status?: PostStatus
  categorySlug?: string
  tagSlug?: string
  authorId?: string
  search?: string
  orderBy?: 'publishedAt' | 'viewCount' | 'title'
  order?: 'asc' | 'desc'
}
```

### 8.2 PostgREST 类型生成

可以使用 `openapi-typescript` 从 PostgREST 的 OpenAPI schema 生成类型：

```bash
npx openapi-typescript http://localhost:3001/ -o src/types/postgrest.ts
```

---

## 9. 开发环境配置

### 9.1 Nix Flake 配置

```nix
# flake.nix
{
  description = "DB Frontend Example - Next.js + Prisma + PostgREST";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js 环境
            nodejs_22
            pnpm
            
            # 数据库工具
            postgresql_16
            
            # Docker
            docker
            docker-compose
            
            # 开发工具
            git
            jq
            httpie
          ];

          shellHook = ''
            echo "DB Frontend Example Development Environment"
            echo "Node.js: $(node --version)"
            echo "pnpm: $(pnpm --version)"
            echo ""
            echo "Commands:"
            echo "  pnpm dev          - Start Next.js dev server"
            echo "  pnpm db:up        - Start Docker services"
            echo "  pnpm db:migrate   - Run Prisma migrations"
            echo "  pnpm db:seed      - Seed database"
          '';
        };
      }
    );
}
```

### 9.2 Package.json Scripts

```json
{
  "name": "db-frontend-example",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:up": "docker-compose up -d postgres postgrest",
    "db:down": "docker-compose down",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "db:studio": "prisma studio",
    "db:generate": "prisma generate",
    "postinstall": "prisma generate"
  }
}
```

---

## 10. 实现路线图

### Phase 1: 基础设施搭建
- [ ] 初始化 Next.js 项目
- [ ] 配置 TypeScript、ESLint、Prettier
- [ ] 配置 Tailwind CSS
- [ ] 创建 Docker Compose 配置
- [ ] 配置 Nix Flake 开发环境

### Phase 2: 数据层实现
- [ ] 编写 Prisma Schema
- [ ] 创建数据库迁移
- [ ] 编写种子数据脚本
- [ ] 配置 PostgREST
- [ ] 创建数据库视图（供 PostgREST 使用）

### Phase 3: 共享组件开发
- [ ] 实现基础 UI 组件
- [ ] 实现文章卡片、列表组件
- [ ] 实现评论组件
- [ ] 实现分页、筛选组件

### Phase 4: Client 端方案实现
- [ ] 配置 PostgREST 客户端
- [ ] 实现数据获取 Hooks
- [ ] 实现 Client 端页面路由
- [ ] 实现乐观更新逻辑

### Phase 5: Server 端方案实现
- [ ] 配置 Prisma 客户端
- [ ] 实现 Server Actions
- [ ] 实现 Server 端页面路由
- [ ] 配置缓存策略

### Phase 6: 对比与文档
- [ ] 实现对比展示页面
- [ ] 编写使用文档
- [ ] 性能测试与分析
- [ ] 总结两种方案优劣

---

## 11. 总结

### 11.1 两种方案对比总结

| 维度 | Client 端 - PostgREST | Server 端 - Prisma |
|------|----------------------|-------------------|
| **首屏性能** | 较慢（需要 JS 执行） | 较快（HTML 直出） |
| **SEO** | 需要额外处理 | 天然支持 |
| **类型安全** | 需要额外配置 | 开箱即用 |
| **实时交互** | 优秀（乐观更新） | 一般（需要 revalidate） |
| **复杂查询** | 有限（依赖视图） | 强大（支持原生 SQL） |
| **代码复杂度** | 需要状态管理 | 相对简洁 |
| **调试体验** | 浏览器 DevTools | 服务端日志 |
| **部署复杂度** | 需要额外服务 | 单一应用 |

### 11.2 适用场景建议

**推荐使用 Client 端方案的场景**：
- 高交互性应用（如实时协作、聊天）
- 需要乐观更新的场景
- 已有 PostgREST/Supabase 基础设施
- 前后端分离的团队结构

**推荐使用 Server 端方案的场景**：
- SEO 敏感的内容站点
- 复杂数据聚合需求
- 需要强类型保证的项目
- 全栈开发团队

---

## 附录 A: 完整 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String
  avatarUrl String?   @map("avatar_url")
  bio       String?
  posts     Post[]
  comments  Comment[]
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  @@map("users")
}

model Category {
  id          String  @id @default(uuid())
  name        String  @unique
  slug        String  @unique
  description String?
  sortOrder   Int     @default(0) @map("sort_order")
  posts       Post[]

  @@map("categories")
}

model Tag {
  id    String    @id @default(uuid())
  name  String    @unique
  slug  String    @unique
  color String?
  posts PostTag[]

  @@map("tags")
}

model Post {
  id          String     @id @default(uuid())
  title       String
  slug        String     @unique
  content     String
  excerpt     String?
  coverImage  String?    @map("cover_image")
  status      PostStatus @default(DRAFT)
  viewCount   Int        @default(0) @map("view_count")
  publishedAt DateTime?  @map("published_at")
  createdAt   DateTime   @default(now()) @map("created_at")
  updatedAt   DateTime   @updatedAt @map("updated_at")

  author     User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId   String    @map("author_id")
  category   Category? @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  categoryId String?   @map("category_id")
  tags       PostTag[]
  comments   Comment[]

  @@index([authorId])
  @@index([categoryId])
  @@index([status])
  @@index([publishedAt(sort: Desc)])
  @@map("posts")
}

model PostTag {
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String @map("post_id")
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId  String @map("tag_id")

  @@id([postId, tagId])
  @@map("post_tags")
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  post     Post      @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId   String    @map("post_id")
  author   User      @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String    @map("author_id")
  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id], onDelete: Cascade)
  parentId String?   @map("parent_id")
  replies  Comment[] @relation("CommentReplies")

  @@index([postId])
  @@index([parentId])
  @@map("comments")
}
```

---

## 附录 B: PostgREST 客户端配置

```typescript
// src/lib/postgrest.ts
import { PostgrestClient } from '@supabase/postgrest-js'

const POSTGREST_URL = process.env.NEXT_PUBLIC_POSTGREST_URL!

export const postgrest = new PostgrestClient(POSTGREST_URL)

// 类型化的表访问
export const db = {
  users: () => postgrest.from('users'),
  posts: () => postgrest.from('posts'),
  comments: () => postgrest.from('comments'),
  categories: () => postgrest.from('categories'),
  tags: () => postgrest.from('tags'),
  postTags: () => postgrest.from('post_tags'),
  // 视图
  postsWithAuthor: () => postgrest.from('posts_with_author'),
}
```

---

## 附录 C: Prisma 客户端单例

```typescript
// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
```