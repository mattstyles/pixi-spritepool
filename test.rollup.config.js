
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import buble from 'rollup-plugin-buble'
import builtins from 'rollup-plugin-node-builtins'

// import pkg from './package.json'

export default [
  {
    input: 'src/index.spec.js',
    output: {
      name: 'SpritePool',
      // file: 'test.js',
      format: 'iife'
    },
    plugins: [
      resolve(),
      commonjs(),
      builtins(),
      buble({
        exclude: ['node_modules/**']
      })
    ]
  }
]
