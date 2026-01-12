'use client'

// ===========================================
// 评论数据 Hooks
// 用于 Client 端获取和管理评论数据
// 使用 Supabase CLI 生成的类型定义
// ===========================================

import { useState, useEffect, useCallback } from 'react'
import { postgrest, type DbComment, type DbUserBrief } from '@/lib/postgrest'
import type { CommentWithAuthor } from '@/types'

// ===========================================
// 类型定义
// ===========================================

/** 数据加载状态 */
interface LoadingState {
  isLoading: boolean
  isError: boolean
  error: Error | null
}

/** 带数据的加载状态 */
interface DataState<T> extends LoadingState {
  data: T | null
}

/** 变更操作状态 */
interface MutationState {
  isSubmitting: boolean
  isError: boolean
  error: Error | null
  isSuccess: boolean
}

/** 带作者的评论（数据库格式） */
type DbCommentWithAuthor = DbComment & {
  author: DbUserBrief
}

/**
 * 评论列表 Hook 返回类型
 */
export interface UseCommentsReturn extends DataState<CommentWithAuthor[]> {
  /** 刷新数据 */
  refresh: () => Promise<void>
}

/**
 * 添加评论输入参数
 */
export interface AddCommentInput {
  /** 评论内容 */
  content: string
  /** 作者 ID */
  authorId: string
  /** 父评论 ID（可选，用于回复） */
  parentId?: string
}

/**
 * 添加评论 Hook 返回类型
 */
export interface UseAddCommentReturn extends MutationState {
  /** 添加评论 */
  addComment: (input: AddCommentInput) => Promise<CommentWithAuthor | null>
  /** 重置状态 */
  reset: () => void
}

// ===========================================
// 数据转换函数
// ===========================================

/**
 * 将数据库 Comment 转换为应用类型
 */
