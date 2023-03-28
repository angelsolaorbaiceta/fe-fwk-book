import { test, expect } from 'vitest'
import { h, hString, hFragment, DOM_TYPES, extractChildren } from '../h'

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

test('h() filters null children', () => {
  const tag = 'div'
  const props = { id: 'test' }
  const children = [hString('test'), null]

  const vNode = h(tag, props, children)

  expect(vNode).toEqual({
    tag,
    props,
    children: [{ type: DOM_TYPES.TEXT, value: 'test' }],
    type: DOM_TYPES.ELEMENT,
  })
})

test('h() maps strings to text vNodes', () => {
  const vNode = h('div', {}, ['test'])
  expect(vNode).toEqual({
    tag: 'div',
    props: {},
    children: [{ type: DOM_TYPES.TEXT, value: 'test' }],
    type: DOM_TYPES.ELEMENT,
  })
})

test('create a fragment vNode', () => {
  const children = [h('div', { class: 'foo' }, [])]
  const vNode = hFragment(children)

  expect(vNode).toEqual({
    type: DOM_TYPES.FRAGMENT,
    children: [
      {
        type: DOM_TYPES.ELEMENT,
        tag: 'div',
        props: { class: 'foo' },
        children: [],
      },
    ],
  })
})

test('hFragment() filters null children', () => {
  const children = [h('div', { class: 'foo' }, []), null]
  const vNode = hFragment(children)

  expect(vNode).toEqual({
    type: DOM_TYPES.FRAGMENT,
    children: [
      {
        type: DOM_TYPES.ELEMENT,
        tag: 'div',
        props: { class: 'foo' },
        children: [],
      },
    ],
  })
})

test('hFragment() maps strings to text vNodes', () => {
  const vNode = hFragment(['test'])
  expect(vNode).toEqual({
    type: DOM_TYPES.FRAGMENT,
    children: [{ type: DOM_TYPES.TEXT, value: 'test' }],
  })
})

test('extract children from a tree with fragments', () => {
  const vNode = h('div', {}, [
    'A',
    hFragment([
      hFragment([hString('B')]),
      hString('C'),
      hFragment([hString('D')]),
    ]),
    'E',
  ])
  const children = extractChildren(vNode)

  expect(children).toEqual([
    { type: DOM_TYPES.TEXT, value: 'A' },
    { type: DOM_TYPES.TEXT, value: 'B' },
    { type: DOM_TYPES.TEXT, value: 'C' },
    { type: DOM_TYPES.TEXT, value: 'D' },
    { type: DOM_TYPES.TEXT, value: 'E' },
  ])
})
