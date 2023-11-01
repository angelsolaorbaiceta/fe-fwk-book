import { expect, test } from 'vitest'
import { compileTemplate } from '../compile'
import { singleJSLine, toSingleJSLine } from './utils'

test('Compile for loop iterating the elements of an array', () => {
  const { code } = compileTemplate(
    '<ul><li @for="item of state.items">{{ item }}</li></ul>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return (
        h('ul', {}, this.state.items.map((item) => h('li', {}, [ hString(\`\${item}\`) ])))
      )
    }`)
})

test('Compile for loop iterating the elements of an array with index', () => {
  const { code } = compileTemplate(
    '<ul><li @for="(item, index) of state.items">{{ item }} at {{ index }}</li></ul>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('ul', {},
        this.state.items.map((item, index) => h('li', {}, [ hString(\`\${item} at \${index}\`) ])) 
      ))
    }`)
})

test('Compile for loop iterating the elements of an array returned by a method', () => {
  const { code } = compileTemplate(
    '<ul><li @for="item of getItems()">{{ item }}</li></ul>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('ul', {},
        this.getItems().map((item) => h('li', {}, [ hString(\`\${item}\`) ])) 
      ))
    }`)
})

test('Compile for loop iterating an array, with a key', () => {
  const { code } = compileTemplate(
    '<ul><li @for="item of state.items" [key]="item.id">{{ item }}</li></ul>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('ul', {},
        this.state.items.map((item) => h('li', { key: item.id }, [ hString(\`\${item}\`) ])) 
      ))
    }`)
})

test('Compile for loop iterating the items and values of an object', () => {
  const { code } = compileTemplate(
    '<ul><li @for="(key, value) in state.items">{{ key }}: {{ value }}</li></ul>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('ul', {},
        Object.entries(this.state.items).map(([key, value]) => h('li', {}, [ hString(\`\${key}: \${value}\`) ])) 
      ))
    }`)
})

test('Compile for loop iterating the items and values of an object returned by a method', () => {
  const { code } = compileTemplate(
    '<ul><li @for="(key, value) in getItems()">{{ key }}: {{ value }}</li></ul>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('ul', {},
        Object.entries(this.getItems()).map(([key, value]) => h('li', {}, [ hString(\`\${key}: \${value}\`) ])) 
      ))
    }`)
})

test('Compile for loop iterating an object with a key', () => {
  const { code } = compileTemplate(
    '<ul><li @for="(key, value) in state.items" [key]="key">{{ value }}</li></ul>'
  )

  expect(toSingleJSLine(code)).toBe(singleJSLine`
    function render() {
      return ( h('ul', {},
        Object.entries(this.state.items).map(([key, value]) => h('li', { key: key }, [ hString(\`\${value}\`) ])) 
      ))
    }`)
})
