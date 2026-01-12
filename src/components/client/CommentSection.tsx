'use client'

// ===========================================
// 评论区组件
// 支持添加评论和乐观更新
// ===========================================

import { useState } from 'react'
import { useCommentsWithOptimisticUpdate, type AddCommentInput } from '@/hooks'
import { CommentListSkeleton } from './LoadingSkeleton'
import type { CommentWithAuthor } from '@/types'

interface CommentSectionProps {
  /** 文章 ID */
  postId: string
}

/**
 * 格式化日期时间
 */
function formatDateTime(date: Date): string {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * 单条评论组件
 */
function CommentItem({ comment }: { comment: CommentWithAuthor }) {
  const isOptimistic = comment.id.startsWith('optimistic-')

  return (
    <div className={`flex gap-3 ${isOptimistic ? 'opacity-70' : ''}`}>
      {/* 头像 */}
      {comment.author.avatarUrl ? (
        <img
          src={comment.author.avatarUrl}
          alt={comment.author.name}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <span className="text-sm text-gray-600">
            {comment.author.name.charAt(0)}
          </span>
        </div>
      )}

      {/* 评论内容 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">{comment.author.name}</span>
          <span className="text-sm text-gray-500">
            {formatDateTime(comment.createdAt)}
          </span>
          {isOptimistic && (
            <span className="text-xs text-blue-500 animate-pulse">发送中...</span>
          )}
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  )
}

/**
 * 评论表单组件
 */
function CommentForm({
  onSubmit,
  isSubmitting,
  error,
}: {
  onSubmit: (content: string) => void
  isSubmitting: boolean
  error: Error | null
}) {
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim() && !isSubmitting) {
      onSubmit(content.trim())
      setContent('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="comment" className="sr-only">
          评论内容
        </label>
        <textarea
          id="comment"
          rows={4}
          className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500 resize-none"
          placeholder="写下你的评论..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      {error && (
        <div className="text-sm text-red-600">
          {error.message || '发送评论失败，请重试'}
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!content.trim() || isSubmitting}
          className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            !content.trim() || isSubmitting
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              发送中...
            </>
          ) : (
            '发表评论'
          )}
        </button>
      </div>
    </form>
  )
}

/**
 * 评论区组件
 */
export function CommentSection({ postId }: CommentSectionProps) {
  const {
    data: comments,
    isLoading,
    isError,
    error,
    addComment,
    addCommentState,
  } = useCommentsWithOptimisticUpdate(postId)

  // 模拟当前用户 ID（实际应用中应从认证系统获取）
  // 这里使用一个固定的演示用户 ID
  const currentUserId = 'demo-user-id'

  const handleAddComment = async (content: string) => {
    await addComment({
      content,
      authorId: currentUserId,
    })
  }

  // 加载状态
  if (isLoading) {
    return (
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">评论</h2>
        <CommentListSkeleton count={3} />
      </section>
    )
  }

  // 错误状态
  if (isError) {
    return (
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">评论</h2>
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">加载评论失败</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error?.message || '获取评论时发生错误'}
          </p>
        </div>
      </section>
    )
  }

  const commentList = comments || []

  return (
    <section>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        评论 ({commentList.length})
      </h2>

      {/* 评论表单 */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-3">发表评论</h3>
        <CommentForm
          onSubmit={handleAddComment}
          isSubmitting={addCommentState.isSubmitting}
          error={addCommentState.error}
        />
      </div>

      {/* 评论列表 */}
      {commentList.length === 0 ? (
        <div className="text-center py-8">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无评论</h3>
          <p className="mt-1 text-sm text-gray-500">成为第一个评论的人吧！</p>
        </div>
      ) : (
        <div className="space-y-6">
          {commentList.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  )
}