import { expect, test } from 'vitest'
import { filterNulls, toArray } from '../utils/arrays'

test('convert array to array', () => {
  const arr = [1, 2, 3]
  expect(toArray(arr)).toBe(arr)
})

test('convert non-array to array', () => {
  expect(toArray(1)).toEqual([1])
})

test('filter nulls', () => {
  expect(filterNulls([1, 2, null, 3])).toEqual([1, 2, 3])
})
