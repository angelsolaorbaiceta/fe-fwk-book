import { beforeEach, expect, test, vi } from 'vitest'
import { destroyDOM } from '../destroy-dom'
import { h, hFragment, hString } from '../h'
import { mountDOM } from '../mount-dom'
import { defineComponent } from '../component'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('destroy a text element', async () => {
  const vdom = hString('hello')

  await mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe('hello')
  expect(vdom.el).toBeInstanceOf(Text)

  await destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

test('destroy an html element and its children', async () => {
  const vdom = h('div', {}, [hString('hello')])

  await mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe('<div>hello</div>')
  expect(vdom.el).toBeInstanceOf(HTMLDivElement)

  await destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

test('remove an html element event listeners', async () => {
  const handler = vi.fn()
  const vdom = h('button', { on: { click: handler } }, [hString('hello')])

  await mountDOM(vdom, document.body)
  const buttonEl = vdom.el
  buttonEl.click()

  expect(handler).toHaveBeenCalledTimes(1)

  await destroyDOM(vdom)
  buttonEl.click()

  expect(handler).toHaveBeenCalledTimes(1)
})

test('destroy an html element and its children recursively', async () => {
  const vdom = h('div', {}, [
    h('p', {}, [hString('hello')]),
    h('span', {}, [hString('world')]),
  ])

  await mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe(
    '<div><p>hello</p><span>world</span></div>'
  )
  expect(vdom.el).toBeInstanceOf(HTMLDivElement)

  await destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

test('destroy a fragment', async () => {
  const vdom = hFragment([
    h('div', {}, [hString('hello')]),
    h('span', {}, [hString('world')]),
  ])

  await mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe('<div>hello</div><span>world</span>')

  await destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

test('destroy a fragment recursively', async () => {
  const vdom = hFragment([
    h('span', {}, ['hello']),
    hFragment([h('span', {}, [hString('world')])]),
  ])

  await mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe(
    '<span>hello</span><span>world</span>'
  )

  await destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

test('destroy a component with subcomponents', async () => {
  const ChildComponent = defineComponent({
    render() {
      return h('p', {}, ['body'])
    },
  })
  const ParentComponent = defineComponent({
    render() {
      return hFragment([h('h1', {}, ['Title']), h(ChildComponent)])
    },
  })
  const vdom = h('div', {}, [h(ParentComponent)])

  await mountDOM(vdom, document.body)
  expect(document.body.innerHTML).toBe(
    '<div><h1>Title</h1><p>body</p></div>'
  )

  await destroyDOM(vdom)
  expect(document.body.innerHTML).toBe('')
  expect(allElementsHaveBeenDestroyed(vdom)).toBe(true)
})

function allElementsHaveBeenDestroyed(vdom) {
  if (vdom.el) {
    return false
  }

  return vdom.children?.every(allElementsHaveBeenDestroyed) ?? true
}
