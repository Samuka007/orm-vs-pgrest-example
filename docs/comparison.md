# 技术对比分析

本文档详细对比 Client 端（PostgREST）和 Server 端（Prisma）两种数据获取方案。

## 目录

- [方案概述](#方案概述)
- [代码示例对比](#代码示例对比)
- [性能分析](#性能分析)
- [适用场景](#适用场景)
- [最佳实践建议](#最佳实践建议)
- [结论](#结论)

---

## 方案概述

### Client 端方案（PostgREST）

```
浏览器 → PostgREST API → PostgreSQL
```

- **技术栈**：`@supabase/postgrest-js` + PostgREST
- **数据获取位置**：浏览器（Client Component）
- **渲染方式**：客户端渲染（CSR）

### Server 端方案（Prisma）

```
浏览器 → Next.js Server → Prisma ORM → PostgreSQL
```

- **技术栈**：Prisma ORM
- **数据获取位置**：Node.js 服务器（Server Component）
- **渲染方式**：服务端渲染（SSR）

---

## 代码示例对比

### 1. 文章列表查询（分页）

#### Client 端实现

```typescript
// src/hooks/use-posts.ts
import { useState, useEffect, useCallback } from 'react'
import {
  postgrest,
  getPaginationRange,
  DEFAULT_PAGE_SIZE,
  type DbPostWithAuthor,
} from '@/lib/postgrest'
import type { PostWithAuthor } from '@/types'
import type { Enums } from '@/types/database'

/** 文章列表查询参数 */
export interface UsePostsOptions {
  page?: number
  pageSize?: number
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  categorySlug?: string
  tagSlug?: string
  authorId?: string
  search?: string
  orderBy?: 'published_at' | 'view_count' | 'title' | 'created_at'
  order?: 'asc' | 'desc'
}

export function usePosts(options: UsePostsOptions = {}) {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    status = 'PUBLISHED',
    categorySlug,
    orderBy = 'published_at',
    order = 'desc',
  } = options

  const [data, setData] = useState<PostWithAuthor[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      let query = postgrest
        .from('posts')
        .select(`
          *,
          author:users!posts_author_id_fkey(id, name, avatar_url)
        `, { count: 'exact' })

      // 状态过滤
      if (status) {
        query = query.eq('status', status as Enums<'PostStatus'>)
      }

      // 分类过滤（需要先查询分类 ID）
      if (categorySlug) {
        const { data: category } = await postgrest
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single()

        if (category) {
          query = query.eq('category_id', category.id)
        }
      }

      // 排序和分页
      query = query.order(orderBy, { ascending: order === 'asc' })
      const [start, end] = getPaginationRange(page, pageSize)
      query = query.range(start, end)

      const { data: posts, count, error: queryError } = await query

      if (queryError) throw new Error(queryError.message)

      // 转换数据（snake_case → camelCase）
      const transformedPosts = (posts as unknown as DbPostWithAuthor[])
        .map(transformPostWithAuthor)

      setData(transformedPosts)
      setTotal(count ?? 0)
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('获取文章列表失败'))
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, status, categorySlug, orderBy, order])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const totalPages = Math.ceil(total / pageSize)

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
    isLoading,
    isError,
    error,
    refresh: fetchPosts,
  }
}
```

#### Server 端实现

```typescript
// src/lib/server/posts.ts
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type { PostWithRelations, PostQueryParams, PaginatedResult } from '@/types'

export async function getPosts(
  options: PostQueryParams = {}
): Promise<PaginatedResult<PostWithRelations>> {
  const {
    page = 1,
    pageSize = 10,
    status = 'PUBLISHED',
    categorySlug,
    tagSlug,
    authorId,
    search,
    orderBy = 'publishedAt',
    order = 'desc',
  } = options

  // 构建查询条件
  const where: Prisma.PostWhereInput = {}

  if (status) where.status = status
  if (categorySlug) where.category = { slug: categorySlug }
  if (tagSlug) where.tags = { some: { tag: { slug: tagSlug } } }
  if (authorId) where.authorId = authorId
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  // 执行查询
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        },
        category: true,
        tags: { include: { tag: true } },
      },
      orderBy: { [orderBy]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ])

  return {
    data: posts as PostWithRelations[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}
```

#### 对比分析

| 维度 | Client 端 | Server 端 |
|------|----------|----------|
| 代码量 | 较多（需要状态管理 + 数据转换） | 较少（直接返回数据） |
| 类型安全 | 需要手动定义类型 + 转换函数 | Prisma 自动推断类型 |
| 查询构建 | 链式调用，字符串模板 | 对象结构，IDE 完整提示 |
| 字段命名 | snake_case（需转换） | camelCase（直接使用） |
| 错误处理 | 需要手动处理 | 可统一处理 |
| 缓存 | 需要手动实现 | Next.js 自动缓存 |

---

### 2. 文章详情（关联查询）

#### Client 端实现

```typescript
// src/hooks/use-posts.ts - usePost hook
export function usePost(idOrSlug: string) {
  const [data, setData] = useState<PostWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchPost = useCallback(async () => {
    setIsLoading(true)
    try {
      // 判断是 ID 还是 slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)
      const filterField = isUUID ? 'id' : 'slug'

      // 查询文章基本信息、作者和分类
      const { data: post, error: postError } = await postgrest
        .from('posts')
        .select(`
          *,
          author:users!posts_author_id_fkey(id, name, avatar_url),
          category:categories(id, name, slug, description, sort_order)
        `)
        .eq(filterField, idOrSlug)
        .single()

      if (postError) throw new Error(postError.message)

      // 单独查询文章标签（PostgREST 嵌套查询限制）
      const { data: postTags } = await postgrest
        .from('post_tags')
        .select(`tag:tags(id, name, slug, color)`)
        .eq('post_id', post.id)

      // 组合并转换数据
      const fullPost = { ...post, tags: postTags ?? [] }
      setData(transformPostWithRelations(fullPost))
    } catch (err) {
      setError(err instanceof Error ? err : new Error('获取文章详情失败'))
    } finally {
      setIsLoading(false)
    }
  }, [idOrSlug])

  useEffect(() => { fetchPost() }, [fetchPost])

  return { data, isLoading, error, refresh: fetchPost }
}
```

#### Server 端实现

```typescript
// src/lib/server/posts.ts
export async function getPost(id: string): Promise<PostWithRelations | null> {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true }
      },
      category: true,
      tags: { include: { tag: true } },
    },
  })
}

// 通过 slug 获取文章
export async function getPostBySlug(slug: string): Promise<PostWithRelations | null> {
  return prisma.post.findUnique({
    where: { slug },
    include: {
      author: {
        select: { id: true, name: true, avatarUrl: true }
      },
      category: true,
      tags: { include: { tag: true } },
    },
  })
}
```

#### 对比分析

| 维度 | Client 端 | Server 端 |
|------|----------|----------|
| 查询语法 | 字符串模板，易出错 | 对象结构，IDE 完整提示 |
| 类型推断 | 需要手动定义 + 转换 | 完全自动推断 |
| 字段映射 | snake_case（需转换为 camelCase） | camelCase（直接使用） |
| 嵌套查询 | 有限制，可能需要多次请求 | 完整支持，单次查询 |
| ID/Slug 查询 | 需要手动判断 | 直接使用不同方法 |

---

### 3. 评论加载（实时交互）

#### Client 端实现（优势场景）

```typescript
// src/hooks/use-comments.ts
export function useComments(postId: string) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([])
  const [loading, setLoading] = useState(true)

  // 加载评论
  const loadComments = async () => {
    const { data } = await postgrest
      .from('comments')
      .select('*, author:users(id, name, avatar_url)')
      .eq('post_id', postId)
      .is('parent_id', null)
      .order('created_at', { ascending: true })
    
    setComments(data ?? [])
    setLoading(false)
  }

  // 乐观更新：添加评论
  const addComment = async (content: string, authorId: string) => {
    // 创建临时评论（乐观更新）
    const optimisticComment: CommentWithAuthor = {
      id: crypto.randomUUID(),
      content,
      postId,
      authorId,
      parentId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      author: { id: authorId, name: '当前用户', avatarUrl: null }
    }

    // 立即更新 UI
    setComments(prev => [...prev, optimisticComment])

    // 后台同步到数据库
    try {
      await postgrest.from('comments').insert({
        content,
        post_id: postId,
        author_id: authorId
      })
    } catch (error) {
      // 回滚乐观更新
      setComments(prev => prev.filter(c => c.id !== optimisticComment.id))
      throw error
    }
  }

  useEffect(() => {
    loadComments()
  }, [postId])

  return { comments, loading, addComment, refresh: loadComments }
}
```

#### Server 端实现

```typescript
// src/lib/server/comments.ts
export async function getComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId, parentId: null },
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
  })
}

// Server Action 添加评论
'use server'
export async function addComment(postId: string, content: string, authorId: string) {
  await prisma.comment.create({
    data: { postId, content, authorId }
  })
  revalidatePath(`/server/posts/${postId}`)
}
```

#### 对比分析

| 维度 | Client 端 | Server 端 |
|------|----------|----------|
| 实时性 | 乐观更新，即时反馈 | 需要 revalidate |
| 用户体验 | 更流畅，无闪烁 | 有短暂加载状态 |
| 数据一致性 | 需要处理冲突 | 服务端保证 |
| 复杂度 | 需要管理本地状态 | 相对简单 |

---

### 4. 聚合统计查询

#### Server 端实现（优势场景）

```typescript
// src/lib/server/stats.ts
export async function getCategoryStats() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      posts: {
        where: { status: 'PUBLISHED' },
        select: { viewCount: true }
      }
    }
  })

  return categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    postCount: cat.posts.length,
    totalViews: cat.posts.reduce((sum, p) => sum + p.viewCount, 0)
  }))
}

// 使用 Prisma groupBy 进行聚合
export async function getPostStatsByCategory() {
  return prisma.post.groupBy({
    by: ['categoryId'],
    where: { status: 'PUBLISHED' },
    _count: { id: true },
    _sum: { viewCount: true },
    orderBy: { _sum: { viewCount: 'desc' } }
  })
}
```

#### Client 端实现

```typescript
// src/hooks/use-categories.ts - useCategoriesWithPostCount hook
export function useCategoriesWithPostCount() {
  const [data, setData] = useState<CategoryWithPostCount[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    try {
      // 获取所有分类
      const { data: categories } = await postgrest
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      // PostgREST 聚合能力有限，需要逐个查询文章数量
      const categoriesWithCount = await Promise.all(
        (categories as DbCategory[]).map(async (category) => {
          const { count } = await postgrest
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('status', 'PUBLISHED')

          return {
            ...toCategory(category),
            postCount: count ?? 0,
          }
        })
      )

      setData(categoriesWithCount)
    } catch (err) {
      // 错误处理
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories])

  return { data, isLoading, refresh: fetchCategories }
}
```

#### 对比分析

| 维度 | Client 端 | Server 端 |
|------|----------|----------|
| 聚合能力 | 有限，需要客户端计算 | 强大，支持 groupBy |
| 性能 | 大数据量时差 | 数据库层面优化 |
| 网络传输 | 需要传输原始数据 | 只传输聚合结果 |

---

## 性能分析

### 首屏加载时间

```
Client 端流程：
1. 浏览器请求 HTML
2. 下载 JS Bundle
3. React Hydration
4. 发起数据请求
5. 渲染数据

Server 端流程：
1. 服务器获取数据
2. 渲染 HTML
3. 返回完整 HTML
4. React Hydration（可选）
```

| 指标 | Client 端 | Server 端 |
|------|----------|----------|
| TTFB | 快（空 HTML） | 稍慢（需要数据库查询） |
| FCP | 慢（需要 JS 执行） | 快（HTML 直出） |
| LCP | 慢（数据请求后） | 快（首次渲染即完成） |
| TTI | 慢（需要 Hydration） | 快（可选 Hydration） |

### 网络请求

| 场景 | Client 端 | Server 端 |
|------|----------|----------|
| 文章列表 | 1 次 API 请求 | 0 次（SSR） |
| 文章详情 | 1-2 次 API 请求 | 0 次（SSR） |
| 分页切换 | 1 次 API 请求 | 页面跳转 |
| 评论加载 | 1 次 API 请求 | 0 次（SSR） |

### 缓存策略

#### Client 端

```typescript
// 需要手动实现缓存
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 分钟

const fetchWithCache = async (key: string, fetcher: () => Promise<any>) => {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const data = await fetcher()
  cache.set(key, { data, timestamp: Date.now() })
  return data
}
```

#### Server 端

```typescript
// Next.js 自动缓存
// 默认情况下，fetch 请求会被缓存
// 可以通过 revalidate 控制缓存时间

// 静态生成（构建时获取数据）
export const revalidate = 3600 // 1 小时

// 或使用 unstable_cache
import { unstable_cache } from 'next/cache'

const getCachedPosts = unstable_cache(
  async () => getPosts(),
  ['posts'],
  { revalidate: 60 }
)
```

---

## 适用场景

### 推荐使用 Client 端方案的场景

1. **高交互性应用**
   - 实时协作工具
   - 聊天应用
   - 在线编辑器

2. **需要乐观更新的场景**
   - 点赞、收藏功能
   - 评论系统
   - 表单提交

3. **已有 PostgREST/Supabase 基础设施**
   - 快速原型开发
   - 多端共享 API

4. **前后端分离的团队结构**
   - 前端团队独立开发
   - 后端只提供数据库

### 推荐使用 Server 端方案的场景

1. **SEO 敏感的内容站点**
   - 博客
   - 新闻网站
   - 电商产品页

2. **复杂数据聚合需求**
   - 数据报表
   - 统计分析
   - 仪表盘

3. **需要强类型保证的项目**
   - 大型企业应用
   - 长期维护项目

4. **全栈开发团队**
   - 统一技术栈
   - 代码复用

---

## 最佳实践建议

### Client 端方案

1. **类型安全**
   ```typescript
   // 使用 Supabase CLI 生成类型（推荐）
   npx supabase gen types typescript --local > src/types/database.ts
   
   // 或使用 openapi-typescript
   npx openapi-typescript http://localhost:3001/ -o src/types/postgrest.ts
   ```

2. **数据转换**
   ```typescript
   // 定义转换函数处理 snake_case → camelCase
   function transformPostWithAuthor(dbPost: DbPostWithAuthor): PostWithAuthor {
     return {
       id: dbPost.id,
       title: dbPost.title,
       coverImage: dbPost.cover_image,  // snake_case → camelCase
       authorId: dbPost.author_id,
       publishedAt: dbPost.published_at ? new Date(dbPost.published_at) : null,
       // ...
       author: {
         id: dbPost.author.id,
         name: dbPost.author.name,
         avatarUrl: dbPost.author.avatar_url,
       },
     }
   }
   ```

3. **错误处理**
   ```typescript
   const { data, error } = await postgrest.from('posts').select()
   if (error) {
     console.error('PostgREST error:', error)
     // 显示用户友好的错误信息
   }
   ```

4. **请求优化**
   ```typescript
   // 只选择需要的字段
   .select('id, title, excerpt, published_at')
   
   // 使用嵌入查询减少请求次数（注意外键约束名称）
   .select('*, author:users!posts_author_id_fkey(id, name, avatar_url)')
   ```

### Server 端方案

1. **避免 N+1 查询**
   ```typescript
   // ❌ 错误：N+1 查询
   const posts = await prisma.post.findMany()
   for (const post of posts) {
     post.author = await prisma.user.findUnique({ where: { id: post.authorId } })
   }

   // ✅ 正确：使用 include
   const posts = await prisma.post.findMany({
     include: { author: true }
   })
   ```

2. **合理使用缓存**
   ```typescript
   // 静态内容使用较长的 revalidate
   export const revalidate = 3600

   // 动态内容使用较短的 revalidate 或 no-store
   export const dynamic = 'force-dynamic'
   ```

3. **错误边界**
   ```typescript
   // app/server/posts/error.tsx
   'use client'
   export default function Error({ error, reset }) {
     return (
       <div>
         <h2>出错了</h2>
         <button onClick={reset}>重试</button>
       </div>
     )
   }
   ```

### 混合使用建议

在实际项目中，可以根据页面特点混合使用两种方案：

```
/                    → Server（首页 SEO）
/posts               → Server（文章列表 SEO）
/posts/[id]          → Server（文章详情 SEO）
/posts/[id]/comments → Client（评论交互）
/dashboard           → Client（用户仪表盘）
/admin               → Client（管理后台）
```

---

## 结论

### 总体对比

| 维度 | Client 端 - PostgREST | Server 端 - Prisma |
|------|----------------------|-------------------|
| **首屏性能** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **SEO 支持** | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **类型安全** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **实时交互** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **复杂查询** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **开发体验** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **部署复杂度** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **学习曲线** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

### 选择建议

- **选择 Client 端方案**：如果你的应用需要高度交互性、实时更新，或者已有 PostgREST/Supabase 基础设施。

- **选择 Server 端方案**：如果你的应用是内容型网站、需要 SEO、或者需要复杂的数据聚合查询。

- **混合使用**：大多数实际项目可以根据页面特点混合使用两种方案，发挥各自优势。

### 未来趋势

随着 React Server Components 和 Next.js App Router 的成熟，Server 端方案正在成为主流选择。但 Client 端方案在特定场景（如实时协作、离线优先应用）仍有不可替代的优势。

建议根据项目实际需求，选择最适合的方案或混合使用。