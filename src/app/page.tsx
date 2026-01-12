import Link from 'next/link'

// 首页组件 - 简化为只有两个入口链接
export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero 区域 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
          <span className="block">前端数据库查询</span>
          <span className="block text-blue-600 dark:text-blue-400">对比演示</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          比较两种前端数据库查询方式：
          <strong className="text-gray-900 dark:text-white"> PostgREST (Client 端)</strong> 和
          <strong className="text-gray-900 dark:text-white"> Prisma ORM (Server 端)</strong>
        </p>
      </div>

      {/* 方案入口卡片 */}
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {/* Client 端方案 */}
        <Link
          href="/client"
          className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-800"
        >
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10 transition-transform group-hover:scale-150" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Client 端</h2>
            </div>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              使用 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-700">@supabase/postgrest-js</code> 在浏览器中直接查询 PostgREST API
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                客户端分页，无刷新体验
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                乐观更新，即时反馈
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <span className="font-medium">查看演示</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        {/* Server 端方案 */}
        <Link
          href="/server"
          className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-800"
        >
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10 transition-transform group-hover:scale-150" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Server 端</h2>
            </div>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              使用 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-700">Prisma ORM</code> 在 Next.js Server Component 中查询数据库
            </p>

            <ul className="mt-6 space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                HTML 直出，SEO 友好
              </li>
              <li className="flex items-center gap-2">
                <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                类型安全，IDE 提示完善
              </li>
            </ul>

            <div className="mt-6 flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <span className="font-medium">查看演示</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* 快速开始 */}
      <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-800/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">快速开始</h2>
        <div className="mt-4 rounded-lg bg-gray-900 p-4 dark:bg-gray-950">
          <pre className="overflow-x-auto text-sm text-gray-300">
            <code>{`# 1. 启动数据库服务
pnpm db:up

# 2. 运行数据库迁移
pnpm db:migrate

# 3. 播种示例数据
pnpm db:seed

# 4. 授予 PostgREST 权限
pnpm db:grant

# 5. 启动开发服务器
pnpm dev`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}