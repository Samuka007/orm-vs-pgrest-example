'use client'

// ===========================================
// Client 端方案首页
// 使用 PostgREST Client 端获取数据
// ===========================================

import Link from 'next/link'
import { usePosts, useCategoriesWithPostCount } from '@/hooks'
import {
  PostListSkeleton,
  CategoryListSkeleton,
  StatsGridSkeleton,
} from '@/components/client'
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
 * 简单文章卡片
 */
function SimplePostCard({ post }: { post: PostWithAuthor }) {
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
          <span>{formatDate(post.publishedAt)}</span>
        </div>
      </div>
    </article>
  )
}

export default function ClientHomePage() {
  // 获取最新文章
  const {
    data: recentPosts,
    isLoading: postsLoading,
    isError: postsError,
  } = usePosts({ page: 1, pageSize: 6, status: 'PUBLISHED' })

  // 获取分类列表
  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategoriesWithPostCount()

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Client Component 示例
        </h1>
        <p className="mt-2 text-gray-600">
          使用 PostgREST 在客户端获取数据，实现 CSR 数据获取
        </p>
      </div>

      {/* 统计数据 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">数据统计</h2>
        {postsLoading || categoriesLoading ? (
          <StatsGridSkeleton count={4} />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">文章总数</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {recentPosts.length > 0 ? '6+' : '0'}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">分类数</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {categories?.length || 0}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">数据获取方式</p>
                  <p className="text-lg font-bold text-gray-900">Client</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">API 类型</p>
                  <p className="text-lg font-bold text-gray-900">PostgREST</p>
                </div>
                <div className="p-3 bg-orange-100 rounded-full">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 分类列表 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">文章分类</h2>
          <Link
            href="/client/categories"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            查看全部 →
          </Link>
        </div>
        {categoriesLoading ? (
          <CategoryListSkeleton count={4} />
        ) : categoriesError ? (
          <div className="text-center py-8 text-red-500">加载分类失败</div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories?.map((category) => (
              <Link
                key={category.id}
                href={`/client/posts?category=${category.slug}`}
                className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {category.description}
                  </p>
                )}
                <p className="mt-2 text-sm text-blue-600">
                  {category.postCount} 篇文章
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 最新文章 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">最新文章</h2>
          <Link
            href="/client/posts"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            查看全部 →
          </Link>
        </div>
        {postsLoading ? (
          <PostListSkeleton count={6} />
        ) : postsError ? (
          <div className="text-center py-8 text-red-500">加载文章失败</div>
        ) : recentPosts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">暂无文章</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <SimplePostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* 技术说明 */}
      <section className="bg-purple-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-purple-900 mb-3">
          Client Component 特点
        </h2>
        <ul className="space-y-2 text-purple-800">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>使用 PostgREST API 在客户端获取数据</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>支持无刷新分页和实时交互</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>乐观更新提供即时反馈</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>适合需要频繁交互的动态页面</span>
          </li>
        </ul>
      </section>
    </div>
  )
}