'use client'

// ===========================================
// 加载骨架屏组件
// 用于显示加载状态
// ===========================================

import React from 'react'

interface SkeletonProps {
  className?: string
}

/**
 * 基础骨架屏元素
 */
function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
    />
  )
}

/**
 * 文章卡片骨架屏
 */
export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/30 overflow-hidden">
      {/* 封面图片骨架 */}
      <Skeleton className="aspect-video" />

      <div className="p-6">
        {/* 分类和标签骨架 */}
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
        </div>

        {/* 标题骨架 */}
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />

        {/* 摘要骨架 */}
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3 mb-4" />

        {/* 元信息骨架 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  )
}

/**
 * 文章列表骨架屏
 */
export function PostListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <PostCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * 文章详情骨架屏
 */
export function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* 返回链接骨架 */}
      <Skeleton className="h-4 w-24 mb-6" />

      {/* 文章头部骨架 */}
      <div className="mb-8">
        {/* 分类和标签 */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-14" />
        </div>

        {/* 标题 */}
        <Skeleton className="h-10 w-full mb-2" />
        <Skeleton className="h-10 w-3/4 mb-4" />

        {/* 元信息 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>

      {/* 封面图片骨架 */}
      <Skeleton className="aspect-video mb-8 rounded-lg" />

      {/* 内容骨架 */}
      <div className="space-y-4 mb-12">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* 分隔线 */}
      <Skeleton className="h-px w-full my-8" />

      {/* 评论区骨架 */}
      <div>
        <Skeleton className="h-6 w-32 mb-6" />
        <CommentListSkeleton count={3} />
      </div>
    </div>
  )
}

/**
 * 分类卡片骨架屏
 */
export function CategoryCardSkeleton() {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30">
      <Skeleton className="h-5 w-24 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-16" />
    </div>
  )
}

/**
 * 分类列表骨架屏
 */
export function CategoryListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * 评论项骨架屏
 */
export function CommentItemSkeleton() {
  return (
    <div className="flex gap-3">
      <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  )
}

/**
 * 评论列表骨架屏
 */
export function CommentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, index) => (
        <CommentItemSkeleton key={index} />
      ))}
    </div>
  )
}

/**
 * 统计卡片骨架屏
 */
export function StatsCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm dark:shadow-gray-900/30 p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-4 w-16 mb-2" />
          <Skeleton className="h-8 w-24" />
        </div>
        <Skeleton className="w-12 h-12 rounded-full" />
      </div>
      <Skeleton className="h-3 w-20 mt-2" />
    </div>
  )
}

/**
 * 统计网格骨架屏
 */
export function StatsGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <StatsCardSkeleton key={index} />
      ))}
    </div>
  )
}

// 导出基础骨架组件
export { Skeleton }