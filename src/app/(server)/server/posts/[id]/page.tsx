// ===========================================
// 文章详情页面
// 显示文章内容、作者、分类、标签和评论
// ===========================================

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, incrementViewCount } from '@/lib/server'
import { getCommentsWithReplies } from '@/lib/server'
import { CategoryBadge } from '@/components/ui/CategoryBadge'
import { CommentList } from '@/components/ui/CommentList'

interface PostDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = await params

  // 获取文章详情
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  // 增加浏览量
  await incrementViewCount(id)

  // 获取评论
  const comments = await getCommentsWithReplies(id)

  /**
   * 格式化日期
   */
  function formatDate(date: Date | null): string {
    if (!date) return '未发布'
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* 返回链接 */}
      <div className="mb-6">
        <Link
          href="/server/posts"
          className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          返回文章列表
        </Link>
      </div>

      {/* 文章头部 */}
      <header className="mb-8">
        {/* 分类和标签 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {post.category && (
            <CategoryBadge category={post.category} linkPrefix="/server" />
          )}
          {post.tags.map(({ tag }) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium"
              style={{
                backgroundColor: tag.color ? `${tag.color}20` : '#e5e7eb',
                color: tag.color || '#374151',
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* 元信息 */}
        <div className="flex items-center gap-4 text-sm text-gray-500">
          {/* 作者 */}
          <div className="flex items-center gap-2">
            {post.author.avatarUrl ? (
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-8 h-8 rounded-full"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm text-gray-600">
                  {post.author.name.charAt(0)}
                </span>
              </div>
            )}
            <span className="font-medium text-gray-700">{post.author.name}</span>
          </div>

          <span>•</span>

          {/* 发布日期 */}
          <span>{formatDate(post.publishedAt)}</span>

          <span>•</span>

          {/* 浏览量 */}
          <span className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {post.viewCount + 1} 次浏览
          </span>
        </div>
      </header>

      {/* 封面图片 */}
      {post.coverImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto"
          />
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose prose-lg max-w-none mb-12">
        {/* 摘要 */}
        {post.excerpt && (
          <p className="text-xl text-gray-600 italic border-l-4 border-blue-500 pl-4 mb-6">
            {post.excerpt}
          </p>
        )}

        {/* 正文内容 */}
        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
          {post.content}
        </div>
      </div>

      {/* 分隔线 */}
      <hr className="my-8 border-gray-200" />

      {/* 评论区 */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          评论 ({comments.length})
        </h2>
        <CommentList comments={comments} emptyText="暂无评论，快来发表第一条评论吧！" />
      </section>
    </article>
  )
}