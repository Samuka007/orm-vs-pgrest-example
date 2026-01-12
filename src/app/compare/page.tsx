import Link from 'next/link'
import {
  ComparisonTable,
  CodeComparison,
  FeatureCard,
  SideBySideDemo,
} from '@/components/compare'

export default function ComparePage() {
  return (
    <div className="space-y-16">
      {/* 概述部分 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">概述</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <FeatureCard
            title="Client 端方案"
            subtitle="PostgREST + @supabase/postgrest-js"
            color="blue"
            features={[
              '浏览器直接查询 PostgREST API',
              '客户端渲染 (CSR)',
              '无刷新分页和交互',
              '乐观更新，即时反馈',
              '适合高交互场景',
            ]}
            linkHref="/client"
            linkText="查看 Client 端演示"
          />
          <FeatureCard
            title="Server 端方案"
            subtitle="Prisma ORM + Server Component"
            color="purple"
            features={[
              '服务端直接查询数据库',
              '服务端渲染 (SSR)',
              'HTML 直出，SEO 友好',
              '类型安全，IDE 提示完善',
              '适合内容展示场景',
            ]}
            linkHref="/server"
            linkText="查看 Server 端演示"
          />
        </div>
      </section>

      {/* 特性对比表格 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">特性对比</h2>
        <ComparisonTable />
      </section>

      {/* 代码对比 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">代码实现对比</h2>
        <CodeComparison />
      </section>

      {/* 并排演示 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">实际效果对比</h2>
        <SideBySideDemo />
      </section>

      {/* 适用场景 */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">适用场景建议</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Client 端适用场景 */}
          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-blue-900 dark:text-blue-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              推荐使用 Client 端方案
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                '高交互性应用（如实时协作、聊天）',
                '需要乐观更新的场景',
                '已有 PostgREST/Supabase 基础设施',
                '前后端分离的团队结构',
                '需要频繁无刷新更新的页面',
                '用户操作密集的管理后台',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-blue-800 dark:text-blue-200">
                  <svg className="mt-1 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Server 端适用场景 */}
          <div className="rounded-2xl border border-purple-200 bg-purple-50 p-6 dark:border-purple-800 dark:bg-purple-950">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-purple-900 dark:text-purple-100">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
              </svg>
              推荐使用 Server 端方案
            </h3>
            <ul className="mt-4 space-y-3">
              {[
                'SEO 敏感的内容站点（博客、新闻）',
                '复杂数据聚合需求',
                '需要强类型保证的项目',
                '全栈开发团队',
                '首屏加载性能要求高',
                '数据安全性要求高的场景',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-purple-800 dark:text-purple-200">
                  <svg className="mt-1 h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 总结 */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">总结</h2>
        <p className="text-lg text-white/90 mb-6">
          两种方案各有优劣，选择哪种方案取决于你的具体需求。在实际项目中，你甚至可以混合使用两种方案：
          对于需要 SEO 的页面使用 Server Component，对于高交互的功能使用 Client Component。
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/client/posts"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-base font-medium text-blue-600 transition-colors hover:bg-gray-100"
          >
            体验 Client 端
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/server/posts"
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 px-6 py-3 text-base font-medium text-white transition-colors hover:bg-white/30"
          >
            体验 Server 端
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}