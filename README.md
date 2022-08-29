## Magic

magic-cli 

![image](https://cdn.staticaly.com/gh/251205668/AtEcut@master/20220823/image.74uvatbms5g0.webp)

## 起步

```shell
npm install @vbs/magic-cli-core -g

magic -h
magic init
```

## 前置

```shell
npm install -g @microsoft/rush

# 安装依赖
npm run bootstrap

# 链接bin
rush build 
npm run start

# 查看bin效果
magic
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


## 发布

```shell
rush build
git add .
git commit -m "chore: publish"
rush change
rush publish --apply
# 正式发布npm
rush publish -p --include-all -n <替换成你的 npm TOKEN>
```

## 配置声明

```shell
# 全局env文件存放path ex:/Users/zhongan/.magic-cli.env
homeEnvPath
# 默认全局安装目录，未指定 tp 生效 ex:/Users/zhongan/.magic-cli
process.env.MAGIC_CLI_HOME_PATH
# 辅助拼接全局缓存目录 ex: .magic-cli
process.env.MAGIC_HOME_PATH
# 指定命令(init)文件所在根目录,默认为空，走全局安装目录 ec: /users/target/xxx
process.env.TARGET_PATH
# 开启 Debug 模式，默认关闭，通过添加命令参数 -d 开启 ec: debug
process.env.DEBUG
```


## TOOD

1. 文档集成
2. 子项目文档
3. 发布规范化
4. 单元测试
5. 命令扩展
