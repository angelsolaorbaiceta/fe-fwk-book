import { expect, test } from 'vitest'
import { TemplateCompiler } from '../compile'
import { singleJSLine } from './utils'

const compiler = new TemplateCompiler()

test('Compile and empty <div> element', () => {
  const { code, imports } = compiler.compile('<div></div>')

  expect(imports).toEqual(new Set(['h']))
  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ ]) )
    }`)
})

test('Compile element with text content', () => {
  const { code, imports } = compiler.compile('<div>Hello World</div>')

  expect(imports).toEqual(new Set(['h', 'hString']))
  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ hString('Hello World') ]) )
    }`)
})

test('Compile two contiguous elements inside a fragment', () => {
  const { code, imports } = compiler.compile('<div></div><p></p>')

  expect(imports).toEqual(new Set(['h', 'hFragment']))
  expect(code).toBe(singleJSLine`
    function render() {
      return ( h(Fragment, {}, [ 
        h('div', {}, [ ]), 
        h('p', {}, [ ]) 
      ]) )
    }`)
})

test('Compile nested elements', () => {
  const { code, imports } = compiler.compile('<div><p>Hello</p></div>')

  expect(imports).toEqual(new Set(['h', 'hString']))
  expect(code).toBe(singleJSLine`
    function render() {
      return ( h('div', {}, [ 
        h('p', {}, [ hString('Hello') ]) 
      ]) )
    }`)
})
