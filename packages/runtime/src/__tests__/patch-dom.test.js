import { beforeEach, describe, expect, test, vi } from 'vitest'
import { h, hFragment, hString } from '../h'
import { mountDOM } from '../mount-dom'
import { patchDOM } from '../patch-dom'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('no change', () => {
  const oldVdom = h('div', {}, ['hello'])
  const newVdom = h('div', {}, ['hello'])

  const vdom = patch(oldVdom, newVdom)

  expect(document.body.innerHTML).toEqual('<div>hello</div>')
  expect(newVdom.el).toBe(vdom.el)
})

test('change the root node', () => {
  const oldVdom = h('div', {}, ['hello'])
  const newVdom = h('span', {}, ['hello'])

  const vdom = patch(oldVdom, newVdom)

  expect(document.body.innerHTML).toEqual('<span>hello</span>')
  expect(vdom.el).toBeInstanceOf(HTMLSpanElement)
  expect(newVdom.el).toBe(vdom.el)
})

test('change the root node, mount in same index', () => {
  const staticVdom = h('p', {}, ['bye'])
  mountDOM(staticVdom, document.body)

  const oldVdom = h('div', {}, ['hello'])
  const newVdom = h('span', {}, ['hello'])
  mountDOM(oldVdom, document.body, 0)
  patchDOM(oldVdom, newVdom, document.body)

  expect(document.body.innerHTML).toEqual('<span>hello</span><p>bye</p>')
})

test('sets the el in the new vdom', () => {
  const oldVdom = h('div', {}, ['hello'])
  const newVdom = h('div', {}, ['hello'])

  const vdom = patch(oldVdom, newVdom)

  expect(newVdom.el).toBe(vdom.el)
})

test('patch text', () => {
  const oldVdom = hString('foo')
  const newVdom = hString('bar')

  patch(oldVdom, newVdom)

  expect(document.body.innerHTML).toEqual('bar')
})

describe('patch fragments', () => {
  test('nested fragments, add child', () => {
    const oldVdom = hFragment([hFragment([hString('foo')])])
    const newVdom = hFragment([
      hFragment([hString('foo'), hString('bar')]),
      h('p', {}, ['baz']),
    ])

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('foobar<p>baz</p>')
  })

  test('nested fragments, add child at index', () => {
    const oldVdom = hFragment([
      hString('A'),
      hFragment([hString('B'), hString('C')]),
    ])
    const newVdom = hFragment([
      hFragment([hString('X')]),
      hString('A'),
      hFragment([hString('B'), hFragment([hString('Y')]), hString('C')]),
    ])

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('XABYC')
  })
})

describe('patch attributes', () => {
  test('add attribute', () => {
    const oldVdom = h('div', {})
    const newVdom = h('div', { id: 'foo' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('<div id="foo"></div>')
  })

  test('remove attribute', () => {
    const oldVdom = h('div', { id: 'foo' })
    const newVdom = h('div', {})

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('<div></div>')
  })

  test('update the value of an attribute', () => {
    const oldVdom = h('div', { id: 'foo' })
    const newVdom = h('div', { id: 'bar' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('<div id="bar"></div>')
  })
})

describe('patch class', () => {
  test('from empty string to string', () => {
    // Need to prevent an empty class to be removed from the classList (that throws an error)
    // `SyntaxError: The token provided must not be empty.`
    const oldVdom = h('div', { class: '' })
    const newVdom = h('div', { class: 'foo' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('<div class="foo"></div>')
  })

  test('from string to empty string', () => {
    // Need to prevent an empty class to be removed from the classList (that throws an error)
    // `SyntaxError: The token provided must not be empty.`
    const oldVdom = h('div', { class: 'foo' })
    const newVdom = h('div', { class: '' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('<div class=""></div>')
  })

  test('from no class to string', () => {
    const oldVdom = h('div', {})
    const newVdom = h('div', { class: 'foo' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('<div class="foo"></div>')
  })

  test('from string to no class', () => {
    const oldVdom = h('div', { class: 'foo' })
    const newVdom = h('div', {})

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toEqual('<div class=""></div>')
  })

  test('change string value', () => {
    const oldVdom = h('div', { class: 'foo' })
    const newVdom = h('div', { class: 'bar' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div class="bar"></div>')
  })

  test('from a string to an array of classes', () => {
    const oldVdom = h('div', { class: 'foo' })
    const newVdom = h('div', { class: ['foo', 'bar'] })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div class="foo bar"></div>')
  })

  test('from an array of classes to a string', () => {
    const oldVdom = h('div', { class: ['foo', 'bar'] })
    const newVdom = h('div', { class: 'foo' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div class="foo"></div>')
  })

  test('from an array of classes to a string', () => {
    const oldVdom = h('div', { class: ['foo', 'bar'] })
    const newVdom = h('div', { class: 'foo' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div class="foo"></div>')
  })

  test('add class to array', () => {
    const oldVdom = h('div', { class: ['foo'] })
    const newVdom = h('div', { class: ['foo', 'bar'] })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div class="foo bar"></div>')
  })

  test('remove class from array', () => {
    const oldVdom = h('div', { class: ['foo', 'bar'] })
    const newVdom = h('div', { class: ['foo'] })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div class="foo"></div>')
  })

  test('add class to string', () => {
    const oldVdom = h('div', { class: 'foo' })
    const newVdom = h('div', { class: 'foo bar' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div class="foo bar"></div>')
  })

  test('remove class from string', () => {
    const oldVdom = h('div', { class: 'foo bar' })
    const newVdom = h('div', { class: 'foo' })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div class="foo"></div>')
  })
})

describe('patch style', () => {
  test('add a new style', () => {
    const oldVdom = h('div')
    const newVdom = h('div', { style: { color: 'red' } })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div style="color: red;"></div>')
  })

  test('remove a style', () => {
    const oldVdom = h('div', { style: { color: 'red' } })
    const newVdom = h('div')

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div style=""></div>')
  })

  test('change a style', () => {
    const oldVdom = h('div', { style: { color: 'red' } })
    const newVdom = h('div', { style: { color: 'blue' } })

    patch(oldVdom, newVdom)

    expect(document.body.innerHTML).toBe('<div style="color: blue;"></div>')
  })
})

describe('patch event handlers', () => {
  test('update event handler', () => {
    const oldHandler = vi.fn()
    const oldVdom = h('button', { on: { click: oldHandler } }, ['Click me'])
    const newHandler = vi.fn()
    const newVdom = h('button', { on: { click: newHandler } }, ['Click me'])

    patch(oldVdom, newVdom)

    document.body.querySelector('button').click()

    expect(oldHandler).not.toHaveBeenCalled()
    expect(newHandler).toHaveBeenCalled()
    expect(newVdom.listeners).not.toBeUndefined()
  })

  test('remove event handler', () => {
    const oldHandler = vi.fn()
    const oldVdom = h('button', { on: { click: oldHandler } }, ['Click me'])
    const newVdom = h('button', {}, ['Click me'])

    patch(oldVdom, newVdom)

    document.body.querySelector('button').click()

    expect(oldHandler).not.toHaveBeenCalled()
    expect(newVdom.listeners).toStrictEqual({})
  })
})

describe('patch children', () => {
  describe('text vnode', () => {
    test('added at the end', () => {
      const oldVdom = h('div', {}, ['A'])
      const newVdom = h('div', {}, ['A', 'B'])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div>AB</div>')
    })

    test('added at the beginning', () => {
      const oldVdom = h('div', {}, ['B'])
      const newVdom = h('div', {}, ['A', 'B'])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div>AB</div>')
    })

    test('added in the middle', () => {
      const oldVdom = h('div', {}, ['A', 'B'])
      const newVdom = h('div', {}, ['A', 'B', 'C'])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div>ABC</div>')
    })

    test('removed from the end', () => {
      const oldVdom = h('div', {}, ['A', 'B'])
      const newVdom = h('div', {}, ['A'])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div>A</div>')
    })

    test('removed from the beginning', () => {
      const oldVdom = h('div', {}, ['A', 'B'])
      const newVdom = h('div', {}, ['B'])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div>B</div>')
    })

    test('removed from the middle', () => {
      const oldVdom = h('div', {}, ['A', 'B', 'C'])
      const newVdom = h('div', {}, ['A', 'C'])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div>AC</div>')
    })

    test('changed', () => {
      const oldVdom = h('div', {}, ['A'])
      const newVdom = h('div', {}, ['B'])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div>B</div>')
    })

    test('moved around', () => {
      const oldVdom = h('div', {}, ['A', 'B', 'C'])
      const newVdom = h('div', {}, ['C', 'A', 'B'])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div>CAB</div>')
    })
  })

  describe('element vnode', () => {
    test('added at the end', () => {
      const oldVdom = h('div', {}, [h('span', {}, ['A'])])
      const newVdom = h('div', {}, [
        h('span', {}, ['A']),
        h('span', { id: 'b' }, ['B']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<div><span>A</span><span id="b">B</span></div>'
      )
    })

    test('added at the beginning', () => {
      const oldVdom = h('div', {}, [h('span', {}, ['B'])])
      const newVdom = h('div', {}, [
        h('span', { id: 'a' }, ['A']),
        h('span', {}, ['B']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<div><span id="a">A</span><span>B</span></div>'
      )
    })

    test('added in the middle', () => {
      const oldVdom = h('div', {}, [
        h('span', {}, ['A']),
        h('span', {}, ['C']),
      ])
      const newVdom = h('div', {}, [
        h('span', {}, ['A']),
        h('span', { id: 'b' }, ['B']),
        h('span', {}, ['C']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<div><span>A</span><span id="b">B</span><span>C</span></div>'
      )
    })

    test('removed from the end', () => {
      const oldVdom = h('div', {}, [
        h('span', {}, ['A']),
        h('span', {}, ['B']),
      ])
      const newVdom = h('div', {}, [h('span', {}, ['A'])])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div><span>A</span></div>')
    })

    test('removed from the beginning', () => {
      const oldVdom = h('div', {}, [
        h('span', {}, ['A']),
        h('span', {}, ['B']),
      ])
      const newVdom = h('div', {}, [h('span', {}, ['B'])])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<div><span>B</span></div>')
    })

    test('removed from the middle', () => {
      const oldVdom = h('div', {}, [
        h('span', {}, ['A']),
        h('span', {}, ['B']),
        h('span', {}, ['C']),
      ])
      const newVdom = h('div', {}, [
        h('span', {}, ['A']),
        h('span', {}, ['C']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<div><span>A</span><span>C</span></div>'
      )
    })

    test('moved around', () => {
      const oldVdom = h('div', {}, [
        h('span', {}, ['A']),
        h('span', {}, ['B']),
        h('span', {}, ['C']),
      ])
      const newVdom = h('div', {}, [
        h('span', {}, ['C']),
        h('span', {}, ['A']),
        h('span', {}, ['B']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<div><span>C</span><span>A</span><span>B</span></div>'
      )
    })
  })

  describe('fragment vnode', () => {
    test('add element at the end', () => {
      const oldVdom = hFragment([h('span', {}, ['A'])])
      const newVdom = hFragment([
        h('span', {}, ['A']),
        h('span', { id: 'b' }, ['B']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<span>A</span><span id="b">B</span>'
      )
    })

    test('add element at the beginning', () => {
      const oldVdom = hFragment([h('span', {}, ['B'])])
      const newVdom = hFragment([
        h('span', { id: 'a' }, ['A']),
        h('span', {}, ['B']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<span id="a">A</span><span>B</span>'
      )
    })

    test('add element in the middle', () => {
      const oldVdom = hFragment([
        h('span', {}, ['A']),
        h('span', {}, ['C']),
      ])
      const newVdom = hFragment([
        h('span', {}, ['A']),
        h('span', { id: 'b' }, ['B']),
        h('span', {}, ['C']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<span>A</span><span id="b">B</span><span>C</span>'
      )
    })

    test('remove element from the end', () => {
      const oldVdom = hFragment([
        h('span', {}, ['A']),
        h('span', {}, ['B']),
      ])
      const newVdom = hFragment([h('span', {}, ['A'])])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<span>A</span>')
    })

    test('remove element from the beginning', () => {
      const oldVdom = hFragment([
        h('span', {}, ['A']),
        h('span', {}, ['B']),
      ])
      const newVdom = hFragment([h('span', {}, ['B'])])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<span>B</span>')
    })

    test('remove element from the middle', () => {
      const oldVdom = hFragment([
        h('span', {}, ['A']),
        h('span', {}, ['B']),
        h('span', {}, ['C']),
      ])
      const newVdom = hFragment([
        h('span', {}, ['A']),
        h('span', {}, ['C']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<span>A</span><span>C</span>')
    })

    test('append fragment', () => {
      const oldVdom = hFragment([h('span', {}, ['A'])])
      const newVdom = hFragment([
        h('span', {}, ['A']),
        hFragment([h('span', {}, ['B'])]),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe('<span>A</span><span>B</span>')
    })

    test('move children around', () => {
      const oldVdom = hFragment([
        h('span', {}, ['A']),
        h('span', {}, ['B']),
        h('span', {}, ['C']),
      ])
      const newVdom = hFragment([
        h('span', {}, ['C']),
        h('span', {}, ['A']),
        h('span', {}, ['B']),
      ])

      patch(oldVdom, newVdom)

      expect(document.body.innerHTML).toBe(
        '<span>C</span><span>A</span><span>B</span>'
      )
    })
  })
})

function patch(oldVdom, newVdom) {
  mountDOM(oldVdom, document.body)
  return patchDOM(oldVdom, newVdom, document.body)
}
