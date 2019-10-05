
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'

import pkg from './package.json'

export default [
  {
    input: 'src/index.js',
    external: ['pixi.js'],
    output: {
      name: 'SpritePool',
      file: pkg.browser,
      format: 'umd',
      globals: {
        'pixi.js': 'PIXI'
      }
    },
    plugins: [
      resolve(),
      commonjs(),
      buble({
        exclude: ['node_modules/**']
      })
    ]
  },
  {
    input: 'src/index.js',
    external: ['pixi.js'],
    output: [
      {
        file: pkg.main,
        format: 'cjs'
      },
      {
        file: pkg.module,
        format: 'es'
      }
    ],
    plugins: [
      buble({
        exclude: ['node_modules/**']
      })
    ]
  }
]
