import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hString } from '../h'
import { HashRouter } from '../router'
import { flushPromises } from '../utils/promises'

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
  vi.stubGlobal('console', { warn: vi.fn(), log: console.log })
})

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('On initialization', () => {
  test('does not match any route when there are no routes', async () => {
    const router = new HashRouter()
    await router.init()

    expect(router.matchedRoute).toBeNull()
  })

  test('loads the home page by default when there is one', async () => {
    const router = new HashRouter(routes)
    await router.init()

    expect(router.matchedRoute.component).toBe(Home)
  })

  test('if there is no hash, it adds one to the URL', async () => {
    const router = new HashRouter(routes)
    await router.init()

    expect(window.location.hash).toBe('#/')
  })

  test('loads the given page after the hash', async () => {
    window.history.pushState({}, '', '/#/one')

    const router = new HashRouter(routes)
    await router.init()

    expect(router.matchedRoute.component).toBe(One)
  })
})

describe('When a known route is navigated to', () => {
  let router

  beforeEach(async () => {
    router = new HashRouter(routes)
    await router.init()
    await router.navigateTo('/one')
  })

  test('matches the route', () => {
    expect(router.matchedRoute.component).toBe(One)
    expect(window.location.hash).toBe('#/one')
  })

  test('modifies the URL hash', async () => {
    const router = new HashRouter(routes)
    await router.navigateTo('/one')

    expect(router.matchedRoute.component).toBe(One)
    expect(window.location.hash).toBe('#/one')
  })
})

describe("When an unknown route is navigated to and there isn't a catch-all route", () => {
  let router

  beforeEach(async () => {
    router = new HashRouter(routes)
    await router.init()
    await router.navigateTo('/unknown')
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

  beforeEach(async () => {
    router = new HashRouter([
      ...routes,
      {
        path: '*',
        component: NotFound,
      },
    ])
    await router.init()
    await router.navigateTo('/unknown')
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

  beforeEach(async () => {
    router = new HashRouter(routes)
    await router.init()
    await router.navigateTo('/two/123/page/456')
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
    beforeEach(async () => {
      await router.navigateTo('/one')
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

  beforeEach(async () => {
    router = new HashRouter(routes)
    await router.init()
  })

  test('matches the route', async () => {
    await browserNavigateTo('/one')

    expect(router.matchedRoute.component).toBe(One)
  })

  test('extracts the parameters', async () => {
    await browserNavigateTo('/two/123/page/456')

    expect(router.params).toEqual({
      userId: '123',
      pageId: '456',
    })
  })

  test('extracts the query parameters', async () => {
    await browserNavigateTo('/two/123/page/456?foo=bar&baz=qux')

    expect(router.query).toEqual({
      foo: 'bar',
      baz: 'qux',
    })
  })
})

describe('When the router is destroyed, it stops listening to popstate events', () => {
  let router

  beforeEach(async () => {
    router = new HashRouter(routes)
    vi.spyOn(window, 'removeEventListener')
    await router.init()
    router.destroy()
  })

  test('removes the event listener', () => {
    expect(window.removeEventListener).toHaveBeenCalledWith(
      'popstate',
      expect.any(Function)
    )
  })
})

describe('Going back and forward', () => {
  let router
  let listenerFn

  beforeEach(async () => {
    window.removeEventListener('popstate', listenerFn)
    listenerFn = null

    router = new HashRouter(routes)
    await router.init()
  })

  test('can go back', async () => {
    await router.navigateTo('/one')
    await router.navigateTo('/two/123/page/456')

    expect(router.matchedRoute.component).toEqual(Two)

    // subscribe to popstate to check if the router goes back
    listenerFn = vi.fn()
    window.addEventListener('popstate', listenerFn)

    router.back()
    // NOTE: unclear why we need to flush promises twice here...
    await flushPromises()
    await flushPromises()

    expect(listenerFn).toHaveBeenCalled()
  })
})

describe('External functions can be subscribed to route changes', () => {
  let router

  beforeEach(async () => {
    router = new HashRouter(routes)
    await router.init()
  })

  afterEach(() => {
    router.destroy()
  })

  test('when a route is matched for the first time, the previous route is the default route', async () => {
    const subscriber = vi.fn()
    router.subscribe(subscriber)
    await router.navigateTo('/one')

    const expectedPayload = {
      from: { path: '/', component: Home },
      to: { path: '/one', component: One },
      router,
    }

    expect(subscriber).toHaveBeenCalledWith(expectedPayload)
  })

  test('when a new route is matched, the previous and new route are passed as arguments', async () => {
    const subscriber = vi.fn()
    await router.navigateTo('/one')
    router.subscribe(subscriber)
    await router.navigateTo('/two/123/page/456')

    const expectedPayload = {
      from: { path: '/one', component: One },
      to: { path: '/two/:userId/page/:pageId', component: Two },
      router,
    }

    expect(subscriber).toHaveBeenCalledWith(expectedPayload)
  })

  test("when no route is matched, it doesn't call the subscriber", async () => {
    const subscriber = vi.fn()
    router.subscribe(subscriber)
    await router.navigateTo('/unknown')

    expect(subscriber).not.toHaveBeenCalled()
  })

  test('can unsubscribe', async () => {
    const subscriber = vi.fn()
    router.subscribe(subscriber)
    router.unsubscribe(subscriber)
    await router.navigateTo('/one')

    expect(subscriber).not.toHaveBeenCalled()
  })

  test('on destroy, all subscribers are unsubscribed', async () => {
    const subscriber = vi.fn()
    router.subscribe(subscriber)
    router.destroy()
    await router.navigateTo('/one')

    expect(subscriber).not.toHaveBeenCalled()
  })
})

describe('A route can be guarded', () => {
  let router

  beforeEach(async () => {
    router = new HashRouter(routes)
    await router.init()
  })

  afterEach(() => {
    router.destroy()
  })

  test('a guard can prevent the route from being matched', async () => {
    router.addGuard((from, to) => {
      if (from === '/one' && to === '/two/:userId/page/:pageId') {
        return false
      }

      return true
    })

    await router.navigateTo('/one')
    await router.navigateTo('/two/123/page/456')

    expect(router.matchedRoute.component).toBe(One)
  })

  test('guards can be async functions which are executed in order and awaited for', async () => {
    const fnOne = vi.fn()
    const fnTwo = vi.fn()

    router.addGuard(async () => {
      await new Promise((resolve) => setTimeout(resolve))
      fnOne()
      return true
    })

    router.addGuard(async () => {
      await new Promise((resolve) => setTimeout(resolve))
      fnTwo()
      return false
    })

    await router.navigateTo('/one')

    expect(router.matchedRoute.component).toBe(Home)
  })
})

function browserNavigateTo(path) {
  window.history.pushState({}, '', `/#${path}`)
  window.dispatchEvent(new PopStateEvent('popstate'))
  return flushPromises()
}
