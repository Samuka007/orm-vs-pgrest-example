// ===========================================
// Server 端评论数据获取函数
// 使用 Prisma ORM 直接查询数据库
// ===========================================

import { prisma } from '@/lib/prisma'
import type { CommentWithAuthor, CommentWithReplies } from '@/types'

/**
 * 获取文章的评论列表（扁平结构）
 */
export async function getComments(postId: string): Promise<CommentWithAuthor[]> {
  const comments = await prisma.comment.findMany({
    where: {
      postId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return comments as CommentWithAuthor[]
}

/**
 * 获取文章的顶级评论（带回复的嵌套结构）
 */
export async function getCommentsWithReplies(
  postId: string
): Promise<CommentWithReplies[]> {
  // 获取顶级评论（没有 parentId 的评论）
  const topLevelComments = await prisma.comment.findMany({
    where: {
      postId,
      parentId: null,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
      replies: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: {
          createdAt: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return topLevelComments as CommentWithReplies[]
}

/**
 * 获取文章的评论数量
 */
export async function getCommentCount(postId: string): Promise<number> {
  const count = await prisma.comment.count({
    where: {
      postId,
    },
  })

  return count
}

/**
 * 获取单条评论
 */
export async function getComment(id: string): Promise<CommentWithAuthor | null> {
  const comment = await prisma.comment.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  })

  return comment as CommentWithAuthor | null
}