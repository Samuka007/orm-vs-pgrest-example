// ===========================================
// 分类标签组件
// 用于展示文章分类
// ===========================================

import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryBadgeProps {
  category: Category
  /** 链接前缀，用于区分不同路由组 */
  linkPrefix?: string
  /** 是否可点击 */
  clickable?: boolean
}

/**
 * 分类标签组件
 */
export function CategoryBadge({
  category,
  linkPrefix = '/server',
  clickable = true,
}: CategoryBadgeProps) {
  const badgeContent = (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
      {category.name}
    </span>
  )

  if (clickable) {
    return (
      <Link href={`${linkPrefix}/posts?category=${category.slug}`}>
        {badgeContent}
      </Link>
    )
  }

  return badgeContent
}