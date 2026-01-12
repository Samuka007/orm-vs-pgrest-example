'use client'

// ===========================================
// 分类列表页面
// 显示每个分类的文章数量
// ===========================================

import Link from 'next/link'
import { useCategoriesWithPostCount } from '@/hooks'
import { CategoryListSkeleton } from '@/components/client'

export default function CategoriesPage() {
  const { data: categories, isLoading, isError, error } = useCategoriesWithPostCount()

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">文章分类</h1>
        <p className="mt-1 text-gray-600">
          浏览所有分类，找到您感兴趣的内容
        </p>
      </div>

      {/* 分类列表 */}
      {isLoading ? (
        <CategoryListSkeleton count={6} />
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">加载失败</h3>
          <p className="mt-1 text-sm text-gray-500">
            {error?.message || '获取分类列表时发生错误'}
          </p>
        </div>
      ) : !categories || categories.length === 0 ? (
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
          <h3 className="mt-2 text-sm font-medium text-gray-900">暂无分类</h3>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/client/posts?category=${category.slug}`}
              className="group block p-6 bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-blue-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="mt-2 text-gray-600 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {category.postCount}
                  </span>
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-blue-600 group-hover:text-blue-700">
                <span>查看文章</span>
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
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
          ))}
        </div>
      )}

      {/* 统计信息 */}
      {categories && categories.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">分类统计</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">分类总数</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">文章总数</p>
              <p className="text-2xl font-bold text-gray-900">
                {categories.reduce((sum, cat) => sum + cat.postCount, 0)}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-sm text-gray-500">平均每分类</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  categories.reduce((sum, cat) => sum + cat.postCount, 0) /
                    categories.length
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 技术说明 */}
      <div className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-3">
          Client 端数据获取
        </h2>
        <p className="text-purple-800 mb-4">
          此页面使用 <code className="bg-purple-100 px-1 rounded">useCategoriesWithPostCount</code> Hook
          在客户端获取分类数据和文章数量。
        </p>
        <ul className="space-y-2 text-purple-800">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>数据在客户端通过 PostgREST API 获取</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>显示加载骨架屏提升用户体验</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>支持错误处理和空状态展示</span>
          </li>
        </ul>
      </div>
    </div>
  )
}