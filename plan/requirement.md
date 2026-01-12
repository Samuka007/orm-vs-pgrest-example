# 前端数据库表查询解决方案

## 动机
比较

- client 端使用 supabase/postgrest-js 获取数据库资源
- server side component 通过 ORM 结构获取数据库资源

中的代码范式

## 技术需求

创造一个数据库查询的 Nodejs/Nextjs 前（后）端应用，分别使用

- client 端使用 supabase/postgrest-js 获取数据库资源
- server side component 通过 ORM 结构获取数据库资源

两种手段获取数据库数据来进行渲染，其中，前者使用 supabase/postgrest-js
+ postgrest实例连接数据库，后者使用 Prisma 或任意现代 typescript ORM 框架
定义数据结构，由ssr直接渲染组件返回前端使用

两种技术手段都不应该出现直接查询某种 /api 端点的行为，为的是比较两种方法
在实现 0 CRUD 接口的情况下的易用程度与解耦程度。

## 环境配置

这是一个空的repo，位于 nix 环境下。你可以使用 nix flake 为自己添加必要的
开发依赖，并使用 docker / docker compose 来拉起前端应用、postgrest及数据库
进行联调交互。

## 迭代指南

有了上述需求，你已经有了实现本项目的全部能力与资源。迭代过程中，需要你多多从
第一性原理出发来进行代码debug，用良好的软件工程范式与现代审美品味来构建代码，
并坚持使用最modern且标准的技术手段来实现项目。

项目所有代码由你全权负责，包括所有声明式环境配置（开发环境与运行环境）与具体代码实现逻辑。

## 内容主题

尝试构造任意适用于上述技术场景的需求，以用于两种技术手段的实践，最好能构造一些用例，
分别充分体现两种技术手段的优劣性
