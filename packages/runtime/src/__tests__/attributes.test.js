import { beforeEach, describe, expect, test } from 'vitest'
import { removeAttribute, setAttributes } from '../attributes'

let el

beforeEach(() => {
  el = document.createElement('div')
})

test('setting a class from a string', () => {
  setAttributes(el, { class: 'foo bar' })
  expect(el.className).toBe('foo bar')
})

test('setting a class from an array', () => {
  setAttributes(el, { class: ['foo', 'bar'] })
  expect(el.className).toBe('foo bar')
})

test('updating the class', () => {
  setAttributes(el, { class: 'foo' })
  setAttributes(el, { class: 'bar baz' })

  expect(el.className).toBe('bar baz')
})

test('setting styles', () => {
  setAttributes(el, { style: { color: 'red', backgroundColor: 'blue' } })

  expect(el.style.color).toBe('red')
  expect(el.style.backgroundColor).toBe('blue')
})

test('updating styles', () => {
  setAttributes(el, { style: { color: 'red' } })
  setAttributes(el, { style: { backgroundColor: 'blue' } })

  expect(el.style.color).toBe('red')
  expect(el.style.backgroundColor).toBe('blue')
})

test.each([
  { name: 'hidden', value: true, expected: true },
  { name: 'hidden', value: false, expected: false },
  { name: 'hidden', value: null, expected: false },
  { name: 'tabIndex', value: 1, expected: 1 },
  { name: 'tabIndex', value: null, expected: 0 },
])(`setting $name attribute to $value`, ({ name, value, expected }) => {
  setAttributes(el, { [name]: value })
  expect(el[name]).toBe(expected)
})

describe('attributes of an <input type="text">', () => {
  let input

  beforeEach(() => {
    input = document.createElement('input')
    input.type = 'text'
  })

  test.each([
    { name: 'value', values: ['foo', 'bar'], whenRemoved: '' },
    {
      name: 'placeholder',
      values: ['foo', 'bar'],
      whenRemoved: '',
    },
    { name: 'disabled', values: [true, false], whenRemoved: false },
    { name: 'required', values: [true, false], whenRemoved: false },
    { name: 'readonly', values: [true, false], whenRemoved: null },
    { name: 'minlength', values: [1, 2], whenRemoved: null },
    { name: 'maxlength', values: [1, 2], whenRemoved: null },
    { name: 'size', values: [1, 2], whenRemoved: 20 },
    {
      name: 'autocomplete',
      values: ['on', 'off', 'new-password', 'current-password', 'one'],
      whenRemoved: '',
    },
  ])(`"$name" attribute`, ({ name, values, whenRemoved }) => {
    for (const value of values) {
      setAttributes(input, { [name]: value })
      expect(input[name]).toBe(value)
    }

    removeAttribute(input, name)
    expect(input[name]).toBe(whenRemoved)
  })
})

test.each([
  {
    type: 'number',
    attribute: 'value',
    values: ['12', '24'],
    expectedWhenRemoved: '',
  },
  {
    type: 'checkbox',
    attribute: 'checked',
    values: [true, false],
    expectedWhenRemoved: false,
  },
  {
    type: 'radio',
    attribute: 'checked',
    values: [true, false],
    expectedWhenRemoved: false,
  },
])(
  'setting the <input type="$type" /> "$attribute" attribute',
  ({ type, attribute, values, expectedWhenRemoved }) => {
    const input = document.createElement('input')
    input.type = type

    for (const value of values) {
      setAttributes(input, { [attribute]: value })
      expect(input[attribute]).toBe(value)
    }

    removeAttribute(input, attribute)
    expect(input[attribute]).toBe(expectedWhenRemoved)
  }
)
