import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { defineComponent } from '../component'
import { h, hString } from '../h'
import { HashRouter } from '../router'
import { RouterLink } from '../router-components'
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

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/one',
    component: One,
  },
]

let router
let link

beforeEach(async () => {
  // Stub the `console.warn` method to avoid polluting the test output
  vi.stubGlobal('console', { warn: vi.fn(), log: console.log })

  router = new HashRouter(routes)
  await router.init()

  link = new RouterLink({ to: '/one' })
  link.setAppContext({ router })
  link.mount(document.body)
})

afterEach(() => {
  router.destroy()
  link.unmount()
  document.body.innerHTML = ''
})

test('when the link is clicked, it navigates to the route', async () => {
  const anchor = document.querySelector('a')
  anchor.click()
  await flushPromises()

  expect(window.location.hash).toBe('#/one')
  expect(router.matchedRoute).toEqual({ path: '/one', component: One })
})
