'use client'

// ===========================================
// Client 端方案首页
// 使用 PostgREST Client 端获取数据，展示文章列表
// ===========================================

import { useState } from 'react'
import Link from 'next/link'
import { usePosts } from '@/hooks'
import { PostListSkeleton } from '@/components/client'
import type { PostWithAuthor } from '@/types'

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
function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {post.coverImage && (
        <div className="aspect-video bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-6 h-6 rounded-full"
              />
            ) : (
              <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {post.author.name.charAt(0)}
                </span>
              </div>
            )}
            <span>{post.author.name}</span>
          </div>
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </article>
  )
}

/**
 * 分页组件
 */
function Pagination({
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

  return (
    <nav className="flex items-center justify-center space-x-2" aria-label="分页导航">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-4 py-2 rounded-md text-sm font-medium border ${
          currentPage <= 1
            ? 'text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        上一页
      </button>

      <span className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400">
        {currentPage} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 rounded-md text-sm font-medium border ${
          currentPage >= totalPages
            ? 'text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed'
            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        下一页
      </button>
    </nav>
  )
}

export default function ClientHomePage() {
  const [page, setPage] = useState(1)

  // 获取文章列表
  const {
    data: posts,
    total,
    totalPages,
    isLoading,
    isError,
    error,
  } = usePosts({
    page,
    pageSize: 9,
    status: 'PUBLISHED',
  })

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Client Component 示例
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          使用 PostgREST 在客户端获取数据，实现 CSR 数据获取
        </p>
      </div>

      {/* 技术说明 */}
      <section className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
          Client Component 特点
        </h2>
        <ul className="space-y-2 text-blue-800 dark:text-blue-200">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>使用 PostgREST API 在客户端获取数据</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>支持无刷新分页和实时交互</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>乐观更新提供即时反馈</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>适合需要频繁交互的动态页面</span>
          </li>
        </ul>
      </section>

      {/* 文章列表 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            文章列表 <span className="text-sm font-normal text-gray-500">（共 {total} 篇）</span>
          </h2>
        </div>

        {isLoading ? (
          <PostListSkeleton count={9} />
        ) : isError ? (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">加载失败</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {error?.message || '获取文章列表时发生错误'}
            </p>
          </div>
        ) : posts.length === 0 ? (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">暂无文章</h3>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* 分页 */}
      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}