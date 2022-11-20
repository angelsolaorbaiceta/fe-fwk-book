import { afterEach, expect, test } from 'vitest'
import { h, hFragment, hString } from '../h'
import { mountDOM } from '../mount-dom'

afterEach(() => {
  document.body.innerHTML = ''
})

test("can't mount an element without a host element", () => {
  const vdom = h('div', {}, [hString('hello')])
  expect(() => mountDOM(vdom)).toThrow()
})

test('mount a text element in a host element', () => {
  const vdom = hString('hello')
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('hello')
})

test('mount an element in a host element', () => {
  const vdom = h('div', {}, [hString('hello')])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div>hello</div>')
})

test('mount a fragment in a host element', () => {
  const vdom = hFragment([hString('hello, '), hString('world')])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('hello, world')
})
