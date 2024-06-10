import { describe, expect, test } from 'vitest'
import { makeCountMap, mapsDiff } from '../utils/maps.js'

describe('make count map', () => {
  test('empty array', () => {
    expect(makeCountMap([])).toEqual(new Map())
  })

  test('array with one item', () => {
    expect(makeCountMap(['A'])).toEqual(new Map([['A', 1]]))
  })

  test('array without duplicates', () => {
    expect(makeCountMap(['A', 'B', 'C'])).toEqual(
      new Map([
        ['A', 1],
        ['B', 1],
        ['C', 1],
      ])
    )
  })

  test('array with duplicates', () => {
    expect(makeCountMap(['A', 'B', 'A', 'C', 'B', 'B'])).toEqual(
      new Map([
        ['A', 2],
        ['B', 3],
        ['C', 1],
      ])
    )
  })
})

describe('maps diff', () => {
  test('empty maps', () => {
    const oldMap = new Map()
    const newMap = new Map()

    expect(mapsDiff(oldMap, newMap)).toEqual({
      added: [],
      removed: [],
      updated: [],
    })
  })

  test('maps with the same keys and values', () => {
    const oldMap = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const newMap = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])

    expect(mapsDiff(oldMap, newMap)).toEqual({
      added: [],
      removed: [],
      updated: [],
    })
  })

  test('maps with the same keys but different values', () => {
    const oldMap = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const newMap = new Map([
      ['a', 1],
      ['b', 4],
      ['c', 3],
    ])

    expect(mapsDiff(oldMap, newMap)).toEqual({
      added: [],
      removed: [],
      updated: ['b'],
    })
  })

  test('maps with different keys', () => {
    const oldMap = new Map([
      ['a', 1],
      ['b', 2],
      ['c', 3],
    ])
    const newMap = new Map([
      ['a', 1],
      ['b', 2],
      ['d', 3],
    ])

    expect(mapsDiff(oldMap, newMap)).toEqual({
      added: ['d'],
      removed: ['c'],
      updated: [],
    })
  })
})
