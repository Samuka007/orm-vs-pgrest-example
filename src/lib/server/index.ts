// ===========================================
// Server 端数据获取函数导出
// 统一导出所有服务端函数
// ===========================================

// 文章相关
export {
  getPosts,
  getPost,
  getPostBySlug,
  incrementViewCount,
} from './posts'

// 分类相关
export {
  getCategories,
  getCategoriesWithPostCount,
  getCategoryBySlug,
  getCategory,
} from './categories'
export type { CategoryWithPostCount } from './categories'