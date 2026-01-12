// ===========================================
// 分类标签组件
// 用于展示文章分类
// ===========================================

import type { Category } from '@/types'

interface CategoryBadgeProps {
  category: Category
}

/**
 * 分类标签组件
 */
export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {category.name}
    </span>
  )
}