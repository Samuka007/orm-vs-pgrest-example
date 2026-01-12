import Link from 'next/link'

export function SideBySideDemo() {
  return (
    <div className="space-y-6">
      {/* 说明 */}
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <p className="text-gray-700 dark:text-gray-300">
          下面展示了两种方案在实际应用中的效果对比。点击链接可以体验完整功能。
        </p>
      </div>

      {/* 并排演示区域 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client 端演示 */}
        <div className="overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between border-b border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <span className="font-medium text-blue-900 dark:text-blue-100">Client 端</span>
            </div>
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              CSR
            </span>
          </div>
          
          <div className="bg-white p-6 dark:bg-gray-900">
            {/* 模拟的文章列表 */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />
                      <div className="mt-2 h-3 w-full rounded bg-gray-100 dark:bg-gray-800" />
                      <div className="mt-1 h-3 w-2/3 rounded bg-gray-100 dark:bg-gray-800" />
                    </div>
                    <div className="ml-4 h-16 w-16 rounded bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-20 rounded bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-16 rounded bg-gray-100 dark:bg-gray-800" />
                  </div>
                </div>
              ))}
            </div>

            {/* 特点说明 */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
              <h4 className="font-medium text-blue-900 dark:text-blue-100">Client 端特点</h4>
              <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                <li>• 页面加载后通过 API 获取数据</li>
                <li>• 分页切换无需刷新页面</li>
                <li>• 支持实时搜索和筛选</li>
                <li>• 加载时显示骨架屏</li>
              </ul>
            </div>

            {/* 链接 */}
            <div className="mt-4">
              <Link
                href="/client/posts"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600"
              >
                体验 Client 端文章列表
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Server 端演示 */}
        <div className="overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center justify-between border-b border-purple-200 bg-purple-50 px-4 py-3 dark:border-purple-800 dark:bg-purple-950">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              <span className="font-medium text-purple-900 dark:text-purple-100">Server 端</span>
            </div>
            <span className="rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-700 dark:bg-purple-900 dark:text-purple-300">
              SSR
            </span>
          </div>
          
          <div className="bg-white p-6 dark:bg-gray-900">
            {/* 模拟的文章列表 - 已渲染状态 */}
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        示例文章标题 {i}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        这是文章的摘要内容，展示了 Server 端渲染的效果...
                      </p>
                    </div>
                    <div className="ml-4 h-16 w-16 rounded bg-gradient-to-br from-purple-400 to-purple-600" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600" />
                    <span>作者名称</span>
                    <span>•</span>
                    <span>2024-01-01</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 特点说明 */}
            <div className="mt-6 rounded-lg bg-purple-50 p-4 dark:bg-purple-950">
              <h4 className="font-medium text-purple-900 dark:text-purple-100">Server 端特点</h4>
              <ul className="mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-200">
                <li>• 页面直接返回完整 HTML</li>
                <li>• 首屏加载更快</li>
                <li>• SEO 友好，搜索引擎可索引</li>
                <li>• 无需等待 JavaScript 执行</li>
              </ul>
            </div>

            {/* 链接 */}
            <div className="mt-4">
              <Link
                href="/server/posts"
                className="inline-flex items-center gap-2 rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-600"
              >
                体验 Server 端文章列表
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 功能对比 */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-800">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">功能演示对比</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">功能</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400">Client 端</th>
                <th className="px-6 py-3 text-center text-sm font-medium text-purple-600 dark:text-purple-400">Server 端</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">文章列表</td>
                <td className="px-6 py-4 text-center">
                  <Link href="/client/posts" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    /client/posts
                  </Link>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link href="/server/posts" className="text-sm text-purple-600 hover:underline dark:text-purple-400">
                    /server/posts
                  </Link>
                </td>
              </tr>
              <tr className="bg-gray-50/30 dark:bg-gray-900/30">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">文章详情</td>
                <td className="px-6 py-4 text-center">
                  <Link href="/client/posts/1" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    /client/posts/[id]
                  </Link>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link href="/server/posts/1" className="text-sm text-purple-600 hover:underline dark:text-purple-400">
                    /server/posts/[id]
                  </Link>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">分类列表</td>
                <td className="px-6 py-4 text-center">
                  <Link href="/client/categories" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    /client/categories
                  </Link>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link href="/server/categories" className="text-sm text-purple-600 hover:underline dark:text-purple-400">
                    /server/categories
                  </Link>
                </td>
              </tr>
              <tr className="bg-gray-50/30 dark:bg-gray-900/30">
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">首页概览</td>
                <td className="px-6 py-4 text-center">
                  <Link href="/client" className="text-sm text-blue-600 hover:underline dark:text-blue-400">
                    /client
                  </Link>
                </td>
                <td className="px-6 py-4 text-center">
                  <Link href="/server" className="text-sm text-purple-600 hover:underline dark:text-purple-400">
                    /server
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}