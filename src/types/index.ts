// ===========================================
// 共享类型定义
// 用于 Client 端和 Server 端的类型一致性
// ===========================================

// ===========================================
// 枚举类型
// ===========================================

/**
 * 文章状态枚举
 */
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

// ===========================================
// 基础实体类型
// ===========================================

/**
 * 用户类型
 */
export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  bio: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * 分类类型
 */
export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  sortOrder: number
}

/**
 * 标签类型
 */
export interface Tag {
  id: string
  name: string
  slug: string
  color: string | null
}

/**
 * 文章类型
 */
export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  coverImage: string | null
  status: PostStatus
  authorId: string
  categoryId: string | null
  viewCount: number
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

/**
 * 评论类型
 */
export interface Comment {
  id: string
  content: string
  postId: string
  authorId: string
  parentId: string | null
  createdAt: Date
  updatedAt: Date
}

/**
 * 文章-标签关联类型
 */
export interface PostTag {
  postId: string
  tagId: string
}

// ===========================================
// 关联类型（包含关联数据）
// ===========================================

/**
 * 用户简要信息（用于关联查询）
 */
export type UserBrief = Pick<User, 'id' | 'name' | 'avatarUrl'>

/**
 * 带作者信息的文章
 */
export interface PostWithAuthor extends Post {
  author: UserBrief
}

/**
 * 带完整关联的文章
 */
export interface PostWithRelations extends Post {
  author: UserBrief
  category: Category | null
  tags: Array<{ tag: Tag }>
}

/**
 * 带作者信息的评论
 */
export interface CommentWithAuthor extends Comment {
  author: UserBrief
}

/**
 * 带回复的评论（嵌套评论）
 */
export interface CommentWithReplies extends CommentWithAuthor {
  replies: CommentWithAuthor[]
}

// ===========================================
// 分页类型
// ===========================================

/**
 * 分页结果
 */
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

/**
 * 分页参数
 */
export interface PaginationParams {
  page?: number
  pageSize?: number
}

// ===========================================
// 查询参数类型
// ===========================================

/**
 * 文章查询参数
 */
export interface PostQueryParams extends PaginationParams {
  status?: PostStatus
  categorySlug?: string
  tagSlug?: string
  authorId?: string
  search?: string
  orderBy?: 'publishedAt' | 'viewCount' | 'title' | 'createdAt'
  order?: 'asc' | 'desc'
}

/**
 * 评论查询参数
 */
export interface CommentQueryParams extends PaginationParams {
  postId: string
  parentId?: string | null
}

// ===========================================
// API 响应类型
// ===========================================

/**
 * API 成功响应
 */
export interface ApiSuccessResponse<T> {
  success: true
  data: T
}

/**
 * API 错误响应
 */
export interface ApiErrorResponse {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

/**
 * API 响应（联合类型）
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse

// ===========================================
// 统计类型
// ===========================================

/**
 * 分类统计
 */
export interface CategoryStats {
  categoryId: string
  categoryName: string
  postCount: number
  totalViews: number
}

/**
 * 标签统计
 */
export interface TagStats {
  tagId: string
  tagName: string
  tagSlug: string
  postCount: number
}

/**
 * 作者统计
 */
export interface AuthorStats {
  authorId: string
  authorName: string
  postCount: number
  totalViews: number
  commentCount: number
}

// ===========================================
// 工具类型
// ===========================================

/**
 * 使某些字段可选
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * 使某些字段必填
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * 创建实体时的输入类型（排除自动生成的字段）
 */
export type CreateInput<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>

/**
 * 更新实体时的输入类型（所有字段可选，排除 id）
 */
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>