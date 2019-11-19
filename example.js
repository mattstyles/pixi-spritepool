
import Stats from 'stats.js'
import fit from 'canvas-fit'
import {
  Application, Container, Sprite, Texture,
  Rectangle, Point, Text, TextStyle
} from 'pixi.js'
import { SpritePool } from './src'
import tex from './example.png'

const poolSize = 2e4
const increment = 200

const stats = new Stats()
stats.showPanel(0)
stats.dom.style.right = '0px'
stats.dom.style.left = 'auto'
document.body.appendChild(stats.dom)

const dpr = window.devicePixelRatio || 1

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
const resizeCanvas = fit(canvas)
const app = new Application({
  width: canvas.width,
  height: canvas.height,
  backgroundColor: 0x333333,
  resolution: dpr,
  view: canvas
})
const viewport = new Rectangle(0, 0, canvas.width, canvas.height)
const container = new Container()
app.stage.addChild(container)
const resize = () => {
  resizeCanvas()
  app.renderer.resize(canvas.width, canvas.height)
  viewport.width = canvas.width / dpr * 0.45
  viewport.height = canvas.height / dpr * 0.6
  container.hitArea = new Rectangle(
    viewport.x,
    viewport.y,
    viewport.width,
    viewport.height
  )
  console.log(viewport)
}
window.addEventListener('resize', resize)
resize()

const texture = Texture.from(tex)

container.interactive = true
container.buttonMode = true

const style = new TextStyle({
  fontSize: 16,
  fill: 0xf4f5fc
})
const text = new Text('', style)
text.position.x = 10
text.position.y = 10
container.addChild(text)

const onCreate = () => {
  const sprite = new Sprite(texture)
  sprite.visible = false
  sprite.anchor.x = 0.5
  sprite.anchor.y = 1
  return sprite
}

const pool = SpritePool.of({
  length: poolSize,
  container,
  onCreateItem: onCreate
})

const random = (min, max) => {
  const range = (max - min) * Math.random()
  return (min + range) | 0
}

class Dude {
  constructor (x, y, sprite) {
    this.speed = new Point(
      random(-10, 10),
      random(3, 8)
    )
    this.gravity = 0.75
    this.position = new Point(x, y)
  }
}

const update = dude => {
  dude.position.x += dude.speed.x
  dude.position.y += dude.speed.y
  dude.speed.y += dude.gravity

  if (dude.position.x > viewport.x + viewport.width) {
    dude.speed.x *= -1
    dude.position.x = viewport.x + viewport.width
  }

  if (dude.position.x < viewport.x) {
    dude.speed.x *= -1
    dude.position.x = viewport.x
  }

  if (dude.position.y > viewport.y + viewport.height) {
    dude.speed.y *= -0.85
    dude.position.y = viewport.y + viewport.height

    if (Math.random() > 0.5) {
      dude.speed.y -= random(1, 3)
    }
  }

  if (dude.position.y < viewport.y) {
    dude.speed.y *= -1
    dude.position.y = viewport.y
  }
}

const dudes = [new Dude(100, 100)]

const createDudes = (x, y) => {
  let i = increment
  while (i--) {
    if (dudes.length >= pool.length) {
      break
    }

    dudes.push(new Dude(x + random(-10, 10), y + random(-10, 10)))
  }

  text.text = `Count: ${dudes.length}`
}

let isDown = false
container.on('pointerdown', event => {
  const { x, y } = event.data.getLocalPosition(container)
  isDown = [x, y]
})
container.on('pointermove', event => {
  const { x, y } = event.data.getLocalPosition(container)
  if (isDown) {
    isDown = [x, y]
  }
})
container.on('pointerup', event => {
  isDown = false
})

const render = () => {
  stats.begin()

  let i = dudes.length
  while (i--) {
    const dude = dudes[i]
    const sprite = pool.get(i)
    sprite.visible = true
    sprite.position.x = dude.position.x
    sprite.position.y = dude.position.y
  }

  stats.end()
}

const updateAll = () => {
  let i = dudes.length
  while (i--) {
    const dude = dudes[i]
    update(dude)
  }

  if (isDown) {
    createDudes(...isDown)
  }
}

app.ticker.add(render)
app.ticker.add(updateAll)

window.pool = pool
window.dudes = dudes
window.container = container
window.app = app
