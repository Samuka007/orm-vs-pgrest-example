'use client'

import { useState } from 'react'

// 代码示例数据
const codeExamples = [
  {
    id: 'posts-list',
    title: '文章列表查询',
    description: '获取已发布文章列表，包含作者信息和分页',
    client: `// Client 端 - 使用 PostgREST
import { postgrest } from '@/lib/postgrest'

export function usePosts(page: number, pageSize: number = 10) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)
      const { data, count } = await postgrest
        .from('posts')
        .select('*, author:users(id, name, avatar_url)', { count: 'exact' })
        .eq('status', 'PUBLISHED')
        .order('published_at', { ascending: false })
        .range((page - 1) * pageSize, page * pageSize - 1)
      
      setPosts(data ?? [])
      setTotal(count ?? 0)
      setLoading(false)
    }
    fetchPosts()
  }, [page, pageSize])

  return { posts, loading, total }
}`,
    server: `// Server 端 - 使用 Prisma ORM
import { prisma } from '@/lib/prisma'

export async function getPosts(page: number, pageSize: number = 10) {
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: { select: { id: true, name: true, avatarUrl: true } },
      },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
  ])

  return { posts, total }
}`,
  },
  {
    id: 'post-detail',
    title: '文章详情查询',
    description: '获取单篇文章详情，包含作者、分类和标签',
    client: `// Client 端 - 使用 PostgREST 嵌入查询
const { data: post } = await postgrest
  .from('posts')
  .select(\`
    *,
    author:users(id, name, avatar_url, bio),
    category:categories(id, name, slug),
    tags:post_tags(tag:tags(id, name, slug, color))
  \`)
  .eq('slug', slug)
  .single()`,
    server: `// Server 端 - 使用 Prisma include
const post = await prisma.post.findUnique({
  where: { slug },
  include: {
    author: true,
    category: true,
    tags: {
      include: { tag: true }
    }
  }
})`,
  },
  {
    id: 'comments',
    title: '评论加载与添加',
    description: '加载评论列表并支持添加新评论',
    client: `// Client 端 - 支持乐观更新
export function useComments(postId: string) {
  const [comments, setComments] = useState([])
  
  const loadComments = async () => {
    const { data } = await postgrest
      .from('comments')
      .select('*, author:users(id, name, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true })
    setComments(data ?? [])
  }

  // 乐观更新：添加评论
  const addComment = async (content: string, authorId: string) => {
    const optimisticComment = {
      id: crypto.randomUUID(),
      content,
      author_id: authorId,
      post_id: postId,
      created_at: new Date().toISOString(),
    }
    
    // 立即更新 UI
    setComments(prev => [...prev, optimisticComment])
    
    // 后台同步
    await postgrest.from('comments').insert({
      content,
      author_id: authorId,
      post_id: postId,
    })
  }

  return { comments, addComment, refresh: loadComments }
}`,
    server: `// Server 端 - 使用 Server Action
'use server'

export async function getComments(postId: string) {
  return prisma.comment.findMany({
    where: { postId },
    include: { author: true },
    orderBy: { createdAt: 'asc' }
  })
}

export async function addComment(
  postId: string, 
  content: string, 
  authorId: string
) {
  await prisma.comment.create({
    data: { postId, content, authorId }
  })
  revalidatePath(\`/server/posts/\${postId}\`)
}`,
  },
  {
    id: 'stats',
    title: '统计聚合查询',
    description: '获取文章统计数据和分类统计',
    client: `// Client 端 - 聚合能力有限
// 需要创建数据库视图或在客户端计算
const { data } = await postgrest
  .from('posts')
  .select('category:categories(name), view_count')
  .eq('status', 'PUBLISHED')

// 客户端聚合（仅适用于小数据量）
const stats = data?.reduce((acc, post) => {
  const cat = post.category?.name ?? 'Uncategorized'
  acc[cat] = (acc[cat] ?? 0) + post.view_count
  return acc
}, {})`,
    server: `// Server 端 - 强大的聚合能力
const popularPosts = await prisma.post.findMany({
  where: { status: 'PUBLISHED' },
  orderBy: { viewCount: 'desc' },
  take: 10,
  include: {
    author: { select: { name: true } },
    _count: { select: { comments: true } }
  }
})

// 分类统计
const categoryStats = await prisma.post.groupBy({
  by: ['categoryId'],
  where: { status: 'PUBLISHED' },
  _count: { id: true },
  _sum: { viewCount: true },
  orderBy: { _sum: { viewCount: 'desc' } }
})`,
  },
]

export function CodeComparison() {
  const [activeExample, setActiveExample] = useState(codeExamples[0].id)

  const currentExample = codeExamples.find((e) => e.id === activeExample) || codeExamples[0]

  return (
    <div className="space-y-6">
      {/* 示例选择器 */}
      <div className="flex flex-wrap gap-2">
        {codeExamples.map((example) => (
          <button
            key={example.id}
            onClick={() => setActiveExample(example.id)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeExample === example.id
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>

      {/* 示例描述 */}
      <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
        <h3 className="font-semibold text-gray-900 dark:text-white">{currentExample.title}</h3>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{currentExample.description}</p>
      </div>

      {/* 代码对比 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client 端代码 */}
        <div className="overflow-hidden rounded-2xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 border-b border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-800 dark:bg-blue-950">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            <span className="font-medium text-blue-900 dark:text-blue-100">Client 端 (PostgREST)</span>
          </div>
          <div className="overflow-x-auto bg-gray-900 p-4">
            <pre className="text-sm text-gray-300">
              <code>{currentExample.client}</code>
            </pre>
          </div>
        </div>

        {/* Server 端代码 */}
        <div className="overflow-hidden rounded-2xl border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2 border-b border-purple-200 bg-purple-50 px-4 py-3 dark:border-purple-800 dark:bg-purple-950">
            <svg className="h-5 w-5 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
            <span className="font-medium text-purple-900 dark:text-purple-100">Server 端 (Prisma)</span>
          </div>
          <div className="overflow-x-auto bg-gray-900 p-4">
            <pre className="text-sm text-gray-300">
              <code>{currentExample.server}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* 代码对比说明 */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
          <h4 className="font-medium text-blue-900 dark:text-blue-100">Client 端特点</h4>
          <ul className="mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
            <li>• 使用字符串模板定义查询</li>
            <li>• 需要手动管理加载状态</li>
            <li>• 支持乐观更新</li>
            <li>• 类型需要手动定义</li>
          </ul>
        </div>
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-950">
          <h4 className="font-medium text-purple-900 dark:text-purple-100">Server 端特点</h4>
          <ul className="mt-2 space-y-1 text-sm text-purple-800 dark:text-purple-200">
            <li>• 类型安全的 API 调用</li>
            <li>• 自动类型推断</li>
            <li>• 更简洁的代码结构</li>
            <li>• 强大的聚合查询能力</li>
          </ul>
        </div>
      </div>
    </div>
  )
}