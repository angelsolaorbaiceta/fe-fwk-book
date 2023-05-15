import { expect, test } from 'vitest'
import { h } from '../h'
import { extractComponentProps } from '../utils/props'

const Component = {}

test('Empty props', () => {
  const { props } = extractComponentProps(h(Component, {}))
  expect(props).toEqual({})
})

test('Empty events', () => {
  const { events } = extractComponentProps(h(Component, {}))
  expect(events).toEqual({})
})

test('The key prop is ignored', () => {
  const { props } = extractComponentProps(h(Component, { key: 'test' }))
  expect(props).toEqual({})
})

test('The data- attributes are ignored', () => {
  const { props } = extractComponentProps(
    h(Component, { 'data-test': 'test' })
  )
  expect(props).toEqual({})
})

test('Extract props', () => {
  const expected = { id: 'test', name: 'foo', age: 42 }
  const { props } = extractComponentProps(h(Component, expected))
  expect(props).toEqual(expected)
})

test('Extract events', () => {
  const expected = { click: () => {}, dblclick: () => {} }
  const { events } = extractComponentProps(h(Component, { on: expected }))
  expect(events).toEqual(expected)
})
