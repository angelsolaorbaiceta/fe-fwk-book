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
      return ( h('div', {}, [ hString('Hello World'), ]) )
    }`)
})
