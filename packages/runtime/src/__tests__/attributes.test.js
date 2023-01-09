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

test('setting a "data-" attribute', () => {
  setAttributes(el, { 'data-my-attr': 'foo' })
  expect(el.dataset.myAttr).toBe('foo')
})

test.each([
  { name: 'hidden', value: true, expected: true },
  { name: 'hidden', value: false, expected: false },
  { name: 'tabIndex', value: 1, expected: 1 },
  { name: 'tabIndex', value: null, expected: -1 },
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

  describe.each([
    { name: 'value', values: ['foo', 'bar'], whenRemoved: '' },
    {
      name: 'placeholder',
      values: ['foo', 'bar'],
      whenRemoved: '',
    },
    { name: 'disabled', values: [true, false], whenRemoved: false },
    { name: 'required', values: [true, false], whenRemoved: false },
    { name: 'readOnly', values: [true, false], whenRemoved: false },
    { name: 'minLength', values: [1, 2], whenRemoved: 0 },
    { name: 'maxLength', values: [1, 2], whenRemoved: 524288 },
    { name: 'size', values: [1, 2], whenRemoved: 20 },
    {
      name: 'autocomplete',
      values: ['on', 'off', 'new-password', 'current-password', 'one'],
      whenRemoved: '',
    },
  ])(`"$name" attribute`, ({ name, values, whenRemoved }) => {
    test('setting a value', () => {
      for (const value of values) {
        setAttributes(input, { [name]: value })
        expect(input[name]).toBe(value)
      }
    })

    test('removing the attribute', () => {
      setAttributes(input, { [name]: values[0] })

      removeAttribute(input, name)
      expect(input[name]).toBe(whenRemoved)
    })
  })
})

describe.each([
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
    test('setting a value', () => {
      const input = document.createElement('input')
      input.type = type

      for (const value of values) {
        setAttributes(input, { [attribute]: value })
        expect(input[attribute]).toBe(value)
      }
    })

    test('removing the attribute', () => {
      const input = document.createElement('input')
      input.type = type
      setAttributes(input, { [attribute]: values[0] })

      removeAttribute(input, attribute)
      expect(input[attribute]).toBe(expectedWhenRemoved)
    })
  }
)

describe('the "value" attribute of a <select>', () => {
  let select

  beforeEach(() => {
    select = document.createElement('select')

    const optionFoo = document.createElement('option')
    optionFoo.value = 'foo'
    select.appendChild(optionFoo)

    const optionBar = document.createElement('option')
    optionBar.value = 'bar'
    select.appendChild(optionBar)
  })

  test('setting to a value that exists as an option', () => {
    setAttributes(select, { value: 'foo' })
    expect(select.value).toBe('foo')

    setAttributes(select, { value: 'bar' })
    expect(select.value).toBe('bar')
  })

  test('setting to a value that does not exist as an option', () => {
    setAttributes(select, { value: 'baz' })
    expect(select.value).toBe('')
  })

  test('setting to null', () => {
    setAttributes(select, { value: null })
    expect(select.value).toBe('')
  })

  test('removing it', () => {
    removeAttribute(select, 'value')
    expect(select.value).toBe('')
  })
})

describe.each([
  {
    tag: 'a',
    name: 'href',
    values: ['http://www.foo.com/', 'http://www.bar.es/'],
    whenRemoved: '',
  },
  {
    tag: 'a',
    name: 'target',
    values: ['_blank', '_self'],
    whenRemoved: '',
  },
  { tag: 'a', name: 'download', values: ['foo', 'bar'], whenRemoved: '' },
  { tag: 'a', name: 'rel', values: ['foo', 'bar'], whenRemoved: '' },
  {
    tag: 'button',
    name: 'disabled',
    values: [true, false],
    whenRemoved: false,
  },
  {
    tag: 'span',
    name: 'textContent',
    values: ['foo', 'bar'],
    whenRemoved: '',
  },
])(
  `"$name" attribute of <$tag> element`,
  ({ tag, name, values, whenRemoved }) => {
    test('setting a value', () => {
      const el = document.createElement(tag)

      for (const value of values) {
        setAttributes(el, { [name]: value })
        expect(el[name]).toBe(value)
      }
    })

    test('removing it', () => {
      const el = document.createElement(tag)
      setAttributes(el, { [name]: values[0] })

      removeAttribute(el, name)

      expect(el[name]).toBe(whenRemoved)
    })
  }
)
