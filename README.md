# 前端数据库查询对比项目

一个用于比较两种前端数据库查询方式的 Next.js 示例项目。

## 📖 项目简介

本项目旨在比较两种前端获取数据库数据的技术方案：

| 方案 | 数据获取端 | 技术栈 | 渲染方式 |
|------|-----------|--------|---------|
| **Client 端方案** | 浏览器 | `@supabase/postgrest-js` + PostgREST | Client Component |
| **Server 端方案** | Node.js 服务器 | Prisma ORM | Server Component (SSR) |

### 核心特点

- **零 CRUD 接口**：不创建任何 `/api` 端点
- **直接数据访问**：Client 端直接访问 PostgREST，Server 端直接使用 ORM
- **相同数据展示**：两种方案展示相同的博客数据，便于对比

## 🛠 技术栈

### 核心框架
- **Next.js 15** - React 全栈框架（App Router）
- **React 19** - UI 库
- **TypeScript 5** - 类型安全

### 数据层
- **PostgreSQL 16** - 关系型数据库
- **Prisma 6** - Server 端 ORM
- **PostgREST 12** - RESTful API 自动生成
- **@supabase/postgrest-js** - Client 端 PostgREST 客户端

### 开发工具
- **Docker / Docker Compose** - 容器化部署
- **Nix Flake** - 开发环境管理
- **Tailwind CSS** - 样式框架
- **pnpm** - 包管理器

## 📁 项目结构

```
db-frontend-example/
├── plan/                          # 规划文档
│   ├── requirement.md             # 需求文档
│   └── architecture.md            # 架构设计
│
├── docs/                          # 项目文档
│   ├── comparison.md              # 技术对比分析
│   ├── development.md             # 开发指南
│   └── api.md                     # API 文档
│
├── docker/                        # Docker 配置
│   └── postgres/
│       └── init.sql               # 数据库初始化脚本
│
├── prisma/
│   ├── schema.prisma              # Prisma 数据模型
│   └── seed.ts                    # 种子数据
│
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── layout.tsx             # 根布局
│   │   ├── page.tsx               # 首页
│   │   ├── globals.css            # 全局样式
│   │   │
│   │   ├── (client)/              # Client 端方案路由组
│   │   │   └── client/
│   │   │       ├── page.tsx       # Client 首页
│   │   │       ├── posts/         # 文章列表
│   │   │       └── categories/    # 分类列表
│   │   │
│   │   ├── (server)/              # Server 端方案路由组
│   │   │   └── server/
│   │   │       ├── page.tsx       # Server 首页
│   │   │       ├── posts/         # 文章列表
│   │   │       └── categories/    # 分类列表
│   │   │
│   │   └── compare/               # 对比展示页面
│   │
│   ├── components/
│   │   ├── ui/                    # 基础 UI 组件
│   │   ├── client/                # Client 端专用组件
│   │   └── compare/               # 对比展示组件
│   │
│   ├── lib/
│   │   ├── prisma.ts              # Prisma 客户端单例
│   │   ├── postgrest.ts           # PostgREST 客户端配置
│   │   └── server/                # Server 端数据获取函数
│   │
│   ├── hooks/                     # 自定义 Hooks (Client 端)
│   │   ├── use-posts.ts           # 文章数据 Hook
│   │   ├── use-comments.ts        # 评论数据 Hook
│   │   └── use-categories.ts      # 分类数据 Hook
│   │
│   └── types/
│       ├── index.ts               # 共享类型定义
│       └── postgrest.ts           # PostgREST 类型
│
├── docker-compose.yml             # Docker Compose 配置
├── flake.nix                      # Nix Flake 开发环境
├── package.json                   # 项目依赖
└── README.md                      # 项目说明
```

## 🚀 快速开始

### 环境要求

- **Node.js** >= 22.x
- **pnpm** >= 9.x
- **Docker** 和 **Docker Compose**
- （可选）**Nix** - 用于声明式开发环境

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd db-frontend-example
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env
   ```
   
   编辑 `.env` 文件，确保以下配置正确：
   ```env
   # 数据库连接（Prisma 使用）
   DATABASE_URL="postgres://postgres:postgres@localhost:5432/blog_db"
   
   # PostgREST API 地址（Client 端使用）
   NEXT_PUBLIC_POSTGREST_URL="http://localhost:3001"
   ```

### 启动服务

1. **启动数据库和 PostgREST**
   ```bash
   pnpm db:up
   ```
   
   这将启动：
   - PostgreSQL 数据库（端口 5432）
   - PostgREST API 服务（端口 3001）

2. **运行数据库迁移**
   ```bash
   pnpm db:push
   ```

3. **授予 PostgREST 访问权限**
   ```bash
   pnpm db:grant
   ```

4. **填充种子数据**
   ```bash
   pnpm db:seed
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

### 访问应用

- **首页**：http://localhost:3000
- **Client 端方案**：http://localhost:3000/client
- **Server 端方案**：http://localhost:3000/server
- **对比页面**：http://localhost:3000/compare
- **PostgREST API**：http://localhost:3001

## 📊 两种方案说明

### Client 端方案（PostgREST）

使用 `@supabase/postgrest-js` 在浏览器中直接访问 PostgREST API。

**特点**：
- 数据在客户端获取和渲染
- 支持实时更新和乐观更新
- 无需编写后端 API
- 适合高交互性应用

**访问路径**：`/client/*`

### Server 端方案（Prisma）

使用 Prisma ORM 在 Server Component 中直接查询数据库。

**特点**：
- 数据在服务端获取，HTML 直出
- 天然支持 SEO
- 类型安全，IDE 支持完善
- 适合内容型网站

**访问路径**：`/server/*`

## 📚 文档

- [技术对比分析](docs/comparison.md) - 两种方案的详细对比
- [开发指南](docs/development.md) - 开发环境设置和代码规范
- [API 文档](docs/api.md) - PostgREST 和 Prisma 接口说明

## 🔧 常用命令

```bash
# 开发
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
pnpm lint             # 代码检查

# 数据库
pnpm db:up            # 启动 Docker 服务
pnpm db:down          # 停止 Docker 服务
pnpm db:push          # 推送 Prisma schema 到数据库
pnpm db:migrate       # 运行数据库迁移
pnpm db:seed          # 填充种子数据
pnpm db:studio        # 打开 Prisma Studio
pnpm db:grant         # 授予 PostgREST 访问权限
```

## ❓ 常见问题

### 1. PostgREST 无法访问数据

**问题**：访问 `http://localhost:3001/posts` 返回空数组或权限错误。

**解决方案**：
```bash
# 确保已运行数据库迁移
pnpm db:push

# 授予 PostgREST 访问权限
pnpm db:grant

# 填充种子数据
pnpm db:seed
```

### 2. Prisma 连接数据库失败

**问题**：`Can't reach database server at localhost:5432`

**解决方案**：
```bash
# 确保 Docker 服务正在运行
pnpm db:up

# 检查 Docker 容器状态
docker ps

# 查看数据库日志
docker logs blog_postgres
```

### 3. 类型错误

**问题**：TypeScript 报告 Prisma 类型不存在。

**解决方案**：
```bash
# 重新生成 Prisma 客户端
pnpm db:generate
```

### 4. 端口冲突

**问题**：端口 3000、3001 或 5432 已被占用。

**解决方案**：
```bash
# 查找占用端口的进程
lsof -i :3000
lsof -i :3001
lsof -i :5432

# 或修改 docker-compose.yml 中的端口映射
```

### 5. Nix 环境问题

**问题**：使用 Nix 时环境变量未加载。

**解决方案**：
```bash
# 确保 direnv 已安装并启用
direnv allow

# 或手动进入 Nix shell
nix develop
```

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！