// ===========================================
// 分页组件
// 用于文章列表分页导航
// ===========================================

import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  /** 基础 URL，分页参数会追加到此 URL */
  baseUrl: string
  /** 其他查询参数 */
  searchParams?: Record<string, string>
}

/**
 * 分页组件
 */
export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  /**
   * 构建分页链接
   */
  function buildPageUrl(page: number): string {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    return `${baseUrl}?${params.toString()}`
  }

  /**
   * 生成页码数组
   */
  function getPageNumbers(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = []
    const showPages = 5 // 显示的页码数量

    if (totalPages <= showPages) {
      // 总页数小于等于显示数量，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // 总页数大于显示数量，需要省略
      const halfShow = Math.floor(showPages / 2)
      let start = Math.max(1, currentPage - halfShow)
      let end = Math.min(totalPages, currentPage + halfShow)

      // 调整起始和结束位置
      if (currentPage - halfShow < 1) {
        end = Math.min(totalPages, showPages)
      }
      if (currentPage + halfShow > totalPages) {
        start = Math.max(1, totalPages - showPages + 1)
      }

      // 添加第一页
      if (start > 1) {
        pages.push(1)
        if (start > 2) {
          pages.push('ellipsis')
        }
      }

      // 添加中间页码
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // 添加最后一页
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('ellipsis')
        }
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav className="flex items-center justify-center space-x-1" aria-label="分页导航">
      {/* 上一页 */}
      {currentPage > 1 ? (
        <Link
          href={buildPageUrl(currentPage - 1)}
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
        >
          上一页
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
          上一页
        </span>
      )}

      {/* 页码 */}
      {pageNumbers.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <span
              key={`ellipsis-${index}`}
              className="px-3 py-2 text-sm text-gray-500"
            >
              ...
            </span>
          )
        }

        const isCurrentPage = page === currentPage

        return isCurrentPage ? (
          <span
            key={page}
            className="px-3 py-2 rounded-md text-sm font-medium text-white bg-blue-600 border border-blue-600"
            aria-current="page"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={buildPageUrl(page)}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
          >
            {page}
          </Link>
        )
      })}

      {/* 下一页 */}
      {currentPage < totalPages ? (
        <Link
          href={buildPageUrl(currentPage + 1)}
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300"
        >
          下一页
        </Link>
      ) : (
        <span className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed">
          下一页
        </span>
      )}
    </nav>
  )
}