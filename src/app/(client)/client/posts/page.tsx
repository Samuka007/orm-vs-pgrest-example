'use client'

// ===========================================
// 文章列表页面
// 支持客户端分页和分类过滤
// ===========================================

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { usePosts, useCategories } from '@/hooks'
import { PostListSkeleton } from '@/components/client'
import type { PostWithAuthor, Category } from '@/types'

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
    <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
        <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          <Link
            href={`/client/posts/${post.id}`}
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
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
 * 分类过滤器组件
 */
function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
}: {
  categories: Category[]
  selectedCategory: string | null
  onCategoryChange: (slug: string | null) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onCategoryChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          selectedCategory === null
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        全部
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.slug)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedCategory === category.slug
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
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

  const getPageNumbers = (): (number | 'ellipsis')[] => {
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

        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-md text-sm font-medium border ${
              page === currentPage
                ? 'text-white bg-blue-600 border-blue-600'
                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        )
      })}

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

export default function PostsPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('category')

  const [page, setPage] = useState(1)
  const [categorySlug, setCategorySlug] = useState<string | null>(initialCategory)

  // 获取分类列表
  const { data: categories, isLoading: categoriesLoading } = useCategories()

  // 获取文章列表
  const {
    data: posts,
    total,
    totalPages,
    isLoading: postsLoading,
    isError: postsError,
    error,
  } = usePosts({
    page,
    pageSize: 9,
    status: 'PUBLISHED',
    categorySlug: categorySlug || undefined,
  })

  // 当分类变化时重置页码
  const handleCategoryChange = (slug: string | null) => {
    setCategorySlug(slug)
    setPage(1)
  }

  // 处理页码变化
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 获取当前分类名称
  const currentCategory = categories?.find((c) => c.slug === categorySlug)

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {currentCategory ? `${currentCategory.name} 分类文章` : '全部文章'}
        </h1>
        <p className="mt-1 text-gray-600">
          共 {total} 篇文章
          {currentCategory && (
            <button
              onClick={() => handleCategoryChange(null)}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              查看全部 →
            </button>
          )}
        </p>
      </div>

      {/* 分类过滤器 */}
      {!categoriesLoading && categories && categories.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-sm font-medium text-gray-700 mb-3">按分类筛选</h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={categorySlug}
            onCategoryChange={handleCategoryChange}
          />
        </div>
      )}

      {/* 文章列表 */}
      {postsLoading ? (
        <PostListSkeleton count={9} />
      ) : postsError ? (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {currentCategory ? `${currentCategory.name} 分类下暂无文章` : '暂无文章'}
          </h3>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}

          {/* 总数信息 */}
          <div className="text-center text-sm text-gray-500">
            第 {page} / {totalPages} 页
          </div>
        </>
      )}
    </div>
  )
}