# Getting Started

This section will help you learn how to use [Magic-cli](https://github.com/vbs-plus/magic-cli). If you already have an existing project and would like to keep project inside the project, start from Step 2.

::: warning
[Magic CLI](https://github.com/vbs-plus/magic-cli) is in Maintenance Mode Now!
:::
##  Step. 1: Install Magic

::: tip Node Version Requirement

Magic CLI requires [Node.js](https://nodejs.org/) version above (v12+ recommended). You can manage multiple versions of Node on the same machine with [n](https://github.com/tj/n), [nvm](https://github.com/creationix/nvm) or [nvm-windows](https://github.com/coreybutler/nvm-windows).

:::

To install the new package, use one of the following commands.

``` sh
$ npm install -g @vbs/magic-cli-core
# OR
$ yarn global add @vbs/magic-cli-core
# OR
$ pnpm install --global @vbs/magic-cli-core
```

If you are using [zi](https://www.npmjs.com/package/za-zi),you can run the following command

```sh
$ zi -g @vbs/magic-cli-core
```

::: tip
When NPM installs packages such as electron and puppeter, they will download the corresponding binary files through the `postinstall` script. For some unknown reasons, this process may be slow or unavailable in some networks. You can copy the following configuration to `. Bashrc` or `. Zshrc`, using npmmirror Com. The data is from [binary mirror config](https://github.com/cnpm/binary-mirror-config).

:::

You can check you have the right version with this command:

```sh
magic --version
```

##  Step. 2: Checkout `Magic` works normally

You can use the following command to show `Magic's` features 

```sh
magic -h
```
Then you will see the following results:

![](https://raw.githubusercontent.com/imageList/imglist/master/img/20220905094449.png)

## Upgrading

To upgrade the global Magic CLI package, you need to run:

```sh
npm update -g  @vbs/magic-cli-core

# OR
yarn global upgrade --latest  @vbs/magic-cli-core

# OR
pnpm update -g  @vbs/magic-cli-core
```

