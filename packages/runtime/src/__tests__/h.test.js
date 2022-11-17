import { test, expect } from 'vitest'
import { h, hString, hFragment, DOM_TYPES } from '../h'

test('create a string vNode', () => {
  const vNode = hString('test')

  expect(vNode).toEqual({
    type: DOM_TYPES.TEXT,
    value: 'test',
  })
})

test('create an element vNode', () => {
  const tag = 'div'
  const props = { id: 'test' }
  const children = [hString('test')]

  const vNode = h(tag, props, children)

  expect(vNode).toEqual({
    tag,
    props,
    children: [{ type: DOM_TYPES.TEXT, value: 'test' }],
    type: DOM_TYPES.ELEMENT,
  })
})

test('create a component vNode', () => {
  class TestComponent {}
  const props = { id: 'test' }
  const children = [hString('test')]

  const vNode = h(TestComponent, props, children)

  expect(vNode).toEqual({
    tag: TestComponent,
    props,
    children: [{ type: DOM_TYPES.TEXT, value: 'test' }],
    type: DOM_TYPES.COMPONENT,
  })
})

test('create a fragment vNode', () => {
  const children = [h('div', { class: 'foo' }, [])]
  const props = { id: 'test' }
  const vNode = hFragment(children, props)

  expect(vNode).toEqual({
    type: DOM_TYPES.FRAGMENT,
    children: [
      {
        type: DOM_TYPES.ELEMENT,
        tag: 'div',
        props: { class: 'foo', ...props },
        children: [],
      },
    ],
  })
})

test('fragment props are not added to text nodes', () => {
  const children = [hString('test')]
  const props = { id: 'test' }

  const vNode = hFragment(children, props)

  expect(vNode).toEqual({
    type: DOM_TYPES.FRAGMENT,
    children: [{ type: DOM_TYPES.TEXT, value: 'test' }],
  })
})
