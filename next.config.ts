import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 启用严格模式
  reactStrictMode: true,

  // 实验性功能
  experimental: {
    // 启用 TypeScript 插件
    typedRoutes: true,
  },

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
}

export default nextConfig