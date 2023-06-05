import { describe, expect, test } from 'vitest'
import { arraysDiff, toArray, withoutNulls } from '../utils/arrays'

test('convert array to array', () => {
  const arr = [1, 2, 3]
  expect(toArray(arr)).toBe(arr)
})

test('convert non-array to array', () => {
  expect(toArray(1)).toEqual([1])
})

test('filter out nulls', () => {
  expect(withoutNulls([1, 2, null, 3])).toEqual([1, 2, 3])
})

describe('arrays diff', () => {
  test('equal arrays', () => {
    const oldArray = [1, 2, 3]
    const newArray = [1, 2, 3]

    expect(arraysDiff(oldArray, newArray)).toEqual({
      added: [],
      removed: [],
    })
  })

  test('item added', () => {
    const oldArray = [1, 2, 3]
    const newArray = [1, 2, 3, 4]

    expect(arraysDiff(oldArray, newArray)).toEqual({
      added: [4],
      removed: [],
    })
  })

  test('item removed', () => {
    const oldArray = [1, 2, 3]
    const newArray = [1, 2]

    expect(arraysDiff(oldArray, newArray)).toEqual({
      added: [],
      removed: [3],
    })
  })

  test('items added and items removed', () => {
    const oldArray = [1, 2, 3]
    const newArray = [1, 2, 4, 5]

    expect(arraysDiff(oldArray, newArray)).toEqual({
      added: [4, 5],
      removed: [3],
    })
  })
})
