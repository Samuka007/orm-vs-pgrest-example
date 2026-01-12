// ===========================================
// Server 端分类数据获取函数
// 使用 Prisma ORM 直接查询数据库
// ===========================================

import { prisma } from '@/lib/prisma'
import type { Category } from '@/types'

/**
 * 分类及其文章数量
 */
export interface CategoryWithPostCount extends Category {
  _count: {
    posts: number
  }
}

/**
 * 获取所有分类列表
 */
export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.category.findMany({
    orderBy: {
      sortOrder: 'asc',
    },
  })

  return categories
}

/**
 * 获取带文章数量的分类列表
 */
export async function getCategoriesWithPostCount(): Promise<
  CategoryWithPostCount[]
> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: 'PUBLISHED',
            },
          },
        },
      },
    },
    orderBy: {
      sortOrder: 'asc',
    },
  })

  return categories as CategoryWithPostCount[]
}

/**
 * 通过 slug 获取分类
 */
export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  return category
}

/**
 * 通过 ID 获取分类
 */
export async function getCategory(id: string): Promise<Category | null> {
  const category = await prisma.category.findUnique({
    where: { id },
  })

  return category
}