import { beforeEach, expect, test } from 'vitest'
import { h, hString } from '../h'
import { mountDOM } from '../mount-dom'
import { patchDOM } from '../patch-dom'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('no change', () => {
  const oldVDom = h('div', {}, [hString('hello')])
  const newVDom = h('div', {}, [hString('hello')])

  const vdom = patch(oldVDom, newVDom)

  expect(document.body.innerHTML).toEqual('<div>hello</div>')
  expect(newVDom.el).toBe(vdom.el)
})

test('change the root node', () => {
  const oldVDom = h('div', {}, [hString('hello')])
  const newVDom = h('span', {}, [hString('hello')])

  const vdom = patch(oldVDom, newVDom)

  expect(document.body.innerHTML).toEqual('<span>hello</span>')
  expect(vdom.el).toBeInstanceOf(HTMLSpanElement)
  expect(newVDom.el).toBe(vdom.el)
})

test('patch text', () => {
  const oldVDom = hString('foo')
  const newVDom = hString('bar')

  const vdom = patch(oldVDom, newVDom)

  expect(document.body.innerHTML).toEqual('bar')
  expect(newVDom.el).toBe(vdom.el)
})

function patch(oldVdom, newVdom) {
  mountDOM(oldVdom, document.body)
  return patchDOM(oldVdom, newVdom, document.body)
}
