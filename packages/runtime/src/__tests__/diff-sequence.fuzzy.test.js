import { expect, test } from 'vitest'
import {
  applyArraysDiffSequence,
  arraysDiffSequence,
} from '../utils/arrays'

const options = ['a', 'b', 'c', 'd', 'e', 'f']
const minSize = 10
const maxSize = 50

function generateRandomArray() {
  const length = Math.floor(Math.random() * (maxSize - minSize)) + minSize
  const array = []

  for (let i = 0; i < length; i++) {
    array.push(options[Math.floor(Math.random() * options.length)])
  }

  return array
}

function generateRandomArrayPair() {
  const oldArray = generateRandomArray()
  const newArray = generateRandomArray()

  return [oldArray, newArray]
}

const testData = Array.from({ length: 50 }, generateRandomArrayPair)

test.each(testData)('arrays diff sequence', (oldArray, newArray) => {
  const sequence = arraysDiffSequence(oldArray, newArray)
  const actual = applyArraysDiffSequence(oldArray, sequence)

  expect(actual).toEqual(newArray)
})
