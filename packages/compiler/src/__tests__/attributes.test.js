import { expect, test } from 'vitest'
import { splitAttributes } from '../attributes'

test('Extract attributes', () => {
  const actual = splitAttributes({
    foo: 'bar',
    baz: 'qux',
  })

  expect(actual).toEqual({
    attributes: {
      foo: 'bar',
      baz: 'qux',
    },
    bindings: {},
    events: {},
    directives: {},
  })
})

test('Extract attribute bindings', () => {
  const actual = splitAttributes({
    '[foo]': 'bar',
    '[baz]': 'qux',
  })

  expect(actual).toEqual({
    attributes: {},
    bindings: {
      foo: 'bar',
      baz: 'qux',
    },
    events: {},
    directives: {},
  })
})

test('Extract events', () => {
  const actual = splitAttributes({
    '(foo)': 'bar(1, 2)',
    '(baz)': 'qux(3, 4)',
  })

  expect(actual).toEqual({
    attributes: {},
    bindings: {},
    events: {
      foo: 'bar(1, 2)',
      baz: 'qux(3, 4)',
    },
    directives: {},
  })
})

test('Extract directives', () => {
  const actual = splitAttributes({
    '@for': 'item of items',
    '@show': 'props.isVisible',
  })

  expect(actual).toEqual({
    attributes: {},
    bindings: {},
    events: {},
    directives: {
      for: 'item of items',
      show: 'props.isVisible',
    },
  })
})
