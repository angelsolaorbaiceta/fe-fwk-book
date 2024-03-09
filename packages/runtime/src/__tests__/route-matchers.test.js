import { describe, expect, test } from 'vitest'
import { makeRouteMatcher, validateRoute } from '../route-matchers'

describe('Validate a route', () => {
  test('A route should have a path defined as a string', () => {
    expect(() => validateRoute({})).toThrow('Route path must be a string')
    expect(() => validateRoute({ path: 42 })).toThrow(
      'Route path must be a string'
    )
    expect(() => validateRoute({ path: '/test' })).not.toThrow()
  })

  test('A route should not have an empty path', () => {
    expect(() => validateRoute({ path: '' })).toThrow(
      'Route path must not be empty'
    )
    expect(() => validateRoute({ path: '  ' })).toThrow(
      'Route path must not be empty'
    )
  })

  test('A route path should start with a "/" or be the catch-all route "*" ', () => {
    expect(() => validateRoute({ path: 'test' })).toThrow(
      'Route path must start with a "/" or be the catch-all route "*"'
    )
    expect(() => validateRoute({ path: '/test' })).not.toThrow()
    expect(() => validateRoute({ path: '*' })).not.toThrow()
  })

  test("a redirect can't redirect to itself (avoid infinite loops)", () => {
    expect(() =>
      validateRoute({ path: '/test', redirect: '/test' })
    ).toThrow("A redirect route can't redirect to itself")
  })
})

describe('Make route matcher without parameters', () => {
  const matcher = makeRouteMatcher({ path: '/test' })

  test('creates the route matcher', () => {
    expect(matcher.route).toEqual({ path: '/test' })
    expect(matcher.isRedirect).toBe(false)
  })

  test('check if the path matches the route', () => {
    expect(matcher.checkMatch('/test')).toBe(true)
    expect(matcher.checkMatch('/test/')).toBe(false)
    expect(matcher.checkMatch('/test/123')).toBe(false)
    expect(matcher.checkMatch('/nope')).toBe(false)
  })

  test("can't extract parameters (it's a non-parameter route matcher)", () => {
    expect(matcher.extractParams('/test')).toEqual({})
    expect(matcher.extractParams('/test/123')).toEqual({})
  })

  test('can extract the query', () => {
    expect(matcher.extractQuery('/test?foo=bar')).toEqual({ foo: 'bar' })
    expect(matcher.extractQuery('/test?foo=bar&baz=qux')).toEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })
})

describe('Make redirect route matcher', () => {
  const matcher = makeRouteMatcher({ path: '/test', redirect: '/other' })

  test('creates the route matcher', () => {
    expect(matcher.route).toEqual({ path: '/test', redirect: '/other' })
    expect(matcher.isRedirect).toBe(true)
  })
})

describe('Make route matcher with parameters', () => {
  const matcher = makeRouteMatcher({ path: '/users/:id/foo/:bar' })

  test('creates the route matcher', () => {
    expect(matcher.route).toEqual({ path: '/users/:id/foo/:bar' })
    expect(matcher.isRedirect).toBe(false)
  })

  test('check if the path matches the route', () => {
    expect(matcher.checkMatch('/users/123/foo/456')).toBe(true)
    expect(matcher.checkMatch('/users/123/foo/456/')).toBe(false)
    expect(matcher.checkMatch('/users/123/foo/456/789')).toBe(false)
    expect(matcher.checkMatch('/users/123/foo')).toBe(false)
    expect(matcher.checkMatch('/users/123/bar/456')).toBe(false)
  })

  test('can extract parameters', () => {
    expect(matcher.extractParams('/users/123/foo/456')).toEqual({
      id: '123',
      bar: '456',
    })
  })

  test('can extract the query', () => {
    expect(matcher.extractQuery('/users/123/foo/456?foo=bar')).toEqual({
      foo: 'bar',
    })
    expect(
      matcher.extractQuery('/users/123/foo/456?foo=bar&baz=qux')
    ).toEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })
})
