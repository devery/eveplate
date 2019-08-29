# generator-eveplate

> Boilerplate for EVE and DeveryJS - Build Applications using our eveplate tool!

See [eveplate](http://eveplate.com) website for more information about this generator.

See [devery](http://devery.io) website for more information about devery library.  

Eveplate is a generator to help you kickstart new projects based on Devery.js and a set of frameworks:
* Vue
* React
* React Native
* Angular
* Nodejs

## What is eveplate ##

Generator-eveplate acts as a plugin that can be run through the command line to scaffold complete projects or useful parts.
It is a complex clientside-stack to ensure seamless workflow comprising tools and frameworks to allow developers to build unique verification Dapps based on Devery’s framework technology.

Eveplate comprises two types of tools for improving your productivity and satisfaction when building a verification dapp based on the open source Devry protocol: the scaffolding tool (yo)  the build tool (webpack).

## yo ##
YO scaffolds out a new application while writing your build configuration NPM pulls in relevant build tasks and package manager dependencies that you might need for your build

## npx ##
npx makes it easy to use CLI tools and other executables hosted on the registry. It greatly simplifies a number of things that, until now, required a bit of ceremony to do with plain npm.

## Run

Using npx:

```sh
npx -p yo -p @devery/generator-eveplate -c 'yo eveplate'
```

or

## Install


Using npm:

```sh
npm install -g yo @devery/generator-eveplate
```

or using yarn:

```sh
yarn global add yo @devery/generator-eveplate
```

and run:

```sh
yo eveplate
```
