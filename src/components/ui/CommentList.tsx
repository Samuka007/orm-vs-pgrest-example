// ===========================================
// 评论列表组件
// 用于展示文章评论
// ===========================================

import type { CommentWithAuthor, CommentWithReplies } from '@/types'

interface CommentItemProps {
  comment: CommentWithAuthor
  /** 是否为回复 */
  isReply?: boolean
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
function CommentItem({ comment, isReply = false }: CommentItemProps) {
  return (
    <div className={`flex gap-3 ${isReply ? 'ml-12' : ''}`}>
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
        </div>
        <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
      </div>
    </div>
  )
}

interface CommentListProps {
  comments: CommentWithReplies[]
  /** 空状态提示文本 */
  emptyText?: string
}

/**
 * 评论列表组件（支持嵌套回复）
 */
export function CommentList({
  comments,
  emptyText = '暂无评论',
}: CommentListProps) {
  if (comments.length === 0) {
    return (
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyText}</h3>
        <p className="mt-1 text-sm text-gray-500">成为第一个评论的人吧！</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          {/* 顶级评论 */}
          <CommentItem comment={comment} />

          {/* 回复列表 */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="space-y-4">
              {comment.replies.map((reply) => (
                <CommentItem key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface FlatCommentListProps {
  comments: CommentWithAuthor[]
  /** 空状态提示文本 */
  emptyText?: string
}

/**
 * 扁平评论列表组件（不支持嵌套）
 */
export function FlatCommentList({
  comments,
  emptyText = '暂无评论',
}: FlatCommentListProps) {
  if (comments.length === 0) {
    return (
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
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyText}</h3>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  )
}