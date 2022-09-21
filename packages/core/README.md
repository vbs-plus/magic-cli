# Magic

## Getting Start

This section will help you learn how to use [Magic-cli](https://github.com/vbs-plus/magic-cli). If you already have an existing project and would like to keep project inside the project, start from Step 2.
##  Step. 1: Install Magic

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


## Creating a Project

To create a new project, run:
```sh
magic init 
#OR
magic init hello-world
```
## Step. 1: Checkout Env

First, magic will check your device environment, and then retrieve the system template.

![](https://raw.githubusercontent.com/imageList/imglist/master/img/Kapture%202022-09-05%20at%2009.54.02.gif)


## Step. 2: Select initialization type

Then select the project type, as shown in the following figure.
![](https://raw.githubusercontent.com/imageList/imglist/master/img/20220905095943.png)

## Step. 3: Enter project related information

Input relevant information of the project according to the prompts of the CLI.
![](https://raw.githubusercontent.com/imageList/imglist/master/img/20220905100112.png)


## Setp. 4: Hand over to CLI
Wait for CLI installation dependency and operation start command.This step will go through the process of template installation and rendering, which may take some time

![](https://raw.githubusercontent.com/imageList/imglist/master/20220907213719.png)
## Enjoy

If you se the following result, it means that the project has been successfully created and run

![](https://raw.githubusercontent.com/imageList/imglist/master/20220907213827.png)

