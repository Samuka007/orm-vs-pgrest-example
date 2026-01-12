# API 文档

本文档介绍项目中使用的 PostgREST API 端点和 Prisma 数据模型。

## 目录

- [PostgREST API](#postgrest-api)
  - [基础信息](#基础信息)
  - [端点列表](#端点列表)
  - [查询语法](#查询语法)
  - [示例请求](#示例请求)
- [Prisma 数据模型](#prisma-数据模型)
  - [模型定义](#模型定义)
  - [关系说明](#关系说明)
  - [查询示例](#查询示例)
- [类型定义](#类型定义)
  - [基础类型](#基础类型)
  - [关联类型](#关联类型)
  - [分页类型](#分页类型)

---

## PostgREST API

### 基础信息

- **Base URL**: `http://localhost:3001`
- **认证**: 当前配置为匿名只读访问（`web_anon` 角色）
- **响应格式**: JSON
- **OpenAPI 文档**: `http://localhost:3001/`

### 端点列表

| 端点 | 方法 | 描述 |
|------|------|------|
| `/users` | GET | 获取用户列表 |
| `/posts` | GET | 获取文章列表 |
| `/categories` | GET | 获取分类列表 |
| `/tags` | GET | 获取标签列表 |
| `/comments` | GET | 获取评论列表 |
| `/post_tags` | GET | 获取文章-标签关联 |

### 查询语法

PostgREST 提供强大的查询语法，支持过滤、排序、分页和关联查询。

#### 1. 选择字段

```bash
# 选择特定字段
GET /posts?select=id,title,excerpt

# 选择所有字段
GET /posts?select=*
```

#### 2. 过滤条件

```bash
# 等于
GET /posts?status=eq.PUBLISHED

# 不等于
GET /posts?status=neq.DRAFT

# 大于/小于
GET /posts?view_count=gt.100
GET /posts?view_count=lt.1000

# 范围
GET /posts?view_count=gte.100&view_count=lte.1000

# 包含（数组）
GET /posts?status=in.(PUBLISHED,ARCHIVED)

# 模糊匹配
GET /posts?title=like.*Next.js*
GET /posts?title=ilike.*next.js*  # 不区分大小写

# 空值
GET /posts?category_id=is.null
GET /posts?category_id=not.is.null
```

#### 3. 排序

```bash
# 升序
GET /posts?order=created_at.asc

# 降序
GET /posts?order=published_at.desc

# 多字段排序
GET /posts?order=status.asc,published_at.desc

# 空值排序
GET /posts?order=published_at.desc.nullslast
```

#### 4. 分页

```bash
# 使用 limit 和 offset
GET /posts?limit=10&offset=0

# 使用 Range 头
GET /posts
Range: 0-9

# 获取总数（需要 Prefer 头）
GET /posts
Prefer: count=exact
```

#### 5. 关联查询（嵌入）

```bash
# 一对多：获取文章及其作者
GET /posts?select=*,author:users(id,name,avatar_url)

# 多对多：获取文章及其标签
GET /posts?select=*,tags:post_tags(tag:tags(*))

# 多层嵌套
GET /posts?select=*,author:users(id,name),category:categories(*),tags:post_tags(tag:tags(*))

# 过滤关联数据
GET /posts?select=*,comments(*)&comments.order=created_at.desc
```

### 示例请求

#### 获取已发布文章列表（分页）

```bash
curl "http://localhost:3001/posts?\
select=id,title,slug,excerpt,published_at,view_count,\
author:users(id,name,avatar_url),\
category:categories(id,name,slug)&\
status=eq.PUBLISHED&\
order=published_at.desc&\
limit=10&offset=0" \
-H "Prefer: count=exact"
```

**响应示例**：
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "title": "Next.js 15 新特性介绍",
    "slug": "nextjs-15-new-features",
    "excerpt": "探索 Next.js 15 带来的激动人心的新功能...",
    "published_at": "2024-01-15T10:00:00Z",
    "view_count": 1250,
    "author": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "张三",
      "avatar_url": "https://example.com/avatar.jpg"
    },
    "category": {
      "id": "550e8400-e29b-41d4-a716-446655440010",
      "name": "前端开发",
      "slug": "frontend"
    }
  }
]
```

#### 获取文章详情

```bash
curl "http://localhost:3001/posts?\
select=*,\
author:users(id,name,avatar_url,bio),\
category:categories(*),\
tags:post_tags(tag:tags(*)),\
comments(id,content,created_at,author:users(id,name,avatar_url))&\
id=eq.550e8400-e29b-41d4-a716-446655440001"
```

#### 获取分类及文章数量

```bash
curl "http://localhost:3001/categories?\
select=*,posts(count)&\
posts.status=eq.PUBLISHED"
```

#### 搜索文章

```bash
curl "http://localhost:3001/posts?\
select=id,title,excerpt&\
or=(title.ilike.*React*,content.ilike.*React*)&\
status=eq.PUBLISHED&\
order=published_at.desc"
```

---

## Prisma 数据模型

### 模型定义

#### User（用户）

```prisma
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
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String (UUID) | 主键 |
| `email` | String | 邮箱（唯一） |
| `name` | String | 显示名称 |
| `avatarUrl` | String? | 头像 URL |
| `bio` | String? | 个人简介 |
| `posts` | Post[] | 用户的文章 |
| `comments` | Comment[] | 用户的评论 |
| `createdAt` | DateTime | 创建时间 |
| `updatedAt` | DateTime | 更新时间 |

#### Category（分类）

```prisma
model Category {
  id          String  @id @default(uuid())
  name        String  @unique
  slug        String  @unique
  description String?
  sortOrder   Int     @default(0) @map("sort_order")
  posts       Post[]

  @@map("categories")
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String (UUID) | 主键 |
| `name` | String | 分类名称（唯一） |
| `slug` | String | URL 标识（唯一） |
| `description` | String? | 分类描述 |
| `sortOrder` | Int | 排序权重 |
| `posts` | Post[] | 分类下的文章 |

#### Tag（标签）

```prisma
model Tag {
  id    String    @id @default(uuid())
  name  String    @unique
  slug  String    @unique
  color String?
  posts PostTag[]

  @@map("tags")
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String (UUID) | 主键 |
| `name` | String | 标签名称（唯一） |
| `slug` | String | URL 标识（唯一） |
| `color` | String? | 颜色代码（如 #FF5733） |
| `posts` | PostTag[] | 关联的文章 |

#### Post（文章）

```prisma
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

  @@map("posts")
}

enum PostStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String (UUID) | 主键 |
| `title` | String | 文章标题 |
| `slug` | String | URL 标识（唯一） |
| `content` | String | 文章内容（Markdown） |
| `excerpt` | String? | 摘要 |
| `coverImage` | String? | 封面图 URL |
| `status` | PostStatus | 状态（DRAFT/PUBLISHED/ARCHIVED） |
| `viewCount` | Int | 浏览次数 |
| `publishedAt` | DateTime? | 发布时间 |
| `author` | User | 作者 |
| `category` | Category? | 分类 |
| `tags` | PostTag[] | 标签 |
| `comments` | Comment[] | 评论 |

#### PostTag（文章-标签关联）

```prisma
model PostTag {
  post   Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId String @map("post_id")
  tag    Tag    @relation(fields: [tagId], references: [id], onDelete: Cascade)
  tagId  String @map("tag_id")

  @@id([postId, tagId])
  @@map("post_tags")
}
```

#### Comment（评论）

```prisma
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

  @@map("comments")
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | String (UUID) | 主键 |
| `content` | String | 评论内容 |
| `post` | Post | 所属文章 |
| `author` | User | 评论者 |
| `parent` | Comment? | 父评论（支持嵌套） |
| `replies` | Comment[] | 子评论 |

### 关系说明

```
User ─────┬───── Post（一对多：用户可以有多篇文章）
          └───── Comment（一对多：用户可以有多条评论）

Category ────── Post（一对多：分类可以有多篇文章）

Post ─────┬───── Comment（一对多：文章可以有多条评论）
          └───── PostTag ───── Tag（多对多：文章和标签）

Comment ────── Comment（自引用：支持嵌套评论）
```

### 查询示例

#### 获取文章列表（分页）

```typescript
import { prisma } from '@/lib/prisma'

const posts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' },
  include: {
    author: {
      select: { id: true, name: true, avatarUrl: true }
    },
    category: true,
  },
  orderBy: { publishedAt: 'desc' },
  skip: 0,
  take: 10,
})
```

#### 获取文章详情

```typescript
const post = await prisma.post.findUnique({
  where: { id: postId },
  include: {
    author: {
      select: { id: true, name: true, avatarUrl: true, bio: true }
    },
    category: true,
    tags: {
      include: { tag: true }
    },
    comments: {
      where: { parentId: null },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        },
        replies: {
          include: {
            author: {
              select: { id: true, name: true, avatarUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    }
  }
})
```

#### 获取分类统计

```typescript
const categories = await prisma.category.findMany({
  select: {
    id: true,
    name: true,
    slug: true,
    _count: {
      select: {
        posts: {
          where: { status: 'PUBLISHED' }
        }
      }
    }
  },
  orderBy: { sortOrder: 'asc' }
})
```

#### 搜索文章

```typescript
const posts = await prisma.post.findMany({
  where: {
    status: 'PUBLISHED',
    OR: [
      { title: { contains: searchQuery, mode: 'insensitive' } },
      { content: { contains: searchQuery, mode: 'insensitive' } },
    ]
  },
  include: {
    author: {
      select: { id: true, name: true, avatarUrl: true }
    }
  },
  orderBy: { publishedAt: 'desc' }
})
```

#### 按标签筛选文章

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
    author: {
      select: { id: true, name: true, avatarUrl: true }
    },
    tags: {
      include: { tag: true }
    }
  }
})
```

---

## 类型定义

项目在 `src/types/index.ts` 中定义了共享类型，确保 Client 端和 Server 端的类型一致性。

### 基础类型

```typescript
// 文章状态
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

// 用户
export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
}

// 分类
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
}

// 标签
export interface Tag {
  id: string
  name: string
  slug: string
  color: string | null
}

// 文章
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

// 评论
export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}
```

### 关联类型

```typescript
// 用户简要信息
export type UserBrief = Pick<User, 'id' | 'name' | 'avatarUrl'>

// 带作者的文章
export interface PostWithAuthor extends Post {
  author: UserBrief
}

// 带完整关联的文章
export interface PostWithRelations extends Post {
  author: UserBrief
  category: Category | null
  tags: Array<{ tag: Tag }>
}

// 带作者的评论
export interface CommentWithAuthor extends Comment {
  author: UserBrief
}

// 带回复的评论
export interface CommentWithReplies extends CommentWithAuthor {
  replies: CommentWithAuthor[]
}
```

### 分页类型

```typescript
// 分页结果
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// 分页参数
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// 文章查询参数
export interface PostQueryParams extends PaginationParams {
  status?: PostStatus
  categorySlug?: string
  tagSlug?: string
  authorId?: string
  search?: string
  orderBy?: 'publishedAt' | 'viewCount' | 'title' | 'createdAt'
  order?: 'asc' | 'desc'
}
```

### 统计类型

```typescript
// 分类统计
export interface CategoryStats {
  categoryId: string
  categoryName: string
  postCount: number
  totalViews: number
}

// 标签统计
export interface TagStats {
  tagId: string
  tagName: string
  tagSlug: string
  postCount: number
}

// 作者统计
export interface AuthorStats {
  authorId: string
  authorName: string
  postCount: number
  totalViews: number
  commentCount: number
}
```

### 工具类型

```typescript
// 使某些字段可选
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

// 使某些字段必填
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

// 创建实体时的输入类型
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

// 更新实体时的输入类型
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
```

---

## PostgREST 类型生成

可以使用 `openapi-typescript` 从 PostgREST 的 OpenAPI schema 自动生成类型：

```bash
# 安装工具
pnpm add -D openapi-typescript

# 生成类型（确保 PostgREST 正在运行）
npx openapi-typescript http://localhost:3001/ -o src/types/postgrest.ts
```

生成的类型可以与 `@supabase/postgrest-js` 配合使用，提供更好的类型推断。

---

## 数据库字段映射

由于 PostgreSQL 使用 snake_case，而 TypeScript/JavaScript 通常使用 camelCase，需要注意字段映射：

| 数据库字段 | Prisma 字段 | TypeScript 类型 |
|-----------|-------------|----------------|
| `avatar_url` | `avatarUrl` | `avatarUrl` |
| `cover_image` | `coverImage` | `coverImage` |
| `view_count` | `viewCount` | `viewCount` |
| `published_at` | `publishedAt` | `publishedAt` |
| `created_at` | `createdAt` | `createdAt` |
| `updated_at` | `updatedAt` | `updatedAt` |
| `author_id` | `authorId` | `authorId` |
| `category_id` | `categoryId` | `categoryId` |
| `post_id` | `postId` | `postId` |
| `parent_id` | `parentId` | `parentId` |
| `sort_order` | `sortOrder` | `sortOrder` |

**注意**：PostgREST 返回的数据使用数据库字段名（snake_case），而 Prisma 返回的数据使用模型字段名（camelCase）。在 Client 端使用 PostgREST 时，需要注意这个差异。