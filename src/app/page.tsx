import Link from 'next/link'

// 技术栈数据
const techStack = [
  { name: 'Next.js 15', color: 'bg-black dark:bg-white dark:text-black' },
  { name: 'React 19', color: 'bg-blue-500' },
  { name: 'TypeScript', color: 'bg-blue-600' },
  { name: 'Prisma', color: 'bg-gray-800 dark:bg-gray-200 dark:text-gray-800' },
  { name: 'PostgREST', color: 'bg-green-600' },
  { name: 'PostgreSQL', color: 'bg-blue-700' },
]

// 对比数据
const comparisonData = [
  { dimension: '数据获取方式', client: 'CSR (客户端渲染)', server: 'SSR (服务端渲染)', serverWins: false },
  { dimension: '类型安全', client: '需手动定义类型', server: '自动推断', serverWins: true },
  { dimension: '首屏加载', client: '需等待 JS 执行', server: 'HTML 直出', serverWins: true },
  { dimension: 'SEO 友好度', client: '需额外处理', server: '天然支持', serverWins: true },
  { dimension: '实时更新', client: '乐观更新', server: '需 revalidate', serverWins: false, clientWins: true },
  { dimension: '交互体验', client: '无刷新分页', server: '页面跳转', serverWins: false, clientWins: true },
]

// 技术栈对比数据
const techComparisonData = [
  { layer: '框架', client: 'Next.js (Client Component)', server: 'Next.js (Server Component)' },
  { layer: '数据获取', client: '@supabase/postgrest-js', server: 'Prisma ORM' },
  { layer: 'API 层', client: 'PostgREST (自动生成)', server: '无需 API (直连数据库)' },
  { layer: '数据库', client: 'PostgreSQL', server: 'PostgreSQL' },
  { layer: '状态管理', client: 'React Hooks', server: '无需状态管理' },
]

// 勾选图标组件
function CheckIcon() {
  return (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

// 首页组件
export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero 区域 */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
          <span className="block">前端数据库查询</span>
          <span className="block text-blue-600 dark:text-blue-400">对比演示</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
          比较两种前端数据库查询方式：
          <strong className="text-gray-900 dark:text-white"> PostgREST (Client 端)</strong> 和
          <strong className="text-gray-900 dark:text-white"> Prisma ORM (Server 端)</strong>
          在实际应用中的代码范式、易用程度与解耦程度。
        </p>
        
        {/* 快速导航按钮 */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-3 text-base font-medium text-white shadow-lg transition-all hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            查看详细对比
          </Link>
          <Link
            href="/client"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-blue-500 px-6 py-3 text-base font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
          >
            Client 端演示
          </Link>
          <Link
            href="/server"
            className="inline-flex items-center gap-2 rounded-lg border-2 border-purple-500 px-6 py-3 text-base font-medium text-purple-600 transition-colors hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950"
          >
            Server 端演示
          </Link>
        </div>
      </div>

      {/* 快速对比预览 */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-8">快速对比预览</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">对比维度</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">Client 端 (PostgREST)</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-600 dark:text-purple-400">Server 端 (Prisma)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {comparisonData.map((row, index) => (
                  <tr key={row.dimension} className={index % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-900/50' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.dimension}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                      {row.clientWins ? (
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckIcon />
                          {row.client}
                        </span>
                      ) : (
                        row.client
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
                      {row.serverWins ? (
                        <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckIcon />
                          {row.server}
                        </span>
                      ) : (
                        row.server
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="mt-4 text-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            查看完整对比分析
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* 方案对比卡片 */}
      <div className="mt-20 grid gap-8 md:grid-cols-2">
        {/* Client 端方案 */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-blue-500/10" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                <svg className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Client 端方案</h2>
            </div>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              使用 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-700">@supabase/postgrest-js</code> 在浏览器中直接查询 PostgREST API。
            </p>

            <ul className="mt-6 space-y-3">
              {['客户端分页，无刷新体验', '乐观更新，即时反馈', '适合高交互场景'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              <Link href="/client" className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600">
                查看演示
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/client/posts" className="inline-flex items-center gap-2 rounded-lg border border-blue-500 px-4 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950">
                文章列表
              </Link>
            </div>
          </div>
        </div>

        {/* Server 端方案 */}
        <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-lg dark:border-gray-800 dark:bg-gray-800">
          <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-purple-500/10" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                <svg className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Server 端方案</h2>
            </div>

            <p className="mt-4 text-gray-600 dark:text-gray-400">
              使用 <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm dark:bg-gray-700">Prisma ORM</code> 在 Next.js Server Component 中查询数据库。
            </p>

            <ul className="mt-6 space-y-3">
              {['HTML 直出，SEO 友好', '类型安全，IDE 提示完善', '强大的聚合查询能力'].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <svg className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-600 dark:text-gray-400">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex gap-3">
              <Link href="/server" className="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600">
                查看演示
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/server/posts" className="inline-flex items-center gap-2 rounded-lg border border-purple-500 px-4 py-2 text-sm font-medium text-purple-600 transition-colors hover:bg-purple-50 dark:text-purple-400 dark:hover:bg-purple-950">
                文章列表
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 技术栈说明 */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">技术栈</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {techStack.map((tech) => (
            <div key={tech.name} className={`flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium text-white ${tech.color}`}>
              {tech.name}
            </div>
          ))}
        </div>
      </div>

      {/* 技术栈对比表格 */}
      <div className="mt-20">
        <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-8">技术栈对比</h2>
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">技术层</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600 dark:text-blue-400">Client 端方案</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-purple-600 dark:text-purple-400">Server 端方案</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {techComparisonData.map((row, index) => (
                  <tr key={row.layer} className={index % 2 === 1 ? 'bg-gray-50/50 dark:bg-gray-900/50' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{row.layer}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">{row.client}</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400">{row.server}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 快速开始 */}
      <div className="mt-20 rounded-2xl border border-gray-200 bg-gray-50 p-8 dark:border-gray-800 dark:bg-gray-800/50">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">快速开始</h2>
        <div className="mt-6 space-y-4">
          <div className="rounded-lg bg-gray-900 p-4 dark:bg-gray-950">
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
          <p className="text-sm text-gray-600 dark:text-gray-400">
            访问 <code className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">http://localhost:3000</code> 查看应用，
            PostgREST API 运行在 <code className="rounded bg-gray-200 px-1.5 py-0.5 dark:bg-gray-700">http://localhost:3001</code>。
          </p>
        </div>
      </div>
    </div>
  )
}