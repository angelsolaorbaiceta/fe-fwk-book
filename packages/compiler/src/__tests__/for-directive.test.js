import { expect, test } from 'vitest'
import { compileTemplate } from '../compile'
import { singleJSLine } from './utils'

test('Compile for loop iterating the elements of an array', () => {
  const { code } = compileTemplate(
    '<ul><li @for="item of state.items">{{ item }}</li></ul>'
  )

  expect(code.replace(/\)\s+\)/g, '))')).toBe(singleJSLine`
    function render() {
      return ( h('ul', {}, [ 
        this.state.items.map((item) => h('li', {}, [ hString(\`\${item}\`) ])) 
      ]))
    }`)
})
