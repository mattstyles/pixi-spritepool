import {SpritePool} from './index'

test('Should allocate a list of sprites', () => {
  const length = 5
  const pool = SpritePool.of({
    length: length,
  })

  expect(pool.length).toEqual(length)
})
