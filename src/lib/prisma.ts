import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

// 声明全局类型以避免 TypeScript 错误
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
  pool: Pool | undefined
}

// 创建连接池
const pool = globalForPrisma.pool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
})

// 创建 Prisma adapter
const adapter = new PrismaPg(pool)

// 创建 Prisma 客户端单例
// 在开发环境中，由于热重载，我们需要将客户端存储在全局对象中
// 以避免创建多个连接
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

// 在非生产环境中，将客户端存储在全局对象中
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.pool = pool
}

// 导出默认客户端
export default prisma