<p align="center">
<img src="./docs/public/logo.svg" style="width:100px;" />
<h1 align="center">Magic CLI (WIP)</h1>
<p align="center">A Monorepo Enterprise level CLI tools.</p>
</p>
<p align="center">
<a href="https://www.npmjs.com/package/@vbs/magic-cli-core"><img src="https://img.shields.io/npm/v/@vbs/magic-cli-core?color=c95f8b&amp;label=" alt="NPM version"></a></p>
<p align="center">
<a href="https://magic-cli.netlify.app/">🧑‍💻 Document </a>
</p>

## New version of Magic preview, Stay tuned!

![](./screen/demo.gif)

## Getting Start

This section will help you learn how to use [Magic-cli](https://github.com/vbs-plus/magic-cli). If you already have an existing project and would like to keep project inside the project, start from Step 2.

###  Step 1: Install Magic

To install the new package, use one of the following commands.

``` sh
$ npm install -g @vbs/magic-cli-core
# OR
$ yarn global add @vbs/magic-cli-core
# OR
$ pnpm install --global @vbs/magic-cli-core
```

If you are using [zi](https://www.npmjs.com/package/za-zi), you can run the following command.

```sh
$ zi -g @vbs/magic-cli-core
```

You can check you have the right version with this command:

```sh
magic --version
```

###  Step 2: Checkout `Magic` works normally

You can use the following command to show `Magic's` features.

```sh
magic -h
```

## Upgrading

To upgrade the global Magic CLI package, you need to run:

```sh
npm update -g  @vbs/magic-cli-core

# OR
yarn global upgrade --latest  @vbs/magic-cli-core

# OR
pnpm update -g  @vbs/magic-cli-core
```


## Creating a Project

To create a new project, run:
```sh
magic init 
#OR
magic init hello-world
```

## Contributing

Contributions are always welcome!

See [CONTRIBUTING.md](https://github.com/vbs-plus/magic-cli/blob/main/CONTRIBUTING.MD) for ways to get started.

## License

[MIT](./LICENCE) License © 2022 [mohen](https://github.com/yzh990918)
