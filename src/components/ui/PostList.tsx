// ===========================================
// 文章列表组件
// 用于展示文章列表
// ===========================================

import type { PostWithRelations } from '@/types'
import { PostCard } from './PostCard'

interface PostListProps {
  posts: PostWithRelations[]
  /** 空状态提示文本 */
  emptyText?: string
}

/**
 * 文章列表组件
 */
export function PostList({
  posts,
  emptyText = '暂无文章',
}: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
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
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyText}</h3>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}