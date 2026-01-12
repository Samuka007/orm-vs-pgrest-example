# 开发指南

本文档介绍如何设置开发环境、项目结构说明、代码规范和调试技巧。

## 目录

- [开发环境设置](#开发环境设置)
- [项目结构说明](#项目结构说明)
- [代码规范](#代码规范)
- [调试技巧](#调试技巧)
- [常用命令](#常用命令)

---

## 开发环境设置

### 方式一：使用 Nix（推荐）

项目使用 Nix Flake 管理开发环境，确保所有开发者使用相同的工具版本。

1. **安装 Nix**
   ```bash
   # Linux/macOS
   curl -L https://nixos.org/nix/install | sh
   
   # 启用 Flakes
   echo "experimental-features = nix-command flakes" >> ~/.config/nix/nix.conf
   ```

2. **安装 direnv（可选但推荐）**
   ```bash
   # macOS
   brew install direnv
   
   # Linux
   nix profile install nixpkgs#direnv
   
   # 添加到 shell 配置
   echo 'eval "$(direnv hook bash)"' >> ~/.bashrc
   # 或 zsh
   echo 'eval "$(direnv hook zsh)"' >> ~/.zshrc
   ```

3. **进入开发环境**
   ```bash
   cd db-frontend-example
   
   # 使用 direnv（自动加载）
   direnv allow
   
   # 或手动进入
   nix develop
   ```

### 方式二：手动安装

1. **安装 Node.js**
   ```bash
   # 使用 nvm
   nvm install 22
   nvm use 22
   
   # 或使用 fnm
   fnm install 22
   fnm use 22
   ```

2. **安装 pnpm**
   ```bash
   npm install -g pnpm@9
   ```

3. **安装 Docker**
   - [Docker Desktop](https://www.docker.com/products/docker-desktop/)（macOS/Windows）
   - [Docker Engine](https://docs.docker.com/engine/install/)（Linux）

### 项目初始化

```bash
# 1. 克隆项目
git clone <repository-url>
cd db-frontend-example

# 2. 安装依赖
pnpm install

# 3. 配置环境变量
cp .env.example .env

# 4. 启动数据库服务
pnpm db:up

# 5. 初始化数据库
pnpm db:push
pnpm db:grant
pnpm db:seed

# 6. 启动开发服务器
pnpm dev
```

### 环境变量说明

```env
# .env

# 数据库连接字符串（Prisma 使用）
DATABASE_URL="postgres://postgres:postgres@localhost:5432/blog_db"

# PostgREST API 地址（Client 端使用）
# 注意：必须使用 NEXT_PUBLIC_ 前缀才能在客户端访问
NEXT_PUBLIC_POSTGREST_URL="http://localhost:3001"

# Next.js 应用地址
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 项目结构说明

### 目录结构

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # 根布局
│   ├── page.tsx              # 首页
│   ├── globals.css           # 全局样式
│   │
│   ├── (client)/             # Client 端方案路由组
│   │   └── client/
│   │       ├── layout.tsx    # Client 布局
│   │       ├── page.tsx      # Client 首页
│   │       ├── posts/        # 文章相关页面
│   │       └── categories/   # 分类相关页面
│   │
│   ├── (server)/             # Server 端方案路由组
│   │   └── server/
│   │       ├── layout.tsx    # Server 布局
│   │       ├── page.tsx      # Server 首页
│   │       ├── posts/        # 文章相关页面
│   │       └── categories/   # 分类相关页面
│   │
│   └── compare/              # 对比展示页面
│
├── components/
│   ├── ui/                   # 基础 UI 组件（共享）
│   ├── client/               # Client 端专用组件
│   └── compare/              # 对比展示组件
│
├── lib/
│   ├── prisma.ts             # Prisma 客户端单例
│   ├── postgrest.ts          # PostgREST 客户端配置
│   └── server/               # Server 端数据获取函数
│
├── hooks/                    # 自定义 Hooks（Client 端）
│
└── types/                    # TypeScript 类型定义
```

### 路由组设计

使用 Next.js 的路由组 `(client)` 和 `(server)` 来分离两种方案：

```
URL 路径                    文件路径
/client                 → app/(client)/client/page.tsx
/client/posts           → app/(client)/client/posts/page.tsx
/client/posts/[id]      → app/(client)/client/posts/[id]/page.tsx

/server                 → app/(server)/server/page.tsx
/server/posts           → app/(server)/server/posts/page.tsx
/server/posts/[id]      → app/(server)/server/posts/[id]/page.tsx
```

### 组件分类

#### 1. UI 组件（`components/ui/`）

纯展示组件，不包含业务逻辑，两种方案共享。

```typescript
// components/ui/PostCard.tsx
interface PostCardProps {
  title: string
  excerpt: string
  author: { name: string; avatarUrl: string | null }
  publishedAt: Date
  href: string
}

export function PostCard({ title, excerpt, author, publishedAt, href }: PostCardProps) {
  return (
    <article className="border rounded-lg p-4">
      {/* 纯展示逻辑 */}
    </article>
  )
}
```

#### 2. Client 组件（`components/client/`）

包含客户端状态和数据获取逻辑。

```typescript
// components/client/PostListClient.tsx
'use client'

import { usePosts } from '@/hooks/use-posts'
import { PostCard } from '@/components/ui/PostCard'

export function PostListClient() {
  const { data, loading, error } = usePosts()
  
  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} />
  
  return (
    <div className="grid gap-4">
      {data?.data.map(post => (
        <PostCard key={post.id} {...post} href={`/client/posts/${post.id}`} />
      ))}
    </div>
  )
}
```

#### 3. Server 组件（页面文件）

直接在 Server Component 中获取数据。

```typescript
// app/(server)/server/posts/page.tsx
import { getPosts } from '@/lib/server/posts'
import { PostCard } from '@/components/ui/PostCard'

export default async function ServerPostsPage() {
  const { data: posts } = await getPosts()
  
  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <PostCard key={post.id} {...post} href={`/server/posts/${post.id}`} />
      ))}
    </div>
  )
}
```

---

## 代码规范

### TypeScript 规范

#### 1. 类型定义

```typescript
// ✅ 使用 interface 定义对象类型
interface User {
  id: string
  name: string
  email: string
}

// ✅ 使用 type 定义联合类型或工具类型
type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
type UserBrief = Pick<User, 'id' | 'name'>

// ❌ 避免使用 any
const data: any = fetchData()

// ✅ 使用 unknown 并进行类型检查
const data: unknown = fetchData()
if (isUser(data)) {
  console.log(data.name)
}
```

#### 2. 函数类型

```typescript
// ✅ 明确参数和返回类型
async function getPosts(page: number, pageSize: number): Promise<PaginatedResult<Post>> {
  // ...
}

// ✅ 使用泛型提高复用性
function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResult<T> {
  // ...
}
```

### React 规范

#### 1. 组件命名

```typescript
// ✅ 使用 PascalCase
export function PostCard() {}
export function UserAvatar() {}

// ✅ 文件名与组件名一致
// PostCard.tsx → export function PostCard()
```

#### 2. Hooks 使用

```typescript
// ✅ 自定义 Hook 以 use 开头
function usePosts() {}
function useComments(postId: string) {}

// ✅ 依赖数组完整
useEffect(() => {
  fetchPosts(page, pageSize)
}, [page, pageSize]) // 包含所有依赖

// ❌ 避免在条件语句中使用 Hook
if (condition) {
  const [state, setState] = useState() // 错误
}
```

#### 3. 组件结构

```typescript
// 推荐的组件结构
'use client' // 如果需要

import { useState, useEffect } from 'react'
import { SomeComponent } from '@/components/ui'
import type { SomeType } from '@/types'

interface Props {
  // props 类型定义
}

export function MyComponent({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState()
  
  // 2. 派生状态
  const derivedValue = useMemo(() => {}, [])
  
  // 3. 副作用
  useEffect(() => {}, [])
  
  // 4. 事件处理函数
  const handleClick = () => {}
  
  // 5. 渲染
  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

### 文件组织规范

#### 1. 导入顺序

```typescript
// 1. React 相关
import { useState, useEffect } from 'react'

// 2. 第三方库
import { PostgrestClient } from '@supabase/postgrest-js'

// 3. 内部模块（绝对路径）
import { PostCard } from '@/components/ui'
import { usePosts } from '@/hooks/use-posts'
import type { Post } from '@/types'

// 4. 相对路径导入
import { helper } from './utils'

// 5. 样式
import styles from './styles.module.css'
```

#### 2. 导出规范

```typescript
// 组件文件：默认导出组件
export function PostCard() {}
export default PostCard

// 工具文件：命名导出
export function formatDate() {}
export function formatNumber() {}

// 类型文件：命名导出
export interface User {}
export type PostStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

// index.ts：重新导出
export { PostCard } from './PostCard'
export { UserAvatar } from './UserAvatar'
```

---

## 调试技巧

### 1. Prisma 调试

#### 查看生成的 SQL

```typescript
// 在 prisma.ts 中启用日志
export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})
```

#### 使用 Prisma Studio

```bash
pnpm db:studio
```

这将在 http://localhost:5555 打开一个可视化数据库管理界面。

### 2. PostgREST 调试

#### 查看 API 响应

```bash
# 使用 curl 测试
curl http://localhost:3001/posts

# 使用 httpie（更友好的输出）
http http://localhost:3001/posts

# 查看请求头
http -v http://localhost:3001/posts
```

#### 查看 OpenAPI 文档

访问 http://localhost:3001/ 可以看到 PostgREST 自动生成的 OpenAPI 文档。

### 3. Next.js 调试

#### Server Component 调试

```typescript
// 在 Server Component 中使用 console.log
// 输出会显示在终端（服务器端）
export default async function Page() {
  const data = await fetchData()
  console.log('Server data:', data) // 终端输出
  return <div>{/* ... */}</div>
}
```

#### Client Component 调试

```typescript
'use client'

export function ClientComponent() {
  const [data, setData] = useState()
  
  useEffect(() => {
    console.log('Client data:', data) // 浏览器控制台输出
  }, [data])
  
  return <div>{/* ... */}</div>
}
```

#### React DevTools

安装 [React Developer Tools](https://react.dev/learn/react-developer-tools) 浏览器扩展，可以：
- 查看组件树
- 检查 props 和 state
- 分析性能

### 4. 数据库调试

#### 连接数据库

```bash
# 使用 psql
docker exec -it blog_postgres psql -U postgres -d blog_db

# 常用命令
\dt          # 列出所有表
\d posts     # 查看表结构
SELECT * FROM posts LIMIT 5;  # 查询数据
```

#### 查看 Docker 日志

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs postgres
docker-compose logs postgrest

# 实时查看日志
docker-compose logs -f
```

### 5. 网络请求调试

#### 浏览器 DevTools

1. 打开 DevTools（F12）
2. 切换到 Network 标签
3. 筛选 Fetch/XHR 请求
4. 查看请求详情、响应数据、时间线

#### 使用 React Query DevTools（如果使用）

```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

function App() {
  return (
    <>
      {/* 应用内容 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  )
}
```

---

## 常用命令

### 开发命令

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 类型检查
pnpm tsc --noEmit
```

### 数据库命令

```bash
# 启动 Docker 服务（PostgreSQL + PostgREST）
pnpm db:up

# 停止 Docker 服务
pnpm db:down

# 推送 Prisma schema 到数据库（开发用）
pnpm db:push

# 创建数据库迁移（生产用）
pnpm db:migrate

# 填充种子数据
pnpm db:seed

# 打开 Prisma Studio
pnpm db:studio

# 重新生成 Prisma 客户端
pnpm db:generate

# 授予 PostgREST 访问权限
pnpm db:grant
```

### Docker 命令

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 查看容器日志
docker logs blog_postgres
docker logs blog_postgrest

# 进入容器
docker exec -it blog_postgres bash

# 重启服务
docker-compose restart

# 完全重建
docker-compose down -v  # 删除数据卷
docker-compose up -d
```

### Git 命令

```bash
# 创建功能分支
git checkout -b feature/my-feature

# 提交更改
git add .
git commit -m "feat: add new feature"

# 推送分支
git push origin feature/my-feature

# 合并到主分支
git checkout main
git merge feature/my-feature
```

### 调试命令

```bash
# 检查端口占用
lsof -i :3000
lsof -i :3001
lsof -i :5432

# 测试 PostgREST API
curl http://localhost:3001/posts
curl http://localhost:3001/categories

# 测试数据库连接
docker exec blog_postgres pg_isready -U postgres

# 查看环境变量
printenv | grep DATABASE
printenv | grep POSTGREST
```

---

## 故障排除

### 常见问题

#### 1. `pnpm install` 失败

```bash
# 清除缓存重试
pnpm store prune
rm -rf node_modules
pnpm install
```

#### 2. Prisma 生成失败

```bash
# 确保数据库正在运行
pnpm db:up

# 重新生成
pnpm db:generate
```

#### 3. PostgREST 返回 401/403

```bash
# 重新授予权限
pnpm db:grant

# 检查角色配置
docker exec blog_postgres psql -U postgres -d blog_db -c "\du"
```

#### 4. 热重载不工作

```bash
# 删除 .next 缓存
rm -rf .next

# 重启开发服务器
pnpm dev
```

#### 5. TypeScript 类型错误

```bash
# 重启 TypeScript 服务器（VS Code）
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"

# 或重新生成 Prisma 类型
pnpm db:generate