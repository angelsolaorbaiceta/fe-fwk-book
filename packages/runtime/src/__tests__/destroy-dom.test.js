import { beforeEach, expect, test, vi } from 'vitest'
import { destroyDOM } from '../destroy-dom'
import { h, hFragment, hString } from '../h'
import { mountDOM } from '../mount-dom'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('destroy a text element', () => {
  const vdom = hString('hello')

  mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe('hello')
  expect(vdom.el).toBeInstanceOf(Text)

  destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

test('destroy an html element and its children', () => {
  const vdom = h('div', {}, [hString('hello')])

  mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe('<div>hello</div>')
  expect(vdom.el).toBeInstanceOf(HTMLDivElement)

  destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

test('remove an html element event listeners', () => {
  const handler = vi.fn()
  const vdom = h('button', { on: { click: handler } }, [hString('hello')])

  mountDOM(vdom, document.body)
  const buttonEl = vdom.el
  buttonEl.click()

  expect(handler).toHaveBeenCalledTimes(1)

  destroyDOM(vdom)
  buttonEl.click()

  expect(handler).toHaveBeenCalledTimes(1)
})

test('destroy an html element and its children recursively', () => {
  const vdom = h('div', {}, [
    h('p', {}, [hString('hello')]),
    h('span', {}, [hString('world')]),
  ])

  mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe(
    '<div><p>hello</p><span>world</span></div>'
  )
  expect(vdom.el).toBeInstanceOf(HTMLDivElement)

  destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

test('destroy a fragment', () => {
  const vdom = hFragment([
    h('div', {}, [hString('hello')]),
    h('span', {}, [hString('world')]),
  ])

  mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe('<div>hello</div><span>world</span>')

  destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

function allElementsHaveBeenDestroyed(vdom) {
  if (vdom.el) {
    return false
  }

  return vdom.children?.every(allElementsHaveBeenDestroyed) ?? true
}
