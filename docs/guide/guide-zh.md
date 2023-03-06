# Magic CLI

## 起步

本章节将会介绍如何使用和安装 [Magic-cli](https://github.com/vbs-plus/magic-cli). 如果你已经安装并且学习过本文档，请直接从创建项目开始。

::: tip
[Magic CLI](https://github.com/vbs-plus/magic-cli) 版本还在维护阶段。

在最近的更新中，我们使用 [clack](https://github.com/natemoo-re/clack) 重构了一些功能，我们将在未来开发一些额外的命令，敬请关注。
:::

这是一些截图：

![](https://jsd.cdn.zzko.cn/gh/yzh990918/static@master/Kapture-2023-03-04-at-14.q6m1ppb4psg.gif)

###  Step. 1: 安装 Magic

::: tip Node 版本要求

Magic CLI 需要 [Node.js](https://nodejs.org/) 版本 (v12+ 推荐). 可以使用管理同一台计算机上 `Node` 的多个版本 [n](https://github.com/tj/n), [nvm](https://github.com/creationix/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows).

:::

要安装新软件包，请使用以下命令之一：

``` sh
$ npm install -g @vbs/magic-cli-core
# OR
$ yarn global add @vbs/magic-cli-core
# OR
$ pnpm install --global @vbs/magic-cli-core
```


如果您正在使用 [ZI](https://www.npmjs.com/package/za-zi)，你可以运行以下命令：

```sh
$ zi -g @vbs/magic-cli-core
```

::: tip
当 `NPM` 安装诸如 `electron` 和 `puppeter` 之类的软件包时，他们将通过 `posinstall` 脚本下载相应的二进制文件。由于某些未知原因，在某些网络中，此过程可能很慢或不可用。您可以将以下配置复制到 `.Bashrc` 或 `.Zshrc`，使用npmmerror.Com。数据来自 [binary mirror config](https://github.com/cnpm/binary-mirror-config).

:::

你可以运行以下命令检查版本:

```sh
magic --version
```

###  Step. 2: 检查 `Magic` 被正常工作

您可以使用以下命令检查 `Magic` 是否被正常工作：

```sh
magic -h
```
那么你会看到以下结果:

![](https://cdn.staticaly.com/gh/yzh990918/static@master/20230305/image.1wagrnedzekg.webp)

### 更新

全局更新 `Magic CLI`，你需要运行：

```sh
npm update -g  @vbs/magic-cli-core

# OR
yarn global upgrade --latest  @vbs/magic-cli-core

# OR
pnpm update -g  @vbs/magic-cli-core
```

## 创建项目

创建一个项目：

```sh
magic init 
#OR
magic init hello-world
```
### Step. 1: 检查环境

首先，`Magic` 将检查您的设备环境，然后检索系统模板。

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230305/image.1tacol19aibk.webp)


### Step. 2: 选择初始化类型

::: warning
Beta 版本仅支持选择项目类型
:::

然后选择项目类型，如下图所示。

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230305/image.3kga2wev84g0.webp)

### Step. 3: 输入项目相关信息

根据 `CLI` 的提示输入项目的相关信息。

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230305/image.2xm7cfwn76e0.webp)


### Setp. 4: 交给 CLI
等待 `CLI` 安装依赖项和操作启动命令。此步骤将完成模板安装和渲染过程，这可能需要一些时间。

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230305/image.4nf70wsyqgi0.webp)
### 大功告成

如果出现以下结果，则表示项目已成功创建并运行。

![image](https://cdn.staticaly.com/gh/yzh990918/static@master/20230305/image.1i3xh68dmp6o.webp)

