'use client'

// ===========================================
// 分类数据 Hooks
// 用于 Client 端获取分类数据
// 使用 Supabase CLI 生成的类型定义
// ===========================================

import { useState, useEffect, useCallback } from 'react'
import { postgrest, type DbCategory } from '@/lib/postgrest'
import type { Category } from '@/types'

// ===========================================
// 类型定义
// ===========================================

/** 数据加载状态 */
interface LoadingState {
  isLoading: boolean
  isError: boolean
  error: Error | null
}

/** 带数据的加载状态 */
interface DataState<T> extends LoadingState {
  data: T | null
}

/**
 * 分类列表 Hook 返回类型
 */
export interface UseCategoriesReturn extends DataState<Category[]> {
  /** 刷新数据 */
  refresh: () => Promise<void>
}

/**
 * 单个分类 Hook 返回类型
 */
export interface UseCategoryReturn extends DataState<Category> {
  /** 刷新数据 */
  refresh: () => Promise<void>
}

// ===========================================
// 数据转换函数
// ===========================================

/**
 * 将数据库 Category 转换为应用类型
 */
function toCategory(dbCategory: DbCategory): Category {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    slug: dbCategory.slug,
    description: dbCategory.description,
    sortOrder: dbCategory.sort_order,
  }
}

// ===========================================
// useCategories Hook
// ===========================================

/**
 * 获取分类列表
 * 按 sortOrder 排序
 *
 * @returns 分类列表数据和状态
 *
 * @example
 * ```tsx
 * const { data: categories, isLoading } = useCategories()
 * ```
 */
export function useCategories(): UseCategoriesReturn {
  const [data, setData] = useState<Category[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      const { data: categories, error: queryError } = await postgrest
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (queryError) {
        throw new Error(queryError.message)
      }

      // 转换数据
      const transformedCategories = (categories as DbCategory[]).map(toCategory)

      setData(transformedCategories)
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('获取分类列表失败'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    data,
    isLoading,
    isError,
    error,
    refresh: fetchCategories,
  }
}

// ===========================================
// useCategory Hook
// ===========================================

/**
 * 获取单个分类详情
 *
 * @param idOrSlug 分类 ID 或 slug
 * @returns 分类详情数据和状态
 *
 * @example
 * ```tsx
 * const { data: category, isLoading } = useCategory('technology')
 * ```
 */
export function useCategory(idOrSlug: string): UseCategoryReturn {
  const [data, setData] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCategory = useCallback(async () => {
    if (!idOrSlug) {
      setData(null)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      // 判断是 ID 还是 slug
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)
      const filterField = isUUID ? 'id' : 'slug'

      const { data: category, error: queryError } = await postgrest
        .from('categories')
        .select('*')
        .eq(filterField, idOrSlug)
        .single()

      if (queryError) {
        throw new Error(queryError.message)
      }

      if (!category) {
        throw new Error('分类不存在')
      }

      setData(toCategory(category as DbCategory))
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('获取分类详情失败'))
    } finally {
      setIsLoading(false)
    }
  }, [idOrSlug])

  useEffect(() => {
    fetchCategory()
  }, [fetchCategory])

  return {
    data,
    isLoading,
    isError,
    error,
    refresh: fetchCategory,
  }
}

// ===========================================
// useCategoriesWithPostCount Hook
// ===========================================

/**
 * 分类及其文章数量
 */
export interface CategoryWithPostCount extends Category {
  postCount: number
}

/**
 * 带文章数量的分类列表 Hook 返回类型
 */
export interface UseCategoriesWithPostCountReturn extends DataState<CategoryWithPostCount[]> {
  /** 刷新数据 */
  refresh: () => Promise<void>
}

/**
 * 获取分类列表及其文章数量
 *
 * @returns 带文章数量的分类列表数据和状态
 *
 * @example
 * ```tsx
 * const { data: categories, isLoading } = useCategoriesWithPostCount()
 * // categories[0].postCount
 * ```
 */
export function useCategoriesWithPostCount(): UseCategoriesWithPostCountReturn {
  const [data, setData] = useState<CategoryWithPostCount[] | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setIsError(false)
    setError(null)

    try {
      // 获取所有分类
      const { data: categories, error: categoriesError } = await postgrest
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (categoriesError) {
        throw new Error(categoriesError.message)
      }

      // 获取每个分类的文章数量
      const categoriesWithCount = await Promise.all(
        (categories as DbCategory[]).map(async (category) => {
          const { count } = await postgrest
            .from('posts')
            .select('*', { count: 'exact', head: true })
            .eq('category_id', category.id)
            .eq('status', 'PUBLISHED')

          return {
            ...toCategory(category),
            postCount: count ?? 0,
          }
        })
      )

      setData(categoriesWithCount)
    } catch (err) {
      setIsError(true)
      setError(err instanceof Error ? err : new Error('获取分类列表失败'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    data,
    isLoading,
    isError,
    error,
    refresh: fetchCategories,
  }
}