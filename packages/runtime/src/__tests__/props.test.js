import { test, expect } from 'vitest'
import { extractComponentPros } from '../utils/props'
import { h } from '../h'

const Component = {}

test('Empty props', () => {
  const { props } = extractComponentPros(h(Component, {}))
  expect(props).toEqual({})
})

test('Empty events', () => {
  const { events } = extractComponentPros(h(Component, {}))
  expect(events).toEqual({})
})

test('The key prop is ignored', () => {
  const { props } = extractComponentPros(h(Component, { key: 'test' }))
  expect(props).toEqual({})
})

test('The data- attributes are ignored', () => {
  const { props } = extractComponentPros(
    h(Component, { 'data-test': 'test' })
  )
  expect(props).toEqual({})
})

test('Extract props', () => {
  const expected = { id: 'test', name: 'foo', age: 42 }
  const { props } = extractComponentPros(h(Component, expected))
  expect(props).toEqual(expected)
})

test('Extract events', () => {
  const expected = { click: () => {}, dblclick: () => {} }
  const { events } = extractComponentPros(h(Component, { on: expected }))
  expect(events).toEqual(expected)
})
