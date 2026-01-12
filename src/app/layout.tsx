import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

// 配置 Inter 字体
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

// 网站元数据
export const metadata: Metadata = {
  title: {
    default: 'DB Frontend Example',
    template: '%s | DB Frontend Example',
  },
  description: '前端数据库查询对比项目 - 比较 PostgREST (Client) 和 Prisma ORM (Server) 两种数据获取方式',
  keywords: ['Next.js', 'Prisma', 'PostgREST', 'PostgreSQL', 'React', 'TypeScript'],
  authors: [{ name: 'DB Frontend Example Team' }],
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    siteName: 'DB Frontend Example',
  },
}

// 根布局组件
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN" className={inter.variable}>
      <body className="min-h-screen bg-gray-50 font-sans antialiased dark:bg-gray-900">
        {/* 主内容区域 */}
        <div className="flex min-h-screen flex-col">
          {/* 头部导航 */}
          <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/80">
            <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-8">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white">
                  <svg
                    className="h-8 w-8 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                    />
                  </svg>
                  <span>DB Frontend</span>
                </Link>

                {/* 导航链接 */}
                <div className="hidden items-center gap-6 md:flex">
                  <Link
                    href="/client"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Client 端
                  </Link>
                  <Link
                    href="/server"
                    className="text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                  >
                    Server 端
                  </Link>
                </div>
              </div>

              {/* 右侧操作区 */}
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com/Samuka007/orm-vs-pgrest-example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </div>
            </nav>
          </header>

          {/* 主内容 */}
          <main className="flex-1">{children}</main>

          {/* 页脚 */}
          <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} DB Frontend Example. 用于演示前端数据库查询对比。
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>技术栈:</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Next.js 15</span>
                  <span>•</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Prisma</span>
                  <span>•</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300">PostgREST</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}