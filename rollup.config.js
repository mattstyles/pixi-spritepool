
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'
import filesize from 'rollup-plugin-filesize'

import pkg from './package.json'

const bubleOptions = {
  exclude: ['node_modules/**'],
  objectAssign: true
}

const umd = {
  name: 'SpritePool',
  file: 'dist/pixi-spritepool.js'
}

export default [
  {
    input: 'src/index.js',
    external: ['pixi.js'],
    output: {
      name: umd.name,
      file: umd.file,
      format: 'umd',
      globals: {
        'pixi.js': 'PIXI'
      },
      sourcemap: true
    },
    plugins: [
      resolve(),
      commonjs(),
      buble(bubleOptions),
      uglify({
        sourcemap: true
      }),
      filesize()
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
      buble(bubleOptions),
      filesize()
    ]
  }
]
