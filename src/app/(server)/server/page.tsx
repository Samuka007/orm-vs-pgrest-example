// ===========================================
// Server 端方案首页
// 使用 Prisma SSR 直接查询数据库
// ===========================================

import Link from 'next/link'
import { getPosts, getRecentPosts, getPostStats } from '@/lib/server'
import { getCategoriesWithPostCount } from '@/lib/server'
import { PostList } from '@/components/ui/PostList'
import { StatsCard, StatsGrid } from '@/components/ui/StatsCard'

export default async function ServerHomePage() {
  // 并行获取数据
  const [recentPosts, stats, categories] = await Promise.all([
    getRecentPosts(6),
    getPostStats(),
    getCategoriesWithPostCount(),
  ])

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Server Component 示例
        </h1>
        <p className="mt-2 text-gray-600">
          使用 Prisma ORM 在服务端直接查询数据库，实现 SSR 数据获取
        </p>
      </div>

      {/* 统计数据 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">数据统计</h2>
        <StatsGrid>
          <StatsCard
            title="文章总数"
            value={stats.totalPosts}
            description={`已发布 ${stats.publishedPosts} 篇`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
          />
          <StatsCard
            title="总浏览量"
            value={stats.totalViews}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            }
          />
          <StatsCard
            title="评论数"
            value={stats.totalComments}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            }
          />
          <StatsCard
            title="分类数"
            value={stats.totalCategories}
            description={`标签 ${stats.totalTags} 个`}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            }
          />
        </StatsGrid>
      </section>

      {/* 分类列表 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">文章分类</h2>
          <Link
            href="/server/categories"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            查看全部 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/server/posts?category=${category.slug}`}
              className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="font-medium text-gray-900">{category.name}</h3>
              {category.description && (
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {category.description}
                </p>
              )}
              <p className="mt-2 text-sm text-blue-600">
                {category._count.posts} 篇文章
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 最新文章 */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">最新文章</h2>
          <Link
            href="/server/posts"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            查看全部 →
          </Link>
        </div>
        <PostList posts={recentPosts} linkPrefix="/server" />
      </section>

      {/* 技术说明 */}
      <section className="bg-blue-50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-3">
          Server Component 特点
        </h2>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>直接在服务端使用 Prisma ORM 查询数据库</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>无需创建 API 端点，减少网络请求</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>数据在服务端渲染，SEO 友好</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>敏感数据（如数据库凭证）不会暴露给客户端</span>
          </li>
        </ul>
      </section>
    </div>
  )
}