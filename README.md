# Module Patterns in Node

## Overview

Imagine a scenario where you have an application with 2,000 lines of code. All the code is in one file. That's a nightmare to navigate around and also difficult for different developers to collaborate without merge conflicts! What if you split the logic into 20 files which each file having 100 lines of code roughly. Much better right? So what's the best way to do that? The answer is modules!

Modules allow developers to build better systems because the code can be separated into different files which are grouped into packages or modules. You can write your own module or use a module from an open-source community. 

This lesson will cover the most common patterns used to create and export a Node module.

## Objectives

1. Define different patterns for Node modules
1. Describe module.exports= {}
1. Describe module.exports=function(){}
1. Describe exports.method = function(){}
1. Describe exports.object = {}

## Exporting Objects

Consider an example where we have a configuration file with some settings (`configs.js`):

```js
module.exports = {
  url: 'http://webapplog.com',
  name: 'React Quicly',
  port: 3000,
  apiKey: "D1FCFE58-575F-40FF-AF36-0CBD6A367756"
}
```

In the `main.js` file (which uses the module), we can import the module and use any settings by accessing the property by the name such as `url` or `name` (`.js` extension is optional):

```js
var configs = require('./configs')
console.log('URL is %s', configs.url)
```

The result of running `node main` will be the printed URL with the value supplied by the `configs.js`:

```
URL is http://webapplog.com
```

We achieved modularity! Now we can have many other files like `program.js` or `app.js` which can import the `config.js` file and access the same values. If we ever need to change `port` or `apiKey`, then it's effortless. We just update `configs.js`. No need to search in all files and risk bugs by missing a few.

However, there's a limitation to this approach. Let's say we need to have three sets of API keys: one for development, one for testing and one for production. You can write `if/else` conditions in `main.js` but then you end up repeating the same logic over and over in other files which need to use the configurations. 
This approach isn't great because we end up with a lot of logic which really belongs to the configuration module spread out across various main files (files which import the module). Take a look at the code below (also in `main-envirionment-bad.js`):

```js
if (process.env.NODE_ENV == 'production') {
  var configs = require('./configs-production')
} else if (process.env.NODE_ENV == 'testing') {
  var configs = require('./configs-testing')
} else { // Assume development
  var configs = require('./configs')
}

console.log('URL is %s', configs.url)
```

If you are thinking we should move the logic to the `config.js` file, the you are right. But how do we go about it if it's just an object? 

## Exporting Functions

We need to use the `module.exports = function() {}` pattern which is more versatile. It allows us to execute some logic and even use parameters from the function's arguments. 

With the function pattern, we can re-write our configuration module to be smarter and more dynamic. First, we get the environment or use the one from the environment variable `NODE_ENV` if the argument is not set:

```js
module.exports = function(env) {
  env = env || process.env.NODE_ENV
```

Then we define two conditions and return different configurations accordingly (in this example only API keys are different):

```js  
  if (env == 'production') {
    return {
      url: 'http://webapplog.com',
      name: 'React Quicly',
      port: 3000,
      apiKey: "34EC5CE9-CD02-4C4E-B5D9-D7CEF2F12F2C"
    }
  } else if (env == 'testing') {
    return {
      url: 'http://webapplog.com',
      name: 'React Quicly',
      port: 3000,
      apiKey: "D2230FC4-7E2A-4003-9372-0BF80107558D"
    }
  } else { // Assume development
    return {
      url: 'http://webapplog.com',
      name: 'React Quicly',
      port: 3000,
      apiKey: "D1FCFE58-575F-40FF-AF36-0CBD6A367756"
    }
  }
}
```

The `main-environment.js` file can pass the argument or not, but it needs to invoke the imported configs method:

```js
var configsInit = require('./environment')
configs = configsInit('your-awesome-environment')
console.log('URL is %s', configs.url)
console.log('API key is %s', configs.apiKey)
```

or you can merge 1st and 2nd lines into a single statement (more common style):

```js
var configs = require('./environment')()
console.log('URL is %s', configs.url)
console.log('API key is %s', configs.apiKey)
```

The resulting module and main file will produce be able to switch between different settings according to the environment variable:

```
$ node main-environment
URL is http://webapplog.com
API key is D1FCFE58-575F-40FF-AF36-0CBD6A367756
$ NODE_ENV=production node main-environment
URL is http://webapplog.com
API key is 34EC5CE9-CD02-4C4E-B5D9-D7CEF2F12F2C
$ NODE_ENV=testing node main-environment
URL is http://webapplog.com
API key is D2230FC4-7E2A-4003-9372-0BF80107558D
```

To summarize the difference between objects and functions, the latter are more dynamic and allow for the so called initializer or constructor code, i.e., some code to tweak an object before exporting it.
 
## module.exports and exports

Simply put, `module.exports` is an alias to the `exports`. You can save your self a repetitive stress injury by using `exports`. Take a look at this module which uses `module.exports`:

```js
module.exports.sayHelloInEnglish = function() {
  return 'Hello'
}

module.exports.sayHelloInTatar = function() {
  return 'Isänmesez'
}

module.exports.sayHelloInSpanish = function() {
  return 'Hola'
}

module.exports.sayHelloInJapanese = function() {
  return 'こんにちは' // Kon'nichiwa
}
```

The following version is an absolute exact equivalent:

```js
exports.sayHelloInEnglish = function() {
  return 'Hello'
}

exports.sayHelloInTatar = function() {
  return 'Isänmesez'
}

exports.sayHelloInSpanish = function() {
  return 'Hola'
}

exports.sayHelloInJapanese = function() {
  return 'こんにちは' // Kon'nichiwa
}
```

That's great! In this case `exports` and `module.exports` are the same. What if we want to assign the whole object like we did with the configuration module to the `exports` object?

So this is the working code with `module.exports`. Obviously the code with `module.exports` works, because we used it in the previous section:

```js
module.exports = function(env) {
  env = env || process.env.NODE_ENV
  if (env == 'production') {
    ...
  } else if (env == 'testing') {
    ...
  } else { // Assume development
    ...
  }
}
```

What about this code with `exports`? Will it work too? 

```js
exports = function(env) {
  env = env || process.env.NODE_ENV
  if (env == 'production') {
    ...
  } else if (env == 'testing') {
    ...
  } else { // Assume development
    ...
  }
}
```

Go ahead and try to run it (`environment-exports.js`) with this one-liner command:

```
node -e "console.log(require('./environment-exports')().apiKey)"
```

If you're getting `TypeError: require(...) is not a function`, that's right.

Another example include this refactoring:

You can even refactor you code as this (working code):

```js
module.exports = {
  sayHelloInEnglish: function() {
    return 'Hello'
  },
  sayHelloInTatar: function() {
    return 'Isänmesez'
  },
  sayHelloInSpanish: function() {
    return 'Hola'
  },
  sayHelloInJapanese: function() {
    return 'こんにちは' // Kon'nichiwa
  }
}
```

Into this broken code:

```js
exports = {
  sayHelloInEnglish: function() {
    return 'Hello'
  },
  sayHelloInTatar: function() {
    return 'Isänmesez'
  },
  sayHelloInSpanish: function() {
    return 'Hola'
  },
  sayHelloInJapanese: function() {
    return 'こんにちは' // Kon'nichiwa
  }
}
```

So what's happening with `exports =...`? It won't work as expected, because we cannot assign exports to something. We lose the reference. 

We need to use `module.exports =...` if we want to assign the entire module, i.e., if we want to have the logic as the result of `require()` and not as the result of `require().NAME`.

When to use `module.exports = ...` vs. `exports.name = ...` or `module.exports.name = ...`? In other words, when do you want to use `var name = require('name')` and when `var nameB = require('nameA').nameB`?

Node developers tend to use the former when they have a large class which take the whole file. They use the latter when they have a set of individual methods or objects. A good example will be an Express.js library which uses the former style and a collection of some utilities which are categorically the same but have distinct functionalities. 

An example of the latter is `chai` which has `except` property: `var expect = require('chai').expect`.

You've learned the most common patterns and their differences. From them you can create more advanced implementation of modules which export constructor (psedu-classical inheritance) a higher-order function (function which returns a function), or monkey patch or use globals. Follow the links in the resources to learn more about them.

## Module Patterns at a Glance

You can utilize one of the following patterns to export the logic:

1. `module.exports= {...}`: Exporting an object
1. `module.exports=function() {...}`: Exporting a function
1. `exports.method = function() {...}` same as `module.exports.method = function() {...}` 
1. `exports.object = {...}` same as `module.exports.object = {...}`

2 and 3 can also be use for classes (factory function or functional inheritance pattern). We won't discuss classes in great detail since it's more of general JavaScript topic and not exclusive to Node. 

Right now let's cover the difference between assigning an object and a method.


## Resources

1. [Export This: Interface Design Patterns for Node.js Modules](http://bites.goodeggs.com/posts/export-this)
1. [Node.js Module Patterns](https://darrenderidder.github.io/talks/ModulePatterns)
1. [Pseudo-Classical Pattern](http://javascript.info/tutorial/pseudo-classical-pattern)


---

<a href='https://learn.co/lessons/node-modules-patterns' data-visibility='hidden'>View this lesson on Learn.co</a>
