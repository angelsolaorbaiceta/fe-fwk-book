import { expect, test } from 'vitest'
import { h } from '../h'
import { extractPropsAndEvents } from '../utils/props'

const Component = {}

test('Empty props', () => {
  const { props } = extractPropsAndEvents(h(Component, {}))
  expect(props).toEqual({})
})

test('Empty events', () => {
  const { events } = extractPropsAndEvents(h(Component, {}))
  expect(events).toEqual({})
})

test('The key prop is ignored', () => {
  const { props } = extractPropsAndEvents(h(Component, { key: 'test' }))
  expect(props).toEqual({})
})

test('Extract props', () => {
  const expected = { id: 'test', name: 'foo', age: 42 }
  const { props } = extractPropsAndEvents(h(Component, expected))
  expect(props).toEqual(expected)
})

test('Extract events', () => {
  const expected = { click: () => {}, dblclick: () => {} }
  const { events } = extractPropsAndEvents(h(Component, { on: expected }))
  expect(events).toEqual(expected)
})
