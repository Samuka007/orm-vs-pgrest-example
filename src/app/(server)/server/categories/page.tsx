// ===========================================
// 分类列表页面
// 显示所有分类及其文章数量
// ===========================================

import Link from 'next/link'
import { getCategoriesWithPostCount } from '@/lib/server'

export default async function CategoriesPage() {
  // 获取带文章数量的分类列表
  const categories = await getCategoriesWithPostCount()

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">文章分类</h1>
        <p className="mt-1 text-gray-600">
          共 {categories.length} 个分类
        </p>
      </div>

      {/* 分类列表 */}
      {categories.length === 0 ? (
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
              href={`/server/posts?category=${category.slug}`}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
            >
              {/* 分类头部 */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {category.name}
                  </h2>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {category._count.posts} 篇
                  </span>
                </div>

                {/* 分类描述 */}
                {category.description ? (
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {category.description}
                  </p>
                ) : (
                  <p className="text-gray-400 text-sm italic">暂无描述</p>
                )}
              </div>

              {/* 分类底部 */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <span className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                  查看文章
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
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* 统计信息 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">分类统计</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">总分类数</p>
            <p className="text-2xl font-bold text-gray-900">
              {categories.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">总文章数</p>
            <p className="text-2xl font-bold text-gray-900">
              {categories.reduce((sum, cat) => sum + cat._count.posts, 0)}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-500">平均每分类文章数</p>
            <p className="text-2xl font-bold text-gray-900">
              {categories.length > 0
                ? (
                    categories.reduce((sum, cat) => sum + cat._count.posts, 0) /
                    categories.length
                  ).toFixed(1)
                : 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}