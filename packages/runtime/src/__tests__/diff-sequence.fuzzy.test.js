import { expect, test } from 'vitest'
import {
  applyArraysDiffSequence,
  arraysDiffSequence,
} from '../utils/arrays'

const options = ['a', 'b', 'c', 'd', 'e', 'f']

function generateRandomArray(min = 10, max = 50) {
  const length = Math.floor(Math.random() * (max - min)) + min
  const array = []

  for (let i = 0; i < length; i++) {
    array.push(options[Math.floor(Math.random() * options.length)])
  }

  return array
}

function generateRandomArrayPair(min = 10, max = 50) {
  const oldArray = generateRandomArray(min, max)
  const newArray = generateRandomArray(min, max)

  return [oldArray, newArray]
}

const testData = Array.from({ length: 50 }, generateRandomArrayPair)

test.each(testData)(
  '(fuzzy) arrays diff sequence',
  (oldArray, newArray) => {
    const sequence = arraysDiffSequence(oldArray, newArray)
    const actual = applyArraysDiffSequence(oldArray, sequence)

    expect(actual).toEqual(newArray)
  }
)
