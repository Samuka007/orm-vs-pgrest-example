// ===========================================
// PostgREST 类型定义
// 此文件已被简化，大部分类型现在由 Supabase CLI 自动生成
// 参见: src/types/database.ts
// ===========================================

// 重新导出自动生成的类型
export type { Database, Tables, TablesInsert, TablesUpdate, Enums } from './database'

// ===========================================
// 查询参数类型（这些是应用层类型，不是数据库类型）
// ===========================================

import type { PostStatus } from './index'

/**
 * PostgREST 排序方向
 */
export type SortOrder = 'asc' | 'desc'

/**
 * PostgREST 文章排序字段
 */
export type PostSortField = 'published_at' | 'view_count' | 'title' | 'created_at'

/**
 * PostgREST 文章查询选项
 */
export interface PostgRESTPostQueryOptions {
  page?: number
  pageSize?: number
  status?: PostStatus
  categoryId?: string
  tagId?: string
  authorId?: string
  search?: string
  orderBy?: PostSortField
  order?: SortOrder
}

/**
 * PostgREST 评论查询选项
 */
export interface PostgRESTCommentQueryOptions {
  page?: number
  pageSize?: number
  parentId?: string | null
}