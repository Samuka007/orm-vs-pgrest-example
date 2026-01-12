// 对比表格组件
// 展示两种方案的特性对比

// 对比项类型定义
interface ComparisonItem {
  dimension: string
  client: string
  server: string
  serverWins?: boolean
  clientWins?: boolean
  neutral?: boolean
}

interface ComparisonSection {
  category: string
  items: ComparisonItem[]
}

// 对比数据
const comparisonData: ComparisonSection[] = [
  {
    category: '数据获取',
    items: [
      { dimension: '渲染方式', client: 'CSR (客户端渲染)', server: 'SSR (服务端渲染)', serverWins: true },
      { dimension: '数据获取时机', client: '页面加载后', server: '页面渲染前', serverWins: true },
      { dimension: '首屏加载', client: '需等待 JS 执行', server: 'HTML 直出', serverWins: true },
      { dimension: '数据更新', client: '实时更新', server: '需 revalidate', clientWins: true },
    ],
  },
  {
    category: '开发体验',
    items: [
      { dimension: '类型安全', client: '需手动定义类型', server: '自动推断', serverWins: true },
      { dimension: 'IDE 支持', client: '一般', server: '完善的自动补全', serverWins: true },
      { dimension: '调试体验', client: '浏览器 DevTools', server: '服务端日志', neutral: true },
      { dimension: '代码复杂度', client: '需要状态管理', server: '相对简洁', serverWins: true },
    ],
  },
  {
    category: '性能特点',
    items: [
      { dimension: 'SEO 友好度', client: '需额外处理', server: '天然支持', serverWins: true },
      { dimension: '交互响应', client: '无刷新分页', server: '页面跳转', clientWins: true },
      { dimension: '乐观更新', client: '支持', server: '不支持', clientWins: true },
      { dimension: '服务器负载', client: '较低', server: '较高', clientWins: true },
    ],
  },
  {
    category: '架构特点',
    items: [
      { dimension: 'API 层', client: 'PostgREST 自动生成', server: '无需 API', serverWins: true },
      { dimension: '数据库访问', client: '通过 REST API', server: '直接 ORM 查询', serverWins: true },
      { dimension: '安全性', client: '需配置 RLS', server: '服务端保护', serverWins: true },
      { dimension: '部署复杂度', client: '需要额外服务', server: '单一应用', serverWins: true },
    ],
  },
]

// 勾选图标
function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className || 'h-4 w-4'} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  )
}

export function ComparisonTable() {
  return (
    <div className="space-y-8">
      {comparisonData.map((section) => (
        <div key={section.category} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
          {/* 分类标题 */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.category}</h3>
          </div>
          
          {/* 表格 */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50 dark:border-gray-700 dark:bg-gray-900/50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">对比维度</th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400">
                    Client 端 (PostgREST)
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-purple-600 dark:text-purple-400">
                    Server 端 (Prisma)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {section.items.map((item, index) => (
                  <tr key={item.dimension} className={index % 2 === 1 ? 'bg-gray-50/30 dark:bg-gray-900/30' : ''}>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {item.dimension}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {item.clientWins ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <CheckIcon />
                          {item.client}
                        </span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{item.client}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center text-sm">
                      {item.serverWins ? (
                        <span className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400">
                          <CheckIcon />
                          {item.server}
                        </span>
                      ) : (
                        <span className="text-gray-600 dark:text-gray-400">{item.server}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* 图例说明 */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-2">
          <CheckIcon className="h-4 w-4 text-green-500" />
          <span>表示该方案在此维度更有优势</span>
        </div>
      </div>
    </div>
  )
}