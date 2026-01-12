// ===========================================
// Server 端统计数据获取函数
// 使用 Prisma ORM 直接查询数据库
// ===========================================

import { prisma } from '@/lib/prisma'
import type { PostWithRelations } from '@/types'

/**
 * 文章统计数据
 */
export interface PostStats {
  totalPosts: number
  publishedPosts: number
  draftPosts: number
  archivedPosts: number
  totalViews: number
  totalComments: number
  totalCategories: number
  totalTags: number
}

/**
 * 热门文章（带评论数）
 */
export interface PopularPost extends PostWithRelations {
  _count: {
    comments: number
  }
}

/**
 * 获取热门文章（按评论数排序）
 */
export async function getPopularPosts(limit: number = 5): Promise<PopularPost[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      comments: {
        _count: 'desc',
      },
    },
    take: limit,
  })

  return posts as PopularPost[]
}

/**
 * 获取最新文章
 */
export async function getRecentPosts(
  limit: number = 5
): Promise<PostWithRelations[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      publishedAt: 'desc',
    },
    take: limit,
  })

  return posts as PostWithRelations[]
}

/**
 * 获取浏览量最高的文章
 */
export async function getMostViewedPosts(
  limit: number = 5
): Promise<PostWithRelations[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
    orderBy: {
      viewCount: 'desc',
    },
    take: limit,
  })

  return posts as PostWithRelations[]
}

/**
 * 获取文章统计数据
 */
export async function getPostStats(): Promise<PostStats> {
  const [
    totalPosts,
    publishedPosts,
    draftPosts,
    archivedPosts,
    viewsResult,
    totalComments,
    totalCategories,
    totalTags,
  ] = await Promise.all([
    // 总文章数
    prisma.post.count(),
    // 已发布文章数
    prisma.post.count({
      where: { status: 'PUBLISHED' },
    }),
    // 草稿文章数
    prisma.post.count({
      where: { status: 'DRAFT' },
    }),
    // 已归档文章数
    prisma.post.count({
      where: { status: 'ARCHIVED' },
    }),
    // 总浏览量
    prisma.post.aggregate({
      _sum: {
        viewCount: true,
      },
    }),
    // 总评论数
    prisma.comment.count(),
    // 总分类数
    prisma.category.count(),
    // 总标签数
    prisma.tag.count(),
  ])

  return {
    totalPosts,
    publishedPosts,
    draftPosts,
    archivedPosts,
    totalViews: viewsResult._sum.viewCount ?? 0,
    totalComments,
    totalCategories,
    totalTags,
  }
}