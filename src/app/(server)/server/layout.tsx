// ===========================================
// Server 端路由组布局
// 使用 Prisma SSR 方案
// ===========================================

import Link from 'next/link'

interface ServerLayoutProps {
  children: React.ReactNode
}

export default function ServerLayout({ children }: ServerLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/server" className="flex items-center">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">博客系统</span>
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded">
                  Server
                </span>
              </Link>

              {/* 导航链接 */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link
                  href="/server"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded-md transition-colors"
                >
                  首页
                </Link>
              </div>
            </div>

            {/* 右侧信息 */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Prisma SSR 数据获取
              </span>
            </div>
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1 px-4 py-2">
            <Link
              href="/server"
              className="flex-1 text-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-gray-700 rounded-md"
            >
              首页
            </Link>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-auto dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2024 博客内容管理系统 - Server Component 示例
            </p>
            <div className="mt-2 sm:mt-0 flex items-center space-x-4">
              <span className="text-xs text-gray-400 dark:text-gray-500">
                使用 Next.js + Prisma 构建
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}