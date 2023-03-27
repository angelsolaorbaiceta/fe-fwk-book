import { expect, test } from 'vitest'
import { h, hFragment, hString } from '../h'
import { areNodesEqual } from '../nodes-equal'

test('Two nodes with different types are not equal', () => {
  const nodeOne = h('p', {}, ['foo'])
  const nodeTwo = hString('foo')
  const nodeThree = hFragment([nodeOne, nodeTwo])

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(false)
  expect(areNodesEqual(nodeOne, nodeThree)).toBe(false)
  expect(areNodesEqual(nodeTwo, nodeThree)).toBe(false)
})

test('Two text nodes are always equal', () => {
  const nodeOne = hString('foo')
  const nodeTwo = hString('bar')

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(true)
})

test('Two fragment nodes are always equal', () => {
  const nodeOne = hFragment([hString('foo')])
  const nodeTwo = hFragment([hString('bar')])

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(true)
})

test('Two element nodes are equal if they have the same tag', () => {
  const nodeOne = h('p', {}, ['foo'])
  const nodeTwo = h('p', {}, ['bar'])
  const nodeThree = h('div', {}, ['foo'])

  expect(areNodesEqual(nodeOne, nodeTwo)).toBe(true)
  expect(areNodesEqual(nodeOne, nodeThree)).toBe(false)
})
