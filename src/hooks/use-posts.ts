'use client'

// ===========================================
// 文章数据 Hooks
// 用于 Client 端获取文章数据
// 使用 Supabase CLI 生成的类型定义
// ===========================================

import { useState, useEffect, useCallback } from 'react'
import {
  postgrest,
  getPaginationRange,
  DEFAULT_PAGE_SIZE,
  type DbPost,
  type DbCategory,
  type DbTag,
  type DbUserBrief,
  type DbPostWithAuthor,
  type DbPostWithRelations,
} from '@/lib/postgrest'
import type { PostWithAuthor, PostWithRelations, PostStatus } from '@/types'
import type { Enums } from '@/types/database'

// ===========================================
// 类型定义
// ===========================================

/** PostgREST 排序方向 */
type SortOrder = 'asc' | 'desc'

/** PostgREST 文章排序字段 */
type PostSortField = 'published_at' | 'view_count' | 'title' | 'created_at'

/** 数据加载状态 */
interface LoadingState {
  isLoading: boolean
  isError: boolean
  error: Error | null
}

/** 带分页的数据状态 */
interface PaginatedDataState<T> extends LoadingState {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/** 带数据的加载状态 */
interface DataState<T> extends LoadingState {
  data: T | null
}

/**
 * 文章列表查询参数
 */
export interface UsePostsOptions {
  /** 页码（从 1 开始） */
  page?: number
  /** 每页数量 */
  pageSize?: number
  /** 文章状态过滤 */
  status?: PostStatus
  /** 分类 slug 过滤 */
  categorySlug?: string
  /** 标签 slug 过滤 */
  tagSlug?: string
  /** 作者 ID 过滤 */
  authorId?: string
  /** 搜索关键词 */
  search?: string
  /** 排序字段 */
  orderBy?: PostSortField
  /** 排序方向 */
  order?: SortOrder
}

/**
 * 文章列表 Hook 返回类型
 */
export interface UsePostsReturn extends PaginatedDataState<PostWithAuthor> {
  /** 刷新数据 */
  refresh: () => Promise<void>
}

/**
 * 单篇文章 Hook 返回类型
 */
export interface UsePostReturn extends DataState<PostWithRelations> {
  /** 刷新数据 */
  refresh: () => Promise<void>
}

// ===========================================
// 数据转换函数
// ===========================================

/**
 * 将数据库 Post 转换为应用类型
 */
function toPost(dbPost: DbPost): Omit<PostWithAuthor, 'author'> {
  return {
    id: dbPost.id,
    title: dbPost.title,
    slug: dbPost.slug,
    content: dbPost.content,
    excerpt: dbPost.excerpt,
    coverImage: dbPost.cover_image,
    status: dbPost.status,
    authorId: dbPost.author_id,
    categoryId: dbPost.category_id,
    viewCount: dbPost.view_count,
    publishedAt: dbPost.published_at ? new Date(dbPost.published_at) : null,
    createdAt: new Date(dbPost.created_at),
    updatedAt: new Date(dbPost.updated_at),
  }
}

/**
 * 将数据库 UserBrief 转换为应用类型
 */
function toUserBrief(dbUser: DbUserBrief) {
  return {
    id: dbUser.id,
    name: dbUser.name,
    avatarUrl: dbUser.avatar_url,
  }
}

/**
 * 将数据库 Category 转换为应用类型
 */
function toCategory(dbCategory: DbCategory) {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    description: dbCategory.description,
    sortOrder: dbCategory.sort_order,
  }
}

/**
 * 将数据库 Tag 转换为应用类型
 */
function toTag(dbTag: DbTag) {
  return {
    id: dbTag.id,
    name: dbTag.name,
    slug: dbTag.slug,
    color: dbTag.color,
  }
}

/**
 * 将 PostgREST 文章数据转换为应用类型（带作者）
 */
function transformPostWithAuthor(dbPost: DbPostWithAuthor): PostWithAuthor {
  return {
    ...toPost(dbPost),
    author: toUserBrief(dbPost.author),
  }
}

/**
 * 将 PostgREST 文章数据转换为应用类型（带完整关联）
 */
function transformPostWithRelations(dbPost: DbPostWithRelations): PostWithRelations {
  return {
    ...toPost(dbPost),
    author: toUserBrief(dbPost.author),
    category: dbPost.category ? toCategory(dbPost.category) : null,
    tags: dbPost.tags.map(({ tag }) => ({ tag: toTag(tag) })),
  }
}

