import { expect, test } from 'vitest'
import { assert } from '../utils/assert'

test('assert throws when condition is false', () => {
  expect(() => assert(false, 'msg')).toThrow('msg')
})

test('assert does not throw when condition is true', () => {
  expect(() => assert(true, 'msg')).not.toThrow()
})
