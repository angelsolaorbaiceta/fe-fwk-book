import { test, expect } from 'vitest'
import { fillSlots } from '../slots'
import { h, hFragment, hSlot } from '../h'

test('use empty fragment if no content or default content', () => {
  const vdom = h('div', {}, [hSlot()])
  fillSlots(vdom)

  expect(vdom.children).toEqual([hFragment([])])
})

test('set default content if no external content', () => {
  const defaultContent = [h('span', {}, ['Hello'])]
  const vdom = h('div', {}, [hSlot([defaultContent])])

  fillSlots(vdom)

  expect(vdom.children).toEqual([hFragment([defaultContent])])
})

test('set the external content if provided', () => {
  const content = h('span', {}, ['World'])
  const defaultContent = [h('span', {}, ['Hello'])]
  const vdom = h('div', {}, [hSlot([defaultContent])])

  fillSlots(vdom, [content])

  expect(vdom.children).toEqual([hFragment([content])])
})

test('ignores slots whose parent is a component (they are handled by the component)', () => {
  const Comp = function () {}
  const content = h('span', {}, ['World'])
  const vdom = h('div', {}, [h(Comp, {}, [content])])

  fillSlots(vdom)

  expect(vdom.children).toEqual([h(Comp, {}, [content])])
})

test('Returns true if a slot is found', () => {
  const vdom = h('div', {}, [hSlot()])
  const result = fillSlots(vdom)

  expect(result).toBe(true)
})

test('Returns false if no slot is found', () => {
  const vdom = h('div', {}, [])
  const result = fillSlots(vdom)

  expect(result).toBe(false)
})
