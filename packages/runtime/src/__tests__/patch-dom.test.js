import { beforeEach, describe, expect, test } from 'vitest'
import { h, hString } from '../h'
import { mountDOM } from '../mount-dom'
import { patchDOM } from '../patch-dom'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('no change', () => {
  const oldVDom = h('div', {}, [hString('hello')])
  const newVDom = h('div', {}, [hString('hello')])

  const vdom = patch(oldVDom, newVDom)

  expect(document.body.innerHTML).toEqual('<div>hello</div>')
  expect(newVDom.el).toBe(vdom.el)
})

test('change the root node', () => {
  const oldVDom = h('div', {}, [hString('hello')])
  const newVDom = h('span', {}, [hString('hello')])

  const vdom = patch(oldVDom, newVDom)

  expect(document.body.innerHTML).toEqual('<span>hello</span>')
  expect(vdom.el).toBeInstanceOf(HTMLSpanElement)
  expect(newVDom.el).toBe(vdom.el)
})

test('sets the el in the new vdom', () => {
  const oldVDom = h('div', {}, ['hello'])
  const newVDom = h('div', {}, ['hello'])

  const vdom = patch(oldVDom, newVDom)

  expect(newVDom.el).toBe(vdom.el)
})

test('patch text', () => {
  const oldVDom = hString('foo')
  const newVDom = hString('bar')

  patch(oldVDom, newVDom)

  expect(document.body.innerHTML).toEqual('bar')
})

describe('patch attributes', () => {
  test('add attribute', () => {
    const oldVDom = h('div', {})
    const newVDom = h('div', { id: 'foo' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toEqual('<div id="foo"></div>')
  })

  test('remove attribute', () => {
    const oldVDom = h('div', { id: 'foo' })
    const newVDom = h('div', {})

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toEqual('<div></div>')
  })

  test('update the value of an attribute', () => {
    const oldVDom = h('div', { id: 'foo' })
    const newVDom = h('div', { id: 'bar' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toEqual('<div id="bar"></div>')
  })
})

describe('patch class', () => {
  test('from empty string to string', () => {
    // Need to prevent an empty class to be removed from the classList (that throws an error)
    // `SyntaxError: The token provided must not be empty.`
    const oldVDom = h('div', { class: '' })
    const newVDom = h('div', { class: 'foo' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toEqual('<div class="foo"></div>')
  })

  test('from string to empty string', () => {
    // Need to prevent an empty class to be removed from the classList (that throws an error)
    // `SyntaxError: The token provided must not be empty.`
    const oldVDom = h('div', { class: 'foo' })
    const newVDom = h('div', { class: '' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toEqual('<div class=""></div>')
  })

  test('from no class to string', () => {
    const oldVDom = h('div', {})
    const newVDom = h('div', { class: 'foo' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toEqual('<div class="foo"></div>')
  })

  test('from string to no class', () => {
    const oldVDom = h('div', { class: 'foo' })
    const newVDom = h('div', {})

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toEqual('<div class=""></div>')
  })

  test('change string value', () => {
    const oldVDom = h('div', { class: 'foo' })
    const newVDom = h('div', { class: 'bar' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div class="bar"></div>')
  })

  test('from a string to an array of classes', () => {
    const oldVDom = h('div', { class: 'foo' })
    const newVDom = h('div', { class: ['foo', 'bar'] })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div class="foo bar"></div>')
  })

  test('from an array of classes to a string', () => {
    const oldVDom = h('div', { class: ['foo', 'bar'] })
    const newVDom = h('div', { class: 'foo' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div class="foo"></div>')
  })

  test('from an array of classes to a string', () => {
    const oldVDom = h('div', { class: ['foo', 'bar'] })
    const newVDom = h('div', { class: 'foo' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div class="foo"></div>')
  })

  test('add class to array', () => {
    const oldVDom = h('div', { class: ['foo'] })
    const newVDom = h('div', { class: ['foo', 'bar'] })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div class="foo bar"></div>')
  })

  test('remove class from array', () => {
    const oldVDom = h('div', { class: ['foo', 'bar'] })
    const newVDom = h('div', { class: ['foo'] })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div class="foo"></div>')
  })

  test('add class to string', () => {
    const oldVDom = h('div', { class: 'foo' })
    const newVDom = h('div', { class: 'foo bar' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div class="foo bar"></div>')
  })

  test('remove class from string', () => {
    const oldVDom = h('div', { class: 'foo bar' })
    const newVDom = h('div', { class: 'foo' })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div class="foo"></div>')
  })
})

describe('patch style', () => {
  test('add a new style', () => {
    const oldVDom = h('div')
    const newVDom = h('div', { style: { color: 'red' } })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div style="color: red;"></div>')
  })

  test('remove a style', () => {
    const oldVDom = h('div', { style: { color: 'red' } })
    const newVDom = h('div')

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div style=""></div>')
  })

  test('change a style', () => {
    const oldVDom = h('div', { style: { color: 'red' } })
    const newVDom = h('div', { style: { color: 'blue' } })

    patch(oldVDom, newVDom)

    expect(document.body.innerHTML).toBe('<div style="color: blue;"></div>')
  })
})

function patch(oldVdom, newVdom) {
  mountDOM(oldVdom, document.body)
  return patchDOM(oldVdom, newVdom, document.body)
}
