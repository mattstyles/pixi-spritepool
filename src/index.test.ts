import {SpritePool} from './index'

// @TODO need to run these in a browser really
test('Should allocate a list of sprites', () => {
  const length = 5
  const pool = SpritePool.of({
    length: length,
  })

  expect(pool.length).toEqual(length)
})
