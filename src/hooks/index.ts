// ===========================================
// Hooks 导出
// 统一导出所有 Client 端数据获取 Hooks
// ===========================================

// ===========================================
// 文章相关 Hooks
// ===========================================

export {
  usePosts,
  usePost,
  type UsePostsOptions,
  type UsePostsReturn,
  type UsePostReturn,
} from './use-posts'

// ===========================================
// 分类相关 Hooks
// ===========================================

export {
  useCategories,
  useCategory,
  useCategoriesWithPostCount,
  type UseCategoriesReturn,
  type UseCategoryReturn,
  type CategoryWithPostCount,
  type UseCategoriesWithPostCountReturn,
} from './use-categories'