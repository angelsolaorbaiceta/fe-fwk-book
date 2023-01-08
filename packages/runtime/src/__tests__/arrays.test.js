import { describe, expect, test } from 'vitest'
import {
  applyArraysDiffSequence,
  arraysDiffSequence,
  ARRAY_DIFF_OP,
  toArray,
  withoutNulls,
} from '../utils/arrays'

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

describe('diff sequence', () => {
  test('equal arrays', () => {
    const oldArray = [1, 2, 3]
    const newArray = [1, 2, 3]

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.NOOP, from: 1, index: 1 },
      { op: ARRAY_DIFF_OP.NOOP, from: 2, index: 2 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item removed from the beginning', () => {
    const oldArray = ['a', 'b', 'c']
    const newArray = ['b', 'c']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.REMOVE, index: 0, item: 'a' },
      { op: ARRAY_DIFF_OP.NOOP, from: 1, index: 0 },
      { op: ARRAY_DIFF_OP.NOOP, from: 2, index: 1 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item removed from the end', () => {
    const oldArray = ['a', 'b', 'c']
    const newArray = ['a', 'b']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.NOOP, from: 1, index: 1 },
      { op: ARRAY_DIFF_OP.REMOVE, index: 2, item: 'c' },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item removed from the middle', () => {
    const oldArray = ['a', 'b', 'c']
    const newArray = ['a', 'c']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.REMOVE, item: 'b', index: 1 },
      { op: ARRAY_DIFF_OP.NOOP, from: 2, index: 1 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item added at the beginning', () => {
    const oldArray = ['b', 'c']
    const newArray = ['a', 'b', 'c']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.ADD, item: 'a', index: 0 },
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 1 },
      { op: ARRAY_DIFF_OP.NOOP, from: 1, index: 2 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item added at the end', () => {
    const oldArray = ['a', 'b']
    const newArray = ['a', 'b', 'c']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.NOOP, from: 1, index: 1 },
      { op: ARRAY_DIFF_OP.ADD, item: 'c', index: 2 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item added at the middle', () => {
    const oldArray = ['a', 'c']
    const newArray = ['a', 'b', 'c']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.ADD, item: 'b', index: 1 },
      { op: ARRAY_DIFF_OP.NOOP, from: 1, index: 2 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item added in the middle of two equal elements', () => {
    const oldArray = ['a', 'a']
    const newArray = ['a', 'b', 'a']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.ADD, item: 'b', index: 1 },
      { op: ARRAY_DIFF_OP.NOOP, from: 1, index: 2 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item removed from two equal elements (the second is removed)', () => {
    const oldArray = ['b', 'b']
    const newArray = ['b']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.REMOVE, item: 'b', index: 1 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('item removed and new one added in the same place', () => {
    const oldArray = ['a', 'b', 'c']
    const newArray = ['a', 'd', 'c']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.REMOVE, item: 'b', index: 1 },
      { op: ARRAY_DIFF_OP.ADD, item: 'd', index: 1 },
      { op: ARRAY_DIFF_OP.NOOP, from: 2, index: 2 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('two middle items replaced', () => {
    const oldArray = ['a', 'b', 'c', 'd']
    const newArray = ['a', 'X', 'Y', 'd']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 0 },
      { op: ARRAY_DIFF_OP.REMOVE, item: 'b', index: 1 },
      { op: ARRAY_DIFF_OP.ADD, item: 'X', index: 1 },
      { op: ARRAY_DIFF_OP.REMOVE, item: 'c', index: 2 },
      { op: ARRAY_DIFF_OP.ADD, item: 'Y', index: 2 },
      { op: ARRAY_DIFF_OP.NOOP, from: 3, index: 3 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('two items moved', () => {
    const oldArray = ['a', 'b', 'c']
    const newArray = ['b', 'a', 'c']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.MOVE, from: 1, index: 0, item: 'b' },
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 1 },
      { op: ARRAY_DIFF_OP.NOOP, from: 2, index: 2 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  test('remove, add and move', () => {
    const oldArray = ['a', 'b', 'c', 'd']
    const newArray = ['b', 'X', 'd', 'c']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.REMOVE, item: 'a', index: 0 },
      { op: ARRAY_DIFF_OP.NOOP, from: 1, index: 0 },
      { op: ARRAY_DIFF_OP.ADD, item: 'X', index: 1 },
      { op: ARRAY_DIFF_OP.MOVE, item: 'd', from: 3, index: 2 },
      { op: ARRAY_DIFF_OP.NOOP, from: 2, index: 3 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })

  // TODO: ideally, this test should pass, but the algorithm computes a more complex sequence
  test.skip('shuffle items', () => {
    const oldArray = ['a', 'b', 'c']
    const newArray = ['c', 'a', 'b']

    const diffSeq = arraysDiffSequence(oldArray, newArray)

    expect(diffSeq).toEqual([
      { op: ARRAY_DIFF_OP.MOVE, item: 'c', from: 2, index: 0 },
      { op: ARRAY_DIFF_OP.NOOP, from: 0, index: 1 },
      { op: ARRAY_DIFF_OP.MOVE, item: 'b', from: 1, index: 2 },
    ])
    expect(applyArraysDiffSequence(oldArray, diffSeq)).toEqual(newArray)
  })
})
