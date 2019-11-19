
import { Sprite } from 'pixi.js'

/**
 * @callback CreateFunc
 * @param {void}
 * @returns {any}
 */

/**
 * _onCreateItem
 * Default callback when new items are added to the pool.
 * @returns {any} - item to be appended to the pool.
 */
const _onCreateItem = () => {
  const sprite = new Sprite()
  sprite.visible = false
  return sprite
}

/**
 * @callback RemoveFunc
 * @param {any}
 */

/**
 * _onRemoveItem
 * Default callback when items are freed from the pool.
 * @param {any} _ - item being removed
 */
const _onRemoveItem = (_) => {
  _.destroy()
}

/**
 * Holds a pool of Sprites, with malloc and free abilities.
 * All sprites are hidden by default.
 * @class
 */
export class SpritePool {
  /**
   * @static
   * @constructor
   */
  static of (_) {
    return new SpritePool(_)
  }

  /**
   * Static method for attaching the contents of a sprite pool to a given
   * container. This is relatively safe as Pixi won’t add the same sprite
   * more than once.
   * @static
   */
  static attachPool (pool, container) {
    let i = pool.pool.length
    while (i--) {
      container.addChild(pool.pool[i])
    }
  }

  /**
   * @constructor
   * @param {object} [params] - single-arity parametric constructor
   * @param {number} [params.length=10] - the size of the initial pool
   * @param {CreateFunc} [params.onCreateItem=default] - called when pool items are allocated
   * @param {RemoveFunc} [params.onRemoveItem=default] - called when pool items are freed
   * @param {?PIXI.Container} [params.container=null] - the container to attach to
   */
  constructor ({
    length = 10,
    container = null,
    onCreateItem = _onCreateItem,
    onRemoveItem = _onRemoveItem
  } = {}) {
    /**
     * @member SpritePool.pool
     * @type {PIXI.Sprite[]}
     */
    this.pool = []

    /**
     * @member SpritePool.container
     * @type {?PIXI.Container}
     */
    this.container = container

    /**
     * @member SpritePool.onCreateItem
     * @type {CreateFunc}
     */
    this.onCreateItem = onCreateItem

    /**
     * @member SpritePool.onRemoveItem
     * @type {RemoveFunc}
     */
    this.onRemoveItem = onRemoveItem

    this.malloc(length)
  }

  /**
   * @method attach
   * @param {PIXI.Container} container - the container to attach to
   * @param {SpritePool} [pool] - array-like object to attach to container
   */
  attach (container, pool) {
    if (!pool) {
      pool = this.pool
    }
    let i = pool.length
    while (i--) {
      container.addChild(pool[i])
    }
  }

  /**
   * @method detach
   * @param {PIXI.Container} container - the container to detach from
   * @param {SpritePool} [pool] - array-like object to detach sprites from
   */
  detach (container, pool) {
    if (!pool) {
      pool = this.pool
    }
    let i = pool.length
    while (i--) {
      container.removeChild(pool[i])
    }
  }

  /**
   * @method get
   * @param {number} i - the array indice to grab a Sprite from
   * @returns {PIXI.Sprite} the sprite held it index `i`
   */
  get (i) {
    return this.pool[i]
  }

  /**
   * @method length
   * @returns {number} - the size of the current pool
   */
  get length () {
    return this.pool.length
  }

  /**
   * @callback MapFunc
   * @defaults identity
   * @param {PIXI.Sprite}
   * @returns {PIXI.Sprite}
   */

  /**
   * The output of the mapped function will be applied back in to the pool of
   * sprites at the same location.
   *
   * @method map
   * @param {MapFunc} [cb=identity] - the mapping function to apply to each
   * array in the sprite pool
   */
  map (cb = _ => _) {
    let i = this.pool.length
    while (i--) {
      this.pool[i] = cb(this.pool[i])
    }
  }

  /**
   * @callback EachFunc
   * @defaults noop
   * @param {PIXI.Sprite}
   */

  /**
   * Iterates linearly over the entire pool of items.
   *
   * @method map
   * @param {EachFunc} [cb=noop] - the function applied to each item.
   */
  each (cb = _ => _) {
    let i = this.pool.length
    while (i--) {
      cb(this.pool[i])
    }
  }

  /**
   * Allocates a new array and applies it to the existing pool.
   * Usually you'll want to attach this pool to a container, which will be done
   * automatically if we have a container supplied, otherwise its a job for
   * the caller (hence returning the new array).
   * @method malloc
   * @param {integer} length - the size of the new section to allocate
   * @returns {PIXI.Sprite[]} - the list of newly initialised Sprites
   */
  malloc (length) {
    const temp = Array.from({ length }, this.onCreateItem)
    this.pool = this.pool.concat(temp)
    if (this.container) {
      this.attach(this.container, temp)
    }
    return temp
  }

  /**
   * Nukes the final `length` segments from the pool, and detaches if possible
   * @method free
   * @param {integer} length - the amount of sprites to remove and flag as
   * destroyable.
   * @return {PIXI.Sprite[]} - the removed (and destroyed) sprites
   */
  free (length) {
    const temp = this.pool.splice(this.pool.length - length, length)
    if (this.container) {
      this.detach(this.container, temp)
    }
    let i = temp.length
    while (i--) {
      this.onRemoveItem(temp[i])
    }
    return temp
  }
}
