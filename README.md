## PMREPO

pnpm + rushjs monorepo 模板

测试地址：https://www.npmjs.com/package/pmrepo-core

## 前置

```shell
npm install -g @microsoft/rush

# 安装依赖
npm run bootstrap

# 链接bin
rush build 
npm run start

# 查看bin效果
pm
```

## 创建子项目

```shell
pnpm init // 创建 package.json 文件
tsc --init // 创建 tscconfig.json
touch index.ts // 创建 index.ts 文件
```

```shell
.
├── package.json
├── packages
│   ├── core
│   │   ├── index.ts
│   │   ├── package.json
│       └── tsconfig.json
│   └── utils
│       ├── index.ts
│       ├── package.json
│       └── tsconfig.json
└── pnpm-workspace.yaml
```

## 安装依赖

```shell
pnpm add npmlog --filter utils  // --filter 表示要作用到哪个子项目
# --filter 可以接多个项目名，--filter A --filter B

pnpm add tslib @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript rollup-plugin-clear --filter utils
```

## 链接子项目

```shell
# pnpm 方式
pnpm add @pmrepo/utils --filter core // 在 core 里引用 utils

# rush
rush add -p @pmrepo/utils //-p 表示添加本地库，后面接库名称

# rush 全局添加子项目
rush add -p @pmrepo/utils -all
```

## 链接全局

```shell
cd packages/core
pnpm link -g
```

## 打包

```shell
# 全局打包
rush build

# 分包打包
rush build -o @pmrepo/core

# 依赖包打包
rush build -i @pmrepo/utils
```


# 发布

```shell
rush build
git add .
git commit -m "chore: publish"
rush change
rush publish --apply
# 正式发布npm
rush publish -p --include-all -n <替换成你的 npm TOKEN>
```

