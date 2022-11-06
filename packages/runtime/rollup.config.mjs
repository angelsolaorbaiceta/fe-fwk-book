import terser from '@rollup/plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
import filesize from 'rollup-plugin-filesize'

export default {
  input: `src/index.js`,
  plugins: [cleanup()],
  output: [
    {
      file: `dist/fe-fwk.js`,
      format: 'esm',
    },
    {
      file: `dist/fe-fwk.min.js`,
      format: 'esm',
      plugins: [terser(), filesize({ showMinifiedSize: false })],
    },
  ],
}
