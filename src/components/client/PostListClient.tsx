'use client'

// ===========================================
// 客户端文章列表组件
// 使用 PostgREST hooks 获取数据
// ===========================================

import { useState } from 'react'
import Link from 'next/link'
import { usePosts, type UsePostsOptions } from '@/hooks'
import type { PostWithAuthor } from '@/types'
import { PostListSkeleton } from './LoadingSkeleton'

interface PostListClientProps {
  /** 初始查询选项 */
  initialOptions?: UsePostsOptions
  /** 链接前缀 */
  linkPrefix?: string
  /** 空状态提示文本 */
  emptyText?: string
  /** 是否显示分页 */
  showPagination?: boolean
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
 * 客户端文章卡片组件
 */
function ClientPostCard({
  post,
  linkPrefix = '/client',
}: {
  post: PostWithAuthor
  linkPrefix?: string
}) {
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

/**
 * 客户端分页组件（无刷新）
 */
function ClientPagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) {
    return null
  }

  /**
   * 生成页码数组
   */
  function getPageNumbers(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = []
    const showPages = 5

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      const halfShow = Math.floor(showPages / 2)
      let start = Math.max(1, currentPage - halfShow)
      let end = Math.min(totalPages, currentPage + halfShow)

      if (currentPage - halfShow < 1) {
        end = Math.min(totalPages, showPages)
      }
      if (currentPage + halfShow > totalPages) {
        start = Math.max(1, totalPages - showPages + 1)
      }

      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('ellipsis')
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('ellipsis')
        }
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex items-center justify-center space-x-1" aria-label="分页导航">
      {/* 上一页 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-3 py-2 rounded-md text-sm font-medium border ${
          currentPage <= 1
            ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
        }`}
      >
        上一页
      </button>

      {/* 页码 */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-sm text-gray-500"
            >
              ...
            </span>
          )
        }

        const isCurrentPage = page === currentPage

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium border ${
              isCurrentPage
                ? 'text-white bg-blue-600 border-blue-600'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
            aria-current={isCurrentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      })}

      {/* 下一页 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-3 py-2 rounded-md text-sm font-medium border ${
          currentPage >= totalPages
            ? 'text-gray-400 bg-gray-100 border-gray-200 cursor-not-allowed'
            : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
        }`}
      >
        下一页
      </button>
    </nav>
  )
}

/**
 * 客户端文章列表组件
 */
export function PostListClient({
  initialOptions = {},
  linkPrefix = '/client',
  emptyText = '暂无文章',
  showPagination = true,
}: PostListClientProps) {
  const [page, setPage] = useState(initialOptions.page || 1)
  const [categorySlug, setCategorySlug] = useState(initialOptions.categorySlug)

  const {
    data: posts,
    total,
    totalPages,
    isLoading,
    isError,
    error,
  } = usePosts({
    ...initialOptions,
    page,
    categorySlug,
  })

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 加载状态
  if (isLoading) {
    return <PostListSkeleton count={initialOptions.pageSize || 9} />
  }

  // 错误状态
  if (isError) {
    return (
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
          {error?.message || '获取文章列表时发生错误'}
        </p>
      </div>
    )
  }

  // 空状态
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
    <div className="space-y-6">
      {/* 文章网格 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <ClientPostCard key={post.id} post={post} linkPrefix={linkPrefix} />
        ))}
      </div>

      {/* 分页 */}
      {showPagination && totalPages > 1 && (
        <div className="mt-8">
          <ClientPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* 总数信息 */}
      <div className="text-center text-sm text-gray-500">
        共 {total} 篇文章，第 {page} / {totalPages} 页
      </div>
    </div>
  )
}

// 导出分类过滤器组件
export { ClientPagination }