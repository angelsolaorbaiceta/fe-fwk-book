import { test, expect, beforeEach, afterEach } from 'vitest'
import { createApp } from 'fe-fwk'
import { Counter } from './counter'

let app = null

beforeEach(() => { // --1--
  app = createApp(Counter)
  app.mount(document.body)
})

afterEach(() => { // --2--
  app.unmount()
})

test('the counter starts at 0', () => {
  const counter = document.querySelector('[data-qa="counter"]') // --3--
  expect(counter.textContent).toBe('0') // --4--
})

test('the counter increments when the button is clicked', () => {
  const button = document.querySelector('[data-qa="increment"]')
  const counter = document.querySelector('[data-qa="counter"]')
  
  button.click() // --5--

  expect(counter.textContent).toBe('1') // --6--
})