import { vi, test, expect, beforeEach, afterEach } from 'vitest'
import { createApp } from 'fe-fwk'
import { TodosList } from './TodosList'

// Mock the fetch API
// --snip --//

let app = null

beforeEach(() => {
  app = createApp(TodosList)
  app.mount(document.body)
})

afterEach(() => {
  app.unmount()
})

test('Shows the loading indicator while the todos are fetched', () => {
  // If nextTick() isn't awaited for, the onMounted() hooks haven't run yet
  // so the loading should be displayed.

  expect(document.body.innerHTML).toContain('Loading...')
})