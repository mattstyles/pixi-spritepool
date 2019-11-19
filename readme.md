
# Pixi-spritepool

> Sprite pooling for Pixi

[![npm](https://img.shields.io/npm/v/pixi-spritepool.svg?style=flat)](https://www.npmjs.com/package/pixi-spritepool)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://travis-ci.org/mattstyles/pixi-spritepool.svg?branch=master)](https://travis-ci.org/mattstyles/pixi-spritepool)
[![Coverage Status](https://coveralls.io/repos/mattstyles/pixi-spritepool/badge.svg?branch=master&service=github)](https://coveralls.io/github/mattstyles/pixi-spritepool?branch=master)
[![Dependency Status](https://david-dm.org/mattstyles/pixi-spritepool.svg)](https://david-dm.org/mattstyles/pixi-spritepool)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

## Getting Started

```sh
npm i -S pixi-spritepool
```

```sh
yarn add pixi-spritepool
```

Helper for allocating a collection of sprites.

```js
import { Container } from 'pixi.js'
import { SpritePool } from 'pixi-spritepool'

const container = new Container()
const pool = SpritePool.of({
  length: 100,
  container
})
```

The above will create a set of sprite objects and attach them to the container. If you need to extend the length of the pool, or reduce it, the following methods will help you:

```js
pool.malloc(20)
pool.free(20)
```

As a container has been attached during the constructor malloc and free with attach and detach sprites from that container. Additionally, it will call `onCreateItem` and `onRemoveItem` callbacks which allow side effects to occur when calling malloc or free:

```js
import { Sprite } from 'pixi.js'

const onCreate = () => {
  console.log('Creating new sprite')
  return new Sprite()
}
const onDestroy = () => {
  console.log('Destroying sprite')
}

const pool = SpritePool.of({
  length: 100,
  container,
  onCreateItem: onCreate,
  onRemoveItem: onRemoveItem
})
// Creating new sprite

pool.free(10)
// Destroying sprite
```

If you want more control over the pool and where those sprites attach to then you can omit the `container` parameter from the constructor and handle this yourself, the `onCreateItem` and `onRemoveItem` callbacks might be useful.

You could attach or detach an entire pool to/from a container. The following methods will handle adding or removing a child from the given container.

```js
const container2 = new Container()

pool.detach(container)
pool.attach(container2)
```

Note that there is nothing (other than your conscience) stopping you from attaching sprites to multiple containers.

There are a couple of methods for helping to deal with the pool.

```js
console.log(pool.length)
// 100

console.log(pool.get(4))
// Sprite

pool.each(sprite => console.log(sprite))
// Sprite

pool.map(sprite => {
  console.log('old', sprite)
  // Note that in this example the above sprite is being replaced but it has
  // not been detached, if it was ever attached in the first place.
  return new Sprite()
})
// old Sprite
```

## Running tests

```sh
npm i
npm test
```

## Contributing

Pull requests are always welcome, the project uses the [standard](http://standardjs.com) code style. Please run `npm test` to ensure all tests are passing and add tests for any new features or updates.

For bugs and feature requests, [please create an issue](https://github.com/mattstyles/pixi-spritepool/issues).

## License

MIT
