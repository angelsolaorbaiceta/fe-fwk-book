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

test('Compile for loop iterating the elements of an array with index', () => {
  const { code } = compileTemplate(
    '<ul><li @for="(item, index) of state.items">{{ item }} at {{ index }}</li></ul>'
  )

  expect(code.replace(/\)\s+\)/g, '))')).toBe(singleJSLine`
    function render() {
      return ( h('ul', {}, [ 
        this.state.items.map((item, index) => h('li', {}, [ hString(\`\${item} at \${index}\`) ])) 
      ]))
    }`)
})

test('Compile for loop iterating the elements of an array returned by a method', () => {
  const { code } = compileTemplate(
    '<ul><li @for="item of getItems()">{{ item }}</li></ul>'
  )

  expect(code.replace(/\)\s+\)/g, '))')).toBe(singleJSLine`
    function render() {
      return ( h('ul', {}, [ 
        this.getItems().map((item) => h('li', {}, [ hString(\`\${item}\`) ])) 
      ]))
    }`)
})
