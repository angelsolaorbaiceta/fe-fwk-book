import { expect, test } from 'vitest'
import { h, hFragment, hString } from '../h'
import { areNodesEqual } from '../nodes-equal'
import { defineComponent } from '../component'

test('Nodes with different types are not equal', () => {
  const nodeOne = h('p', {}, ['foo'])
  const nodeTwo = hString('foo')
  const nodeThree = hFragment([nodeOne, nodeTwo])

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(false)
  expect(areNodesEqual(nodeOne, nodeThree)).toBe(false)
  expect(areNodesEqual(nodeTwo, nodeThree)).toBe(false)
})

test('Text nodes are always equal', () => {
  const nodeOne = hString('foo')
  const nodeTwo = hString('bar')

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(true)
})

test('Fragment nodes are always equal', () => {
  const nodeOne = hFragment([hString('foo')])
  const nodeTwo = hFragment([hString('bar')])

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(true)
})

test('Element nodes are equal if they have the same tag', () => {
  const nodeOne = h('p', {}, ['foo'])
  const nodeTwo = h('p', {}, ['bar'])
  const nodeThree = h('div', {}, ['foo'])

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(true)
  expect(areNodesEqual(nodeOne, nodeThree)).toBe(false)
})

test('Keyed elements are equal if they have the same tag and key', () => {
  const nodeOne = h('p', { key: 'foo' }, ['foo'])
  const nodeTwo = h('p', { key: 'foo' }, ['bar'])
  const nodeThree = h('p', { key: 'bar' }, ['foo'])

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(true)
  expect(areNodesEqual(nodeOne, nodeThree)).toBe(false)
})

test('Element nodes with different key props are not equal', () => {
  const nodeOne = h('p', { key: 'foo' }, ['foo'])
  const nodeTwo = h('p', { key: 'bar' }, ['bar'])

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(false)
})

test('Component nodes with different components are not equal', () => {
  const ComponentA = defineComponent({})
  const ComponentB = defineComponent({})

  const nodeOne = h(ComponentA, {})
  const nodeTwo = h(ComponentB, {})

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(false)
})

test('Component nodes with the same component are equal (even when the props are different)', () => {
  const Component = defineComponent({})

  const nodeOne = h(Component, { foo: 1 })
  const nodeTwo = h(Component, { bar: 2 })

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(true)
})

test('Component nodes with different key props are not equal', () => {
  const Component = defineComponent({})

  const nodeOne = h(Component, { key: 'foo' })
  const nodeTwo = h(Component, { key: 'bar' })

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(false)
})
