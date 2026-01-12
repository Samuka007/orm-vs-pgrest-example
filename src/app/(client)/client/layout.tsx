'use client'

// ===========================================
// Client 端路由组布局
// 使用 PostgREST Client 端方案
// ===========================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface ClientLayoutProps {
  children: React.ReactNode
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const pathname = usePathname()

  // 判断当前路由是否激活
  const isActive = (path: string) => {
    if (path === '/client') {
      return pathname === '/client'
    }
    return pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* Logo */}
              <Link href="/client" className="flex items-center">
                <span className="text-xl font-bold text-blue-600">博客系统</span>
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                  Client
                </span>
              </Link>

              {/* 导航链接 */}
              <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
                <Link
                  href="/client"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/client') && pathname === '/client'
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  首页
                </Link>
                <Link
                  href="/client/posts"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/client/posts')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  文章
                </Link>
                <Link
                  href="/client/categories"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive('/client/categories')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  分类
                </Link>
              </div>
            </div>

            {/* 右侧信息 */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500">
                PostgREST Client 数据获取
              </span>
            </div>
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="sm:hidden border-t border-gray-200">
          <div className="flex space-x-1 px-4 py-2">
            <Link
              href="/client"
              className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/client') && pathname === '/client'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              首页
            </Link>
            <Link
              href="/client/posts"
              className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/client/posts')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              文章
            </Link>
            <Link
              href="/client/categories"
              className={`flex-1 text-center px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/client/categories')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
              }`}
            >
              分类
            </Link>
          </div>
        </div>
      </nav>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">
              © 2024 博客内容管理系统 - Client Component 示例
            </p>
            <div className="mt-2 sm:mt-0 flex items-center space-x-4">
              <span className="text-xs text-gray-400">
                使用 Next.js + PostgREST 构建
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}