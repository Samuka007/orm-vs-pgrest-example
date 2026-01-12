'use client'

// ===========================================
// 客户端分类列表组件
// 使用 PostgREST hooks 获取数据
// ===========================================

import Link from 'next/link'
import { useCategoriesWithPostCount, type CategoryWithPostCount } from '@/hooks'
import { CategoryListSkeleton } from './LoadingSkeleton'

interface CategoryListClientProps {
  /** 链接前缀 */
  linkPrefix?: string
  /** 空状态提示文本 */
  emptyText?: string
}

/**
 * 分类卡片组件
 */
function CategoryCard({
  category,
  linkPrefix = '/client',
}: {
  category: CategoryWithPostCount
  linkPrefix?: string
}) {
  return (
    <Link
      href={`${linkPrefix}/posts?category=${category.slug}`}
      className="block p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {category.description}
            </p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-600 font-semibold">
            {category.postCount}
          </span>
        </div>
      </div>
      <div className="mt-3 flex items-center text-sm text-blue-600">
        <span>查看文章</span>
        <svg
          className="w-4 h-4 ml-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}

/**
 * 客户端分类列表组件
 */
export function CategoryListClient({
  linkPrefix = '/client',
  emptyText = '暂无分类',
}: CategoryListClientProps) {
  const { data: categories, isLoading, isError, error } = useCategoriesWithPostCount()

  // 加载状态
  if (isLoading) {
    return <CategoryListSkeleton count={4} />
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
          {error?.message || '获取分类列表时发生错误'}
        </p>
      </div>
    )
  }

  // 空状态
  if (!categories || categories.length === 0) {
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
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyText}</h3>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          linkPrefix={linkPrefix}
        />
      ))}
    </div>
  )
}

/**
 * 简单分类列表（用于侧边栏等）
 */
export function SimpleCategoryList({
  linkPrefix = '/client',
}: {
  linkPrefix?: string
}) {
  const { data: categories, isLoading } = useCategoriesWithPostCount()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!categories || categories.length === 0) {
    return <p className="text-sm text-gray-500">暂无分类</p>
  }

  return (
    <ul className="space-y-1">
      {categories.map((category) => (
        <li key={category.id}>
          <Link
            href={`${linkPrefix}/posts?category=${category.slug}`}
            className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
          >
            <span>{category.name}</span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {category.postCount}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}