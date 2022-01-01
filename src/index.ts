import {Container, Sprite} from 'pixi.js'

/**
 * _onCreateItem
 * Default callback when new items are added to the pool.
 */
function _onCreateItem(): Sprite {
  const sprite = new Sprite()
  sprite.visible = false
  return sprite
}

/**
 * _onRemoveItem
 * Default callback when items are freed from the pool.
 */
function _onRemoveItem(sprite: Sprite) {
  sprite.destroy()
}

type CtorProps = {
  length?: number
  container?: Container
  onCreateItem?: () => any
  onRemoveItem?: (_: any) => void
}

/**
 * Holds a pool of Sprites, with malloc and free abilities.
 * All sprites are hidden by default.
 */
export class SpritePool {
  static of(_: CtorProps) {
    return new SpritePool(_)
  }

  /**
   * Static method for attaching the contents of a sprite pool to a given
   * container. This is relatively safe as Pixi won’t add the same sprite
   * more than once.
   */
  static attachPool(pool: SpritePool, container: Container) {
    let i = pool.pool.length
    while (i--) {
      container.addChild(pool.pool[i])
    }
  }

  pool: Sprite[]
  container?: Container
  onCreateItem = _onCreateItem
  onRemoveItem = _onRemoveItem

  constructor({
    // Size of the initial pool
    length = 10,
    // Optional container to attach to
    container = null,
    // Function called when creating an item
    onCreateItem = _onCreateItem,
    // Function called when removing an item
    onRemoveItem = _onRemoveItem,
  }: CtorProps) {
    this.pool = []
    this.container = container
    this.onCreateItem = onCreateItem
    this.onRemoveItem = onRemoveItem

    this.malloc(length)
  }

  /**
   * Attach all pool items to a container
   */
  attach(container: Container, pool?: Sprite[]) {
    if (!pool) {
      pool = this.pool
    }
    let i = pool.length
    while (i--) {
      container.addChild(pool[i])
    }
  }

  /**
   * Remove all pool items from a container
   */
  detach(container: Container, pool?: Sprite[]) {
    if (!pool) {
      pool = this.pool
    }
    let i = pool.length
    while (i--) {
      container.addChild(pool[i])
      container.removeChild(pool[i])
    }
  }

  /**
   * Helper to grab an item from the pool
   */
  get(i: number) {
    return this.pool[i]
  }

  /**
   * Returns the current length of the allocated pool
   */
  get length() {
    return this.pool.length
  }

  /**
   * Maps over the pool of allocated sprites
   */
  map(cb: (sprite: Sprite) => Sprite) {
    let i = this.pool.length
    while (i--) {
      this.pool[i] = cb(this.pool[i])
    }
  }

  /**
   * Iterates linearly over the entire pool of items.
   */
  each(cb: (sprite: Sprite) => void) {
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
   */
  malloc(length: number): Sprite[] {
    const temp = Array.from({length}, this.onCreateItem)
    this.pool = this.pool.concat(temp)
    if (this.container) {
      this.attach(this.container, temp)
    }
    return temp
  }

  /**
   * Nukes the final `length` segments from the pool, and detaches if possible
   */
  free(length: number) {
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