// ===========================================
// usePosts Hook
// ===========================================

/**
 * 获取文章列表
 * 支持分页、过滤、排序
 *
 * @param options 查询选项
 * @returns 文章列表数据和状态
 *
 * @example
 * ```tsx
 * const { data, isLoading, total, page } = usePosts({
 *   page: 1,
 *   pageSize: 10,
 *   status: 'PUBLISHED',
 * })
 * ```
 */
export function usePosts(options: UsePostsOptions = {}): UsePostsReturn {
  const {
    page = 1,
    pageSize = DEFAULT_PAGE_SIZE,
    status = 'PUBLISHED',
    categorySlug,
    tagSlug,
    authorId,
    search,
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
      // 构建查询
      let query = postgrest
        .from('posts')
        .select(
          `
          *,
          author:users!posts_author_id_fkey(id, name, avatar_url)
        `,
          { count: 'exact' }
        )

      // 状态过滤
      if (status) {
        query = query.eq('status', status as Enums<'PostStatus'>)
      }

      // 作者过滤
      if (authorId) {
        query = query.eq('author_id', authorId)
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

      // 标签过滤（使用内连接）
      if (tagSlug) {
        const { data: tag } = await postgrest
          .from('tags')
          .select('id')
          .eq('slug', tagSlug)
          .single()

        if (tag) {
          // 获取带有该标签的文章 ID
          const { data: postTags } = await postgrest
            .from('post_tags')
            .select('post_id')
            .eq('tag_id', tag.id)

          if (postTags && postTags.length > 0) {
            const postIds = postTags.map((pt) => pt.post_id)
            query = query.in('id', postIds)
          } else {
            // 没有匹配的文章
            setData([])
            setTotal(0)
            setIsLoading(false)
            return
          }
        }
      }

      // 搜索过滤
      if (search) {
        query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`)
      }

      // 排序
      query = query.order(orderBy, { ascending: order === 'asc' })

      // 分页
      const [start, end] = getPaginationRange(page, pageSize)
      query = query.range(start, end)

      // 执行查询
      const { data: posts, count, error: queryError } = await query

      if (queryError) {
        throw new Error(queryError.message)
      }

      // 转换数据
      const transformedPosts = (posts as unknown as DbPostWithAuthor[]).map(transformPostWithAuthor)

      setData(transformedPosts)
      setTotal(count ?? 0)
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('获取文章列表失败'))
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, status, categorySlug, tagSlug, authorId, search, orderBy, order])

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

// ===========================================
// usePost Hook
// ===========================================

/**
 * 获取单篇文章详情
 * 包含作者、分类、标签等关联数据
 *
 * @param idOrSlug 文章 ID 或 slug
 * @returns 文章详情数据和状态
 *
 * @example
 * ```tsx
 * const { data: post, isLoading, isError } = usePost('my-post-slug')
 * ```
 */
export function usePost(idOrSlug: string): UsePostReturn {
  const [data, setData] = useState<PostWithRelations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchPost = useCallback(async () => {
    if (!idOrSlug) {
      setData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      // 判断是 ID 还是 slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)
      const filterField = isUUID ? 'id' : 'slug'

      // 查询文章基本信息和作者
      const { data: post, error: postError } = await postgrest
        .from('posts')
        .select(
          `
          *,
          author:users!posts_author_id_fkey(id, name, avatar_url),
          category:categories(id, name, slug, description, sort_order)
        `
        )
        .eq(filterField, idOrSlug)
        .single()

      if (postError) {
        throw new Error(postError.message)
      }

      if (!post) {
        throw new Error('文章不存在')
      }

      // 查询文章标签
      const { data: postTags, error: tagsError } = await postgrest
        .from('post_tags')
        .select(
          `
          tag:tags(id, name, slug, color)
        `
        )
        .eq('post_id', post.id)

      if (tagsError) {
        throw new Error(tagsError.message)
      }

      // 组合数据
      const fullPost = {
        ...post,
        tags: postTags ?? [],
      } as unknown as DbPostWithRelations

      setData(transformPostWithRelations(fullPost))
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('获取文章详情失败'))
    } finally {
      setIsLoading(false)
    }
  }, [idOrSlug])

  useEffect(() => {
    fetchPost()
  }, [fetchPost])

  return {
    data,
    isLoading,
    isError,
    error,
    refresh: fetchPost,
  }
}