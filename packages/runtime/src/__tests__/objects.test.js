import { expect, test } from 'vitest'
import { objectsDiff } from '../utils/objects'

test('same object, no change', () => {
  const oldObj = { foo: 'bar' }
  const newObj = { foo: 'bar' }
  const { added, removed, updated } = objectsDiff(oldObj, newObj)

  expect(added).toEqual([])
  expect(removed).toEqual([])
  expect(updated).toEqual([])
})

test('add key', () => {
  const oldObj = {}
  const newObj = { foo: 'bar' }
  const { added, removed, updated } = objectsDiff(oldObj, newObj)

  expect(added).toEqual(['foo'])
  expect(removed).toEqual([])
  expect(updated).toEqual([])
})

test('remove key', () => {
  const oldObj = { foo: 'bar' }
  const newObj = {}
  const { added, removed, updated } = objectsDiff(oldObj, newObj)

  expect(added).toEqual([])
  expect(removed).toEqual(['foo'])
  expect(updated).toEqual([])
})

test('update value', () => {
  const arr = [1, 2, 3]
  const oldObj = { foo: 'bar', arr }
  const newObj = { foo: 'baz', arr }
  const { added, removed, updated } = objectsDiff(oldObj, newObj)

  expect(added).toEqual([])
  expect(removed).toEqual([])
  expect(updated).toEqual(['foo'])
})
