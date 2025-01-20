import { afterEach, beforeEach, describe, expect, test } from 'vitest'
import { createApp } from '../app'
import { flushPromises } from '../utils/promises'
import { App, routes } from './app-router'
import { singleHtmlLine } from './utils'
import { HashRouter } from '../router'

/** @type {import('../app').Application} */
let app

beforeEach(async () => {
  const router = new HashRouter(routes)
  app = createApp(App, {}, { router })
  app.mount(document.body)

  await flushPromises()
})

afterEach(async () => {
  app.unmount()
  await flushPromises()
  document.body.innerHTML = ''
})

test('when the application is mounted, loads the home route', () => {
  expect(document.body.innerHTML).toBe(singleHtmlLine`
  <header>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  <div id="router-outlet">
    <div>This is home</div>
  </div>
  <footer>Footer</footer>
  `)
})

describe('when the user navigates to the about/ route', () => {
  beforeEach(async () => {
    document.querySelector('a[href="/about"]').click()
    await flushPromises()
  })

  test('loads the about/ route', () => {
    expect(document.body.innerHTML).toBe(singleHtmlLine`
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
    <div id="router-outlet">
      <div>This is about</div>
    </div>
    <footer>Footer</footer>
    `)
  })
})

describe('when the user navigates to a non-existing route by writing the URL in the browser', () => {
  beforeEach(() => {
    // Simulate URL change
    window.history.pushState({}, '', '#/non-existing')
    window.dispatchEvent(new Event('popstate'))
  })

  test('loads the not found route', () => {
    expect(document.body.innerHTML).toBe(singleHtmlLine`
    <header>
      <nav>
        <a href="/">Home</a>
        <a href="/about">About</a>
      </nav>
    </header>
    <div id="router-outlet">
      <div>Not found</div>
    </div>
    <footer>Footer</footer>
    `)
  })
})