function toComment(dbComment: DbComment) {
  return {
    id: dbComment.id,
    content: dbComment.content,
    postId: dbComment.post_id,
    authorId: dbComment.author_id,
    parentId: dbComment.parent_id,
    createdAt: new Date(dbComment.created_at),
    updatedAt: new Date(dbComment.updated_at),
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
 * 将 PostgREST 评论数据转换为应用类型
 */
function transformCommentWithAuthor(dbComment: DbCommentWithAuthor): CommentWithAuthor {
  return {
    ...toComment(dbComment),
    author: toUserBrief(dbComment.author),
  }
}

// ===========================================
// useComments Hook
// ===========================================

/**
 * 获取文章评论列表
 *
 * @param postId 文章 ID
 * @returns 评论列表数据和状态
 *
 * @example
 * ```tsx
 * const { data: comments, isLoading, refresh } = useComments(postId)
 * ```
 */
export function useComments(postId: string): UseCommentsReturn {
  const [data, setData] = useState<CommentWithAuthor[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const { data: comments, error: queryError } = await postgrest
        .from('comments')
        .select(
          `
          *,
          author:users!comments_author_id_fkey(id, name, avatar_url)
        `
        )
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (queryError) {
        throw new Error(queryError.message)
      }

      // 转换数据
      const transformedComments = (comments as unknown as DbCommentWithAuthor[]).map(transformCommentWithAuthor)

      setData(transformedComments)
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('获取评论列表失败'))
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  return {
    data,
    isLoading,
    isError,
    error,
    refresh: fetchComments,
  }
}

// ===========================================
// useAddComment Hook
// ===========================================

/**
 * 添加评论 Hook
 * 支持乐观更新
 *
 * @param postId 文章 ID
 * @param onSuccess 成功回调（可选）
 * @returns 添加评论方法和状态
 *
 * @example
 * ```tsx
 * const { addComment, isSubmitting, isError } = useAddComment(postId, () => {
 *   // 刷新评论列表
 *   refreshComments()
 * })
 *
 * const handleSubmit = async () => {
 *   await addComment({
 *     content: '这是一条评论',
 *     authorId: currentUserId,
 *   })
 * }
 * ```
 */
export function useAddComment(
  postId: string,
  onSuccess?: (comment: CommentWithAuthor) => void
): UseAddCommentReturn {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const reset = useCallback(() => {
    setIsSubmitting(false)
    setIsError(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  const addComment = useCallback(
    async (input: AddCommentInput): Promise<CommentWithAuthor | null> => {
      if (!postId || !input.content || !input.authorId) {
        setIsError(true)
        setError(new Error('缺少必要参数'))
        return null
      }

      setIsSubmitting(true)
      setIsError(false)
      setError(null)
      setIsSuccess(false)

      try {
        // 插入评论
        const { data: newComment, error: insertError } = await postgrest
          .from('comments')
          .insert({
            content: input.content,
            post_id: postId,
            author_id: input.authorId,
            parent_id: input.parentId ?? null,
          })
          .select(
            `
            *,
            author:users!comments_author_id_fkey(id, name, avatar_url)
          `
          )
          .single()

        if (insertError) {
          throw new Error(insertError.message)
        }

        if (!newComment) {
          throw new Error('添加评论失败')
        }

        const transformedComment = transformCommentWithAuthor(newComment as unknown as DbCommentWithAuthor)

        setIsSuccess(true)
        onSuccess?.(transformedComment)

        return transformedComment
      } catch (err) {
        setIsError(true)
        setError(err instanceof Error ? err : new Error('添加评论失败'))
        return null
      } finally {
        setIsSubmitting(false)
      }
    },
    [postId, onSuccess]
  )

  return {
    addComment,
    isSubmitting,
    isError,
    error,
    isSuccess,
    reset,
  }
}

// ===========================================
// useCommentsWithOptimisticUpdate Hook
// ===========================================

/**
 * 带乐观更新的评论 Hook 返回类型
 */
export interface UseCommentsWithOptimisticUpdateReturn extends UseCommentsReturn {
  /** 添加评论（乐观更新） */
  addComment: (input: AddCommentInput) => Promise<CommentWithAuthor | null>
  /** 添加评论状态 */
  addCommentState: MutationState
}

/**
 * 带乐观更新的评论 Hook
 * 添加评论时立即更新 UI，后台同步数据
 *
 * @param postId 文章 ID
 * @returns 评论列表数据、添加方法和状态
 *
 * @example
 * ```tsx
 * const {
 *   data: comments,
 *   isLoading,
 *   addComment,
 *   addCommentState,
 * } = useCommentsWithOptimisticUpdate(postId)
 *
 * const handleSubmit = async () => {
 *   await addComment({
 *     content: '这是一条评论',
 *     authorId: currentUserId,
 *   })
 * }
 * ```
 */
export function useCommentsWithOptimisticUpdate(
  postId: string
): UseCommentsWithOptimisticUpdateReturn {
  const [data, setData] = useState<CommentWithAuthor[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // 添加评论状态
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addError, setAddError] = useState<Error | null>(null)
  const [isAddError, setIsAddError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const fetchComments = useCallback(async () => {
    if (!postId) {
      setData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const { data: comments, error: queryError } = await postgrest
        .from('comments')
        .select(
          `
          *,
          author:users!comments_author_id_fkey(id, name, avatar_url)
        `
        )
        .eq('post_id', postId)
        .order('created_at', { ascending: true })

      if (queryError) {
        throw new Error(queryError.message)
      }

      const transformedComments = (comments as unknown as DbCommentWithAuthor[]).map(transformCommentWithAuthor)
      setData(transformedComments)
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('获取评论列表失败'))
    } finally {
      setIsLoading(false)
    }
  }, [postId])

  useEffect(() => {
    fetchComments()
  }, [fetchComments])

  const addComment = useCallback(
    async (input: AddCommentInput): Promise<CommentWithAuthor | null> => {
      if (!postId || !input.content || !input.authorId) {
        setIsAddError(true)
        setAddError(new Error('缺少必要参数'))
        return null
      }

      setIsSubmitting(true)
      setIsAddError(false)
      setAddError(null)
      setIsSuccess(false)

      // 创建乐观更新的评论对象
      const optimisticId = `optimistic-${Date.now()}`
      const optimisticComment: CommentWithAuthor = {
        id: optimisticId,
        content: input.content,
        postId,
        authorId: input.authorId,
        parentId: input.parentId ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
        author: {
          id: input.authorId,
          name: '加载中...',
          avatarUrl: null,
        },
      }

      // 乐观更新 UI
      setData((prev: CommentWithAuthor[] | null) => (prev ? [...prev, optimisticComment] : [optimisticComment]))

      try {
        // 后台同步
        const { data: newComment, error: insertError } = await postgrest
          .from('comments')
          .insert({
            content: input.content,
            post_id: postId,
            author_id: input.authorId,
            parent_id: input.parentId ?? null,
          })
          .select(
            `
            *,
            author:users!comments_author_id_fkey(id, name, avatar_url)
          `
          )
          .single()

        if (insertError) {
          throw new Error(insertError.message)
        }

        if (!newComment) {
          throw new Error('添加评论失败')
        }

        const transformedComment = transformCommentWithAuthor(newComment as unknown as DbCommentWithAuthor)

        // 用真实数据替换乐观更新的数据
        setData((prev: CommentWithAuthor[] | null) =>
          prev
            ? prev.map((comment: CommentWithAuthor) =>
                comment.id === optimisticId ? transformedComment : comment
              )
            : [transformedComment]
        )

        setIsSuccess(true)
        return transformedComment
      } catch (err) {
        // 回滚乐观更新
        setData((prev: CommentWithAuthor[] | null) => (prev ? prev.filter((comment: CommentWithAuthor) => comment.id !== optimisticId) : null))

        setIsAddError(true)
        setAddError(err instanceof Error ? err : new Error('添加评论失败'))
        return null
      } finally {
        setIsSubmitting(false)
      }
    },
    [postId]
  )

  return {
    data,
    isLoading,
    isError,
    error,
    refresh: fetchComments,
    addComment,
    addCommentState: {
      isSubmitting,
      isError: isAddError,
      error: addError,
      isSuccess,
    },
  }
}