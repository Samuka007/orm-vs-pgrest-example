-- ===========================================
-- PostgreSQL 初始化脚本
-- 用于 PostgREST 配置
-- 注意：角色 web_anon 和 authenticator 已在 CNPG cluster 初始化时创建
-- ===========================================

-- 创建 api schema（PostgREST 使用）
CREATE SCHEMA IF NOT EXISTS api;

-- ===========================================
-- 授予 schema 权限
-- ===========================================

-- 授予 web_anon 对 api schema 的使用权限
GRANT USAGE ON SCHEMA api TO web_anon;

-- 授予 web_anon 对 public schema 的使用权限（Prisma 迁移使用 public schema）
GRANT USAGE ON SCHEMA public TO web_anon;

-- ===========================================
-- 设置默认权限
-- ===========================================

-- 当在 api schema 中创建新表时，自动授予 web_anon SELECT 权限
ALTER DEFAULT PRIVILEGES IN SCHEMA api
    GRANT SELECT ON TABLES TO web_anon;

-- 当在 public schema 中创建新表时，自动授予 web_anon SELECT 权限
ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT ON TABLES TO web_anon;

-- ===========================================
-- 创建辅助函数
-- ===========================================

-- 函数：授予 web_anon 对所有现有表的 SELECT 权限
-- 在 Prisma 迁移后运行此函数
CREATE OR REPLACE FUNCTION grant_web_anon_select()
RETURNS void AS $$
BEGIN
    -- 授予 public schema 中所有表的 SELECT 权限
    EXECUTE (
        SELECT string_agg('GRANT SELECT ON public.' || quote_ident(tablename) || ' TO web_anon;', ' ')
        FROM pg_tables
        WHERE schemaname = 'public'
    );
    
    -- 授予 api schema 中所有表的 SELECT 权限
    EXECUTE (
        SELECT string_agg('GRANT SELECT ON api.' || quote_ident(tablename) || ' TO web_anon;', ' ')
        FROM pg_tables
        WHERE schemaname = 'api'
    );
END;
$$ LANGUAGE plpgsql;

-- ===========================================
-- 注释说明
-- ===========================================

COMMENT ON SCHEMA api IS 'PostgREST API schema - 用于暴露 REST API';
COMMENT ON FUNCTION grant_web_anon_select() IS '授予 web_anon 对所有现有表的 SELECT 权限，在 Prisma 迁移后运行';