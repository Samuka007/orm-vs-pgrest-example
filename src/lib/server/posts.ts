// ===========================================
// Server 端文章数据获取函数
// 使用 Prisma ORM 直接查询数据库
// ===========================================

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import type {
  PostWithRelations,
  PostQueryParams,
  PaginatedResult,
  PostStatus,
} from '@/types'

/**
 * 获取文章列表（支持分页、过滤、排序）
 */
export async function getPosts(
  options: PostQueryParams = {}
): Promise<PaginatedResult<PostWithRelations>> {
  const {
    page = 1,
    pageSize = 10,
    status = 'PUBLISHED',
    categorySlug,
    tagSlug,
    authorId,
    search,
    orderBy = 'publishedAt',
    order = 'desc',
  } = options

  // 构建查询条件
  const where: Prisma.PostWhereInput = {}

  // 状态过滤
  if (status) {
    where.status = status as PostStatus
  }

  // 分类过滤
  if (categorySlug) {
    where.category = {
      slug: categorySlug,
    }
  }

  // 标签过滤
  if (tagSlug) {
    where.tags = {
      some: {
        tag: {
          slug: tagSlug,
        },
      },
    }
  }

  // 作者过滤
  if (authorId) {
    where.authorId = authorId
  }

  // 搜索过滤
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
      { excerpt: { contains: search, mode: 'insensitive' } },
    ]
  }

  // 构建排序
  const orderByClause: Prisma.PostOrderByWithRelationInput = {
    [orderBy]: order,
  }

  // 执行查询
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
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
      orderBy: orderByClause,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ])

  return {
    data: posts as PostWithRelations[],
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  }
}

/**
 * 获取单篇文章详情（通过 ID）
 */
export async function getPost(id: string): Promise<PostWithRelations | null> {
  const post = await prisma.post.findUnique({
    where: { id },
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
  })

  return post as PostWithRelations | null
}

/**
 * 通过 slug 获取文章
 */
export async function getPostBySlug(
  slug: string
): Promise<PostWithRelations | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
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
  })

  return post as PostWithRelations | null
}

/**
 * 增加文章浏览量
 */
export async function incrementViewCount(id: string): Promise<void> {
  await prisma.post.update({
    where: { id },
    data: {
      viewCount: {
        increment: 1,
      },
    },
  })
}