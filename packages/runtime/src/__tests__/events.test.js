import { test, expect, vi } from 'vitest'
import { addEventListener } from '../events'
import { flushPromises } from '../utils/promises'

test('synchronous event without host component, called with argument', () => {
  const btn = makeButton()
  const handler = vi.fn()
  const argument = { foo: 'bar' }

  addEventListener('click', () => handler(argument), btn)
  btn.click()

  expect(handler).toHaveBeenCalledWith(argument)
})

test('asynchronous event without host component', async () => {
  const btn = makeButton()
  let data = null
  async function handler() {
    data = 'not foo'
    await Promise.resolve()
    data = 'foo'
  }

  addEventListener('click', handler, btn)
  btn.click()

  await flushPromises()

  expect(data).toBe('foo')
})

test('synchronous event with host component, the handler is bound to component', () => {
  const btn = makeButton()

  let actualArgument = null
  let actualBinding = null

  const hostComponent = { bar: 'baz' }
  function handler(arg) {
    actualBinding = this
    actualArgument = arg
  }

  addEventListener('click', handler, btn, hostComponent)
  btn.click()

  expect(actualBinding).toBe(hostComponent)
  expect(actualArgument).toBeInstanceOf(Event)
})

test('asynchronous event with host component, the handler is bound to component', async () => {
  const btn = makeButton()

  let actualArgument = null
  let actualBinding = null

  const hostComponent = { bar: 'baz' }
  async function handler(arg) {
    await Promise.resolve()
    actualBinding = this
    await Promise.resolve()
    actualArgument = arg
  }

  addEventListener('click', handler, btn, hostComponent)
  btn.click()

  await flushPromises()

  expect(actualBinding).toBe(hostComponent)
  expect(actualArgument).toBeInstanceOf(Event)
})

function makeButton() {
  const button = document.createElement('button')
  button.textContent = 'Click me'

  return button
}
