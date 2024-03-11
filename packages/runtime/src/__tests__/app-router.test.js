import { afterEach, beforeEach, expect, test } from 'vitest'
import { createApp } from '../app'
import { flushPromises } from '../utils/promises'
import { App, routes } from './app-router'
import { singleHtmlLine } from './utils'

let app

beforeEach(async () => {
  app = createApp(App, {}, { routes })
  app.mount(document.body)

  await flushPromises()
})

afterEach(() => {
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

// test('the application in injects the context in the root component', () => {})
