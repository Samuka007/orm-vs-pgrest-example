// ===========================================
// Server 端方案首页
// 使用 Prisma SSR 直接查询数据库，展示文章列表
// ===========================================

import { getPosts } from '@/lib/server'
import { PostList } from '@/components/ui/PostList'

// 强制动态渲染，避免构建时预渲染（需要数据库连接）
export const dynamic = 'force-dynamic'

export default async function ServerHomePage() {
  // 获取文章列表
  const { data: posts, total } = await getPosts({
    page: 1,
    pageSize: 9,
    status: 'PUBLISHED',
    orderBy: 'publishedAt',
    order: 'desc',
  })

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Server Component 示例
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          使用 Prisma ORM 在服务端直接查询数据库，实现 SSR 数据获取
        </p>
      </div>

      {/* 技术说明 */}
      <section className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
          Server Component 特点
        </h2>
        <ul className="space-y-2 text-purple-800 dark:text-purple-200">
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>直接在服务端使用 Prisma ORM 查询数据库</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>无需创建 API 端点，减少网络请求</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>数据在服务端渲染，SEO 友好</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>敏感数据（如数据库凭证）不会暴露给客户端</span>
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
        <PostList posts={posts} />
      </section>
    </div>
  )
}