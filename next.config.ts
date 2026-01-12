import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // 启用 standalone 输出模式（Docker 部署必需）
  output: 'standalone',

  // 启用严格模式
  reactStrictMode: true,

  // 启用类型化路由（已从 experimental 移出成为稳定功能）
  typedRoutes: true,

  // 图片优化配置
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig