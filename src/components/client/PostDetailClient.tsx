'use client'

// ===========================================
// 客户端文章详情组件
// 使用 PostgREST hooks 获取数据
// ===========================================

import Link from 'next/link'
import { usePost } from '@/hooks'
import { PostDetailSkeleton } from './LoadingSkeleton'
import { CommentSection } from './CommentSection'

interface PostDetailClientProps {
  /** 文章 ID 或 slug */
  postId: string
  /** 链接前缀 */
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
 * 客户端文章详情组件
 */
export function PostDetailClient({
  postId,
  linkPrefix = '/client',
}: PostDetailClientProps) {
  const { data: post, isLoading, isError, error } = usePost(postId)

  // 加载状态
  if (isLoading) {
    return <PostDetailSkeleton />
  }

  // 错误状态
  if (isError) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">加载失败</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error?.message || '获取文章详情时发生错误'}
          </p>
          <div className="mt-4">
            <Link
              href={`${linkPrefix}/posts`}
              className="text-blue-600 hover:text-blue-800"
            >
              返回文章列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // 文章不存在
  if (!post) {
    return (
      <div className="max-w-4xl mx-auto">
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">文章不存在</h3>
          <p className="mt-1 text-sm text-gray-500">
            您访问的文章可能已被删除或不存在
          </p>
          <div className="mt-4">
            <Link
              href={`${linkPrefix}/posts`}
              className="text-blue-600 hover:text-blue-800"
            >
              返回文章列表
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* 返回链接 */}
      <div className="mb-6">
        <Link
          href={`${linkPrefix}/posts`}
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回文章列表
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="mb-8">
        {/* 分类和标签 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <Link
              href={`${linkPrefix}/posts?category=${post.category.slug}`}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
            >
              {post.category.name}
            </Link>
          )}
          {post.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
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
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {/* 作者 */}
          <div className="flex items-center gap-2">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm text-gray-600">
                  {post.author.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-medium text-gray-700">{post.author.name}</span>
          </div>

          <span>•</span>

          {/* 发布日期 */}
          <span>{formatDate(post.publishedAt)}</span>

          <span>•</span>

          {/* 浏览量 */}
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
            {post.viewCount} 次浏览
          </span>
        </div>
      </header>

      {/* 封面图片 */}
      {post.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose prose-lg max-w-none mb-12">
        {/* 摘要 */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 italic border-l-4 border-blue-500 pl-4 mb-6">
            {post.excerpt}
          </p>
        )}

        {/* 正文内容 */}
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* 分隔线 */}
      <hr className="my-8 border-gray-200" />

      {/* 评论区 */}
      <CommentSection postId={post.id} />
    </article>
  )
}