import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hString } from '../h'
import { HashRouter } from '../router'
import { RouterOutlet } from '../router-components'

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
    path: '/three',
    redirect: '/one',
  },
]

let router
let outlet

beforeEach(async () => {
  router = new HashRouter(routes)
  outlet = new RouterOutlet()
  outlet.setAppContext({ router })

  outlet.mount(document.body)
  await outlet.onMounted()
})

afterEach(async () => {
  document.body.innerHTML = ''
})

test('has no content when the router has not been initialized', () => {
  expect(document.body.innerHTML).toBe('<div id="router-outlet"></div>')
})

describe('when the router is initialized', () => {
  beforeEach(async () => {
    await router.init()
  })

  afterEach(() => {
    router.destroy()
  })

  test('renders the home component', () => {
    expect(document.body.innerHTML).toBe(
      '<div id="router-outlet"><h1>Home</h1></div>'
    )
  })
})

describe('when the route changes', () => {
  beforeEach(async () => {
    await router.init()
    await router.navigateTo('/one')
  })

  afterEach(() => {
    router.destroy()
  })

  test('it renders the new component', async () => {
    expect(document.body.innerHTML).toBe(
      '<div id="router-outlet"><h1>One</h1></div>'
    )
  })
})

describe('when the new route is a redirect', () => {
  beforeEach(async () => {
    await router.init()
    await router.navigateTo('/three')
  })

  afterEach(() => {
    router.destroy()
  })

  test('it renders the redirected component', async () => {
    expect(document.body.innerHTML).toBe(
      '<div id="router-outlet"><h1>One</h1></div>'
    )
  })
})

test('when the component is unmounted, it unsubscribes from the router', async () => {
  vi.spyOn(router, 'unsubscribe')
  outlet.unmount()
  await outlet.onUnmounted()

  expect(router.unsubscribe).toHaveBeenCalled()
})
