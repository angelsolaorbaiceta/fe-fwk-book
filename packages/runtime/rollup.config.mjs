import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import terser from '@rollup/plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
import filesize from 'rollup-plugin-filesize'

export default {
  input: 'src/index.js',
  plugins: [commonjs(), nodeResolve(), cleanup()],
  output: [
    {
      file: 'dist/fe-fwk.js',
      format: 'esm',
      plugins: [filesize()],
    },
    {
      file: 'dist/fe-fwk.min.js',
      format: 'esm',
      plugins: [terser(), filesize()],
    },
  ],
}
