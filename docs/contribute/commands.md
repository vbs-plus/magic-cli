# Contributing

Thanks for your interest in contributing to Magic!

If you are interested in this project and want to contribute to it. please read the flowing content.

## Environment preparation

Requirements:
 - [Node.js](https://nodejs.org/)
 - [@microsoft/rush](https://rushjs.io/)

First, you should [fork](https://github.com/vbs-plus/magic-cli/fork) the project and create your requirements branch based on the `main` branch,Run the flowing code:

## Installation

```shell
# npm
npm install @vbs/magic-cli-core -g

# yarn
yarn global add @vbs/magic-cli-core

# pnpm
pnpm install --global @vbs/magic-cli-core
```

## Development starts

```shell
# install rush
npm install -g @microsoft/rush

git clone https://github.com/vbs-plus/magic-cl

npm run bootstrap
npm run dev && npm run link 

# Check out the bin effect
magic -h
```

## Development environment debugging

```shell
npm run dev && npm run link
```

## Production environment packaging

```shell
# Global packaging
rush build

# Subcontracted packaging
rush build -o @vbs/magic-cli-core

# Dependent package packaging
rush build -i @vbs/magic-cli-utils
```


## Posted (powered by Github Action)

```shell
npm run release
```

## Configure claims

```shell
# The global env file holds path ex:/Users/xxx/.magic-cli.env
homeEnvPath
# Default global installation directory, tp is not specified to take effect ex:/Users/xxx/.magic-cli
process.env.MAGIC_CLI_HOME_PATH
# Assist in stitching the global cache directory ex:.magic-cli
process.env.MAGIC_HOME_PATH
# Specify the root directory where the command (init) file is located, which is empty by default, and go to the global installation directory ec: /users/target/xxx
process.env.TARGET_PATH
# Turn on Debug mode, turn off by default, and turn on ec: debug by adding the command parameter -d
process.env.DEBUG
```


## Pull Request

Before Pull Request, please run `pnpm lint`, Or it will be triggered by git commit. 

After everything is done，Put forward a pull request on https://github.com/vbs-plus/magic-cli/pulls
