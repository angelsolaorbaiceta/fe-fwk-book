import { beforeEach, expect, test, vi } from 'vitest'
import { h, hFragment, hString } from '../h'
import { mountDOM } from '../mount-dom'

beforeEach(() => {
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
  mountDOM(vdom, document.body)
  const el = vdom.el

  expect(el).toBeInstanceOf(Text)
  expect(el.textContent).toBe('hello')
})

test('mount an element in a host element', () => {
  const vdom = h('div', {}, [hString('hello')])
  mountDOM(vdom, document.body)

  expect(document.body.innerHTML).toBe('<div>hello</div>')
})

test('save the created element in the vdom', () => {
  const vdom = h('div')
  mountDOM(vdom, document.body)
  const el = vdom.el

  expect(el).toBeInstanceOf(HTMLDivElement)
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
  mountDOM(vdom, document.body)
  const el = vdom.el

  expect(document.body.innerHTML).toBe('<div style="color: red;"></div>')
  expect(el.style.color).toBe('red')
})

test('where there is a host component, the event handlers are bound to it', async () => {
  const comp = { count: 5 }
  const vdom = hFragment([
    h(
      'button',
      {
        on: {
          // Can't use arrow functions, because their `this` is bound to the
          // lexical scope, and that can't be changed.
          click() {
            this.count++
          },
        },
        id: 'btn-1',
      },
      ['One']
    ),
    h('div', {}, [
      h(
        'button',
        {
          on: {
            // Can't use arrow functions, because their `this` is bound to the
            // lexical scope, and that can't be changed.
            click() {
              this.count++
            },
          },
          id: 'btn-2',
        },
        ['Two']
      ),
    ]),
  ])

  mountDOM(vdom, document.body, null, comp)

  document.querySelector('#btn-1').click()
  expect(comp.count).toBe(6)

  document.querySelector('#btn-2').click()
  expect(comp.count).toBe(7)
})
