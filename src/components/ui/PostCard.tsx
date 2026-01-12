// ===========================================
// 文章卡片组件
// 用于展示文章摘要信息
// ===========================================

import Link from 'next/link'
import type { PostWithRelations } from '@/types'
import { CategoryBadge } from './CategoryBadge'

interface PostCardProps {
  post: PostWithRelations
  /** 链接前缀，用于区分不同路由组 */
  linkPrefix?: string
}

/**
 * 格式化日期
 */
function formatDate(date: Date | null): string {
  if (!date) return '未发布'
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * 文章卡片组件
 */
export function PostCard({ post, linkPrefix = '/server' }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* 封面图片 */}
      {post.coverImage && (
        <div className="aspect-video bg-gray-200 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {/* 分类和标签 */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {post.category && <CategoryBadge category={post.category} />}
          {post.tags.slice(0, 3).map(({ tag }) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb',
                color: tag.color || '#374151',
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          <Link
            href={`${linkPrefix}/posts/${post.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* 摘要 */}
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        {/* 元信息 */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {/* 作者头像 */}
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {post.author.name.charAt(0)}
                </span>
              </div>
            )}
            <span>{post.author.name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              {post.viewCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}