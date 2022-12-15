import { afterEach, expect, test, vi } from 'vitest'
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

test('save the created text element in the vdom', () => {
  const vdom = hString('hello')
  const el = mountDOM(vdom, document.body)

  expect(el).toBeInstanceOf(Text)
  expect(el.textContent).toBe('hello')
  expect(vdom.el).toBe(el)
})

test('mount an element in a host element', () => {
  const vdom = h('div', {}, [hString('hello')])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div>hello</div>')
})

test('save the created element in the vdom', () => {
  const vdom = h('div')
  const el = mountDOM(vdom, document.body)

  expect(el).toBeInstanceOf(HTMLDivElement)
  expect(vdom.el).toBe(el)
})

test("can't mount a fragment without a parent element", () => {
  const vdom = hFragment([hString('hello')])
  expect(() => mountDOM(vdom)).toThrow()
})

test('mount a fragment in a host element', () => {
  const vdom = hFragment([hString('hello, '), hString('world')])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('hello, world')
})

test('mount a fragment inside a host fragment', () => {
  const host = document.createDocumentFragment()
  const vdom = hFragment([hString('hello, '), hString('world')])
  mountDOM(vdom, host)

  expect(host.textContent).toBe('hello, world')
})

test('mount a fragment inside a fragment inside a host element', () => {
  const vdom = hFragment([
    h('p', {}, ['foo']),
    hFragment([h('p', {}, ['bar']), h('p', {}, ['baz'])]),
  ])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<p>foo</p><p>bar</p><p>baz</p>')
})

test('mount fragment with children and attributes', () => {
  const vdom = hFragment([
    h('span', { id: 'foo' }, [hString('hello, ')]),
    h('span', { id: 'bar' }, [hString('world')]),
  ])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe(
    '<span id="foo">hello, </span><span id="bar">world</span>'
  )
})

test('mount an element with id', () => {
  const vdom = h('div', { id: 'foo' })
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div id="foo"></div>')
})

test('mount an element with class', () => {
  const vdom = h('div', { class: 'foo' })
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div class="foo"></div>')
})

test('mount an element with a list of classes', () => {
  const vdom = h('div', { class: ['foo', 'bar'] })
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div class="foo bar"></div>')
})

test('mount an element with event handlers', () => {
  const onClick = vi.fn()
  const vdom = h('div', { on: { click: onClick } })
  mountDOM(vdom, document.body)

  vdom.el?.click()

  expect(onClick).toBeCalledTimes(1)
  expect(onClick).toBeCalledWith(expect.any(MouseEvent))
  expect(vdom.listeners).toEqual({ click: expect.any(Function) })
})

test('mounts an element with styles', () => {
  const vdom = h('div', { style: { color: 'red' } })
  const el = mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div style="color: red;"></div>')
  expect(el.style.color).toBe('red')
})
