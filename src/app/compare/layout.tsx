import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '方案对比',
  description: '对比 PostgREST (Client 端) 和 Prisma ORM (Server 端) 两种数据获取方式的差异',
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 对比页面头部 */}
      <div className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Link href="/" className="hover:text-gray-700 dark:hover:text-gray-300">
                  首页
                </Link>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 dark:text-white">方案对比</span>
              </nav>
              <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Client vs Server 方案对比
              </h1>
              <p className="mt-1 text-gray-600 dark:text-gray-400">
                深入对比两种数据获取方式的特点、优劣和适用场景
              </p>
            </div>
            
            {/* 快速跳转 */}
            <div className="flex flex-wrap gap-2">
              <Link
                href="/client"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-500 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                Client 端
              </Link>
              <Link
                href="/server"
                className="inline-flex items-center gap-2 rounded-lg border border-purple-500 bg-purple-50 px-4 py-2 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-100 dark:bg-purple-950 dark:text-purple-300 dark:hover:bg-purple-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                Server 端
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 页面内容 */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* 页脚导航 */}
      <div className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              想要亲自体验两种方案的差异？
            </p>
            <div className="flex gap-4">
              <Link
                href="/client/posts"
                className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
              >
                体验 Client 端文章列表 →
              </Link>
              <Link
                href="/server/posts"
                className="text-sm font-medium text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
              >
                体验 Server 端文章列表 →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}