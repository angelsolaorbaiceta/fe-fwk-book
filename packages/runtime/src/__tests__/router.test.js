import { vi, test, expect, afterEach, describe, beforeEach } from 'vitest'
import { HashRouter } from '../router'
import { defineComponent } from '../component'
import { h, hString } from '../h'

const Home = defineComponent({
  render() {
    return h('h1', {}, [hString('Home')])
  },
})
const One = defineComponent({
  render() {
    return h('h1', {}, [hString('One')])
  },
})
const Two = defineComponent({
  render() {
    return h('h1', {}, [hString('Two')])
  },
})
const NotFound = defineComponent({
  render() {
    return h('h1', {}, [hString('Not found')])
  },
})

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/one',
    component: One,
  },
  {
    path: '/two/:userId/page/:pageId',
    component: Two,
  },
]

beforeEach(() => {
  // Stub the `console.warn` method to avoid polluting the test output
  vi.stubGlobal('console', { warn: vi.fn() })
})

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('On initialization', () => {
  test('does not match any route when there are no routes', () => {
    const router = new HashRouter()
    router.init()

    expect(router.matchedRoute).toBeNull()
  })

  test('loads the home page by default when there is one', () => {
    const router = new HashRouter(routes)
    router.init()

    expect(router.matchedRoute.component).toBe(Home)
  })

  test('if there is no hash, it adds one to the URL', () => {
    const router = new HashRouter(routes)
    router.init()

    expect(window.location.hash).toBe('#/')
  })

  test('loads the given page after the hash', () => {
    window.history.pushState({}, '', '/#/one')

    const router = new HashRouter(routes)
    router.init()

    expect(router.matchedRoute.component).toBe(One)
  })
})

describe('When a known route is navigated to', () => {
  let router

  beforeEach(() => {
    router = new HashRouter(routes)
    router.init()
    router.navigateTo('/one')
  })

  test('matches the route', () => {
    expect(router.matchedRoute.component).toBe(One)
    expect(window.location.hash).toBe('#/one')
  })

  test('modifies the URL hash', () => {
    const router = new HashRouter(routes)
    router.navigateTo('/one')

    expect(router.matchedRoute.component).toBe(One)
    expect(window.location.hash).toBe('#/one')
  })
})

describe("When an unknown route is navigated to and there isn't a catch-all route", () => {
  let router

  beforeEach(() => {
    router = new HashRouter(routes)
    router.init()
    router.navigateTo('/unknown')
  })

  test('does not match any route', () => {
    expect(router.matchedRoute).toBeNull()
  })

  test('does not modify the URL hash', () => {
    expect(window.location.hash).toBe('#/')
  })
})

describe('When an unknown route is navigated to and there is a catch-all route', () => {
  let router

  beforeEach(() => {
    router = new HashRouter([
      ...routes,
      {
        path: '*',
        component: NotFound,
      },
    ])
    router.init()
    router.navigateTo('/unknown')
  })

  test('matches the catch-all route', () => {
    expect(router.matchedRoute.component).toBe(NotFound)
  })

  test('keeps the "unknown" route in the URL hash', () => {
    expect(window.location.hash).toBe('#/unknown')
  })
})

describe('When a route with parameters is navigated to', () => {
  let router

  beforeEach(() => {
    router = new HashRouter(routes)
    router.init()
    router.navigateTo('/two/123/page/456')
  })

  test('matches the route', () => {
    expect(router.matchedRoute.component).toBe(Two)
  })

  test('modifies the URL hash', () => {
    expect(window.location.hash).toBe('#/two/123/page/456')
  })

  test('extracts the parameters', () => {
    expect(router.params).toEqual({
      userId: '123',
      pageId: '456',
    })
  })

  describe('and the route is changed to one without parameters', () => {
    beforeEach(() => {
      router.navigateTo('/one')
    })

    test('matches the route', () => {
      expect(router.matchedRoute.component).toBe(One)
    })

    test('the params are cleared', () => {
      expect(router.params).toEqual({})
    })
  })
})

describe('When a route with query parameters is navigated to', () => {
  let router

  beforeEach(() => {
    router = new HashRouter(routes)
    router.init()
    router.navigateTo('/two/123/page/456?foo=bar&baz=qux')
  })

  test('matches the route', () => {
    expect(router.matchedRoute.component).toBe(Two)
  })

  test('modifies the URL hash', () => {
    expect(window.location.hash).toBe('#/two/123/page/456?foo=bar&baz=qux')
  })

  test('extracts the query parameters', () => {
    expect(router.query).toEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })

  describe('and the route is changed to one without query parameters', () => {
    beforeEach(() => {
      router.navigateTo('/one')
    })

    test('matches the route', () => {
      expect(router.matchedRoute.component).toBe(One)
    })

    test('the query params are cleared', () => {
      expect(router.query).toEqual({})
    })
  })
})

describe('When the user writes the URL in the address bar', () => {
  let router

  beforeEach(() => {
    router = new HashRouter(routes)
    router.init()
  })

  test('matches the route', () => {
    browserNavigateTo('/one')

    expect(router.matchedRoute.component).toBe(One)
  })

  test('extracts the parameters', () => {
    browserNavigateTo('/two/123/page/456')

    expect(router.params).toEqual({
      userId: '123',
      pageId: '456',
    })
  })

  test('extracts the query parameters', () => {
    browserNavigateTo('/two/123/page/456?foo=bar&baz=qux')

    expect(router.query).toEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })
})

describe('When the router is destroyed, it stops listening to popstate events', () => {
  let router

  beforeEach(() => {
    router = new HashRouter(routes)
    vi.spyOn(window, 'removeEventListener')
    router.init()
    router.destroy()
  })

  test('removes the event listener', () => {
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function)
    )
  })
})

function browserNavigateTo(path) {
  window.history.pushState({}, '', `/#${path}`)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
