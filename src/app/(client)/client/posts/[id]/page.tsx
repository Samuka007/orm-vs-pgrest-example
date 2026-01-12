'use client'

// ===========================================
// 文章详情页面
// 显示文章内容、作者、分类、标签和评论
// ===========================================

import { use } from 'react'
import { PostDetailClient } from '@/components/client'

interface PostDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const { id } = use(params)

  return <PostDetailClient postId={id} linkPrefix="/client" />
}