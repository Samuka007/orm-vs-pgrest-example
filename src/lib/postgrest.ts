// ===========================================
// PostgREST 客户端配置
// 用于 Client 端直接访问 PostgREST API
// 使用 Supabase CLI 生成的类型定义
// ===========================================

import { PostgrestClient } from '@supabase/postgrest-js'
import type { Database, Tables } from '@/types/database'

/**
 * PostgREST API 地址
 * 从环境变量读取，默认为 http://localhost:3001
 */
const POSTGREST_URL = process.env.NEXT_PUBLIC_POSTGREST_URL ?? 'http://localhost:3001'

/**
 * 类型化的 PostgREST 客户端实例
 * 使用自动生成的数据库类型
 */
export const postgrest = new PostgrestClient<Database['public']['Tables']>(POSTGREST_URL)

/**
 * 默认分页大小
 */
export const DEFAULT_PAGE_SIZE = 10

/**
 * 计算分页范围
 * @param page 页码（从 1 开始）
 * @param pageSize 每页数量
 * @returns [起始索引, 结束索引]
 */
export function getPaginationRange(page: number, pageSize: number = DEFAULT_PAGE_SIZE): [number, number] {
  const start = (page - 1) * pageSize
  const end = start + pageSize - 1
  return [start, end]
}

// ===========================================
// 类型别名导出（方便使用）
// ===========================================

/** 数据库 Post 行类型 */
export type DbPost = Tables<'posts'>
/** 数据库 User 行类型 */
export type DbUser = Tables<'users'>
/** 数据库 Category 行类型 */
export type DbCategory = Tables<'categories'>
/** 数据库 Tag 行类型 */
export type DbTag = Tables<'tags'>
/** 数据库 Comment 行类型 */
export type DbComment = Tables<'comments'>
/** 数据库 PostTag 行类型 */
export type DbPostTag = Tables<'post_tags'>

/** 用户简要信息（用于嵌入查询） */
export type DbUserBrief = Pick<DbUser, 'id' | 'name' | 'avatar_url'>

/** 带作者的文章（嵌入查询结果） */
export type DbPostWithAuthor = DbPost & {
  author: DbUserBrief
}

/** 带完整关联的文章（嵌入查询结果） */
export type DbPostWithRelations = DbPost & {
  author: DbUserBrief
  category: DbCategory | null
  tags: Array<{ tag: DbTag }>
}