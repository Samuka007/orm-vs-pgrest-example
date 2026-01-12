// ===========================================
// 文章列表页面
// 支持分页和分类过滤
// ===========================================

import { getPosts } from '@/lib/server'
import { getCategoryBySlug } from '@/lib/server'
import { PostList } from '@/components/ui/PostList'
import { Pagination } from '@/components/ui/Pagination'

interface PostsPageProps {
  searchParams: Promise<{
    page?: string
    category?: string
  }>
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '1', 10)
  const categorySlug = params.category

  // 获取分类信息（如果有过滤）
  const category = categorySlug ? await getCategoryBySlug(categorySlug) : null

  // 获取文章列表
  const { data: posts, totalPages, total } = await getPosts({
    page,
    pageSize: 9,
    categorySlug,
    status: 'PUBLISHED',
    orderBy: 'publishedAt',
    order: 'desc',
  })

  // 构建搜索参数（用于分页链接）
  const searchParamsObj: Record<string, string> = {}
  if (categorySlug) {
    searchParamsObj.category = categorySlug
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {category ? `${category.name} 分类文章` : '全部文章'}
        </h1>
        <p className="mt-1 text-gray-600">
          共 {total} 篇文章
          {category && (
            <span className="ml-2">
              <a
                href="/server/posts"
                className="text-blue-600 hover:text-blue-800"
              >
                查看全部 →
              </a>
            </span>
          )}
        </p>
      </div>

      {/* 文章列表 */}
      <PostList
        posts={posts}
        linkPrefix="/server"
        emptyText={category ? `${category.name} 分类下暂无文章` : '暂无文章'}
      />

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            baseUrl="/server/posts"
            searchParams={searchParamsObj}
          />
        </div>
      )}
    </div>
  )
}