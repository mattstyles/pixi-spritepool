
import Stats from 'stats.js'
import fit from 'canvas-fit'
import {
  Container, Sprite, Texture,
  Rectangle, Point, Text, TextStyle,
  autoDetectRenderer
} from 'pixi.js'
import tex from './example.png'

const increment = 200
const maxEntities = 2e4

const stats = new Stats()
stats.showPanel(0)
stats.dom.style.right = '0px'
stats.dom.style.left = 'auto'
document.body.appendChild(stats.dom)

// const dpr = window.devicePixelRatio || 1
const dpr = 1

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
const resizeCanvas = fit(canvas)
// const app = new Application({
//   width: canvas.width,
//   height: canvas.height,
//   backgroundColor: 0x333333,
//   resolution: dpr,
//   view: canvas
// })
const options = {
  width: canvas.width,
  height: canvas.height,
  backgroundColor: 0x333333,
  resolution: dpr,
  view: canvas
}
const renderer = autoDetectRenderer(options)
const stage = new Container()

const viewport = new Rectangle(0, 0, canvas.width, canvas.height)
const container = new Container()
stage.addChild(container)
const resize = () => {
  resizeCanvas()
  renderer.resize(canvas.width, canvas.height)
  viewport.width = canvas.width / dpr
  viewport.height = canvas.height / dpr
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
    this.sprite = new Sprite(texture)
    this.sprite.position.x = x
    this.sprite.position.y = y
    this.sprite.anchor.x = 0.5
    this.sprite.anchor.y = 0.5
    this.sprite.visible = true

    container.addChild(this.sprite)
  }
}

const update = dude => {
  dude.sprite.position.x += dude.speed.x
  dude.sprite.position.y += dude.speed.y
  dude.speed.y += dude.gravity

  if (dude.sprite.position.x > viewport.x + viewport.width) {
    dude.speed.x *= -1
    dude.sprite.position.x = viewport.x + viewport.width
  }

  if (dude.sprite.position.x < viewport.x) {
    dude.speed.x *= -1
    dude.sprite.position.x = viewport.x
  }

  if (dude.sprite.position.y > viewport.y + viewport.height) {
    dude.speed.y *= -0.85
    dude.sprite.position.y = viewport.y + viewport.height

    if (Math.random() > 0.5) {
      dude.speed.y -= random(1, 3)
    }
  }

  if (dude.sprite.position.y < viewport.y) {
    dude.speed.y *= -1
    dude.sprite.position.y = viewport.y
  }
}

const dudes = [new Dude(100, 100)]

const createDudes = (x, y) => {
  let i = increment
  while (i--) {
    if (dudes.length >= maxEntities) {
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

  // let i = dudes.length
  // while (i--) {
  //   const dude = dudes[i]
  //   const sprite = pool.get(i)
  //   // sprite.visible = true
  //   sprite.position.x = dude.position.x
  //   sprite.position.y = dude.position.y
  //
  //   // pool.get(i).position.set(dudes[i].position.x, dudes[i].position.y)
  // }
  let i = dudes.length
  while (i--) {
    update(dudes[i])
  }

  if (isDown) {
    createDudes(...isDown)
  }

  renderer.render(stage)

  stats.end()

  window.requestAnimationFrame(render)
}

// const updateAll = () => {
//   let i = dudes.length
//   while (i--) {
//     update(dudes[i])
//   }
//
//   if (isDown) {
//     createDudes(...isDown)
//   }
// }

render()

// app.ticker.add(render)
// app.ticker.add(updateAll)

// window.pool = pool
window.dudes = dudes
window.container = container
// window.app = app
