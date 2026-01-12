{
  description = "Next.js 15 + Prisma + PostgREST 开发环境";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config.allowUnfree = true;
        };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Node.js 环境
            nodejs_20
            nodePackages.pnpm
            nodePackages.typescript
            nodePackages.typescript-language-server

            # 数据库工具
            postgresql_16  # 包含 psql 客户端
            pgcli          # 更好的 PostgreSQL CLI

            # Docker 工具
            docker-compose

            # Prisma 依赖
            openssl
            pkg-config
            prisma-engines
          ];

          shellHook = ''
            echo "🚀 Next.js + Prisma + PostgREST 开发环境已加载"
            echo ""
            echo "可用工具:"
            echo "  - Node.js: $(node --version)"
            echo "  - pnpm: $(pnpm --version)"
            echo "  - TypeScript: $(tsc --version)"
            echo "  - psql: $(psql --version)"
            echo "  - docker-compose: $(docker-compose --version)"
            echo ""

            # Prisma 环境变量配置
            # 设置 Prisma Schema Engine 二进制路径 (Prisma 7 只需要 schema-engine)
            export PRISMA_SCHEMA_ENGINE_BINARY="${pkgs.prisma-engines}/bin/schema-engine"

            # 设置 OpenSSL 路径（Prisma 需要）
            export LD_LIBRARY_PATH="${pkgs.openssl.out}/lib:$LD_LIBRARY_PATH"
            export PKG_CONFIG_PATH="${pkgs.openssl.dev}/lib/pkgconfig:$PKG_CONFIG_PATH"

            # 忽略 Prisma 引擎校验和检查
            export PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

            # 设置 Node.js 本地 bin 路径
            export PATH="$PWD/node_modules/.bin:$PATH"
          '';
        };
      }
    );
}