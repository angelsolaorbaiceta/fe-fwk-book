import { describe, expect, it, vi } from 'vitest'
import { Dispatcher } from '../dispatcher'

const eventName = 'test-event'
const payload = { test: 'payload' }

describe('An event dispatcher', () => {
  it('can register and unregister event handlers to specific events', () => {
    const dispatcher = new Dispatcher()
    const handler = vi.fn()

    const unsubscribe = dispatcher.subscribe(eventName, handler)
    dispatcher.dispatch(eventName, payload)

    expect(handler).toHaveBeenCalledWith(payload)

    unsubscribe()
    dispatcher.dispatch(eventName, payload)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('can register and unregister event handlers to all events', () => {
    const dispatcher = new Dispatcher()
    const handler = vi.fn()

    const unsubscribe = dispatcher.subscribeToAll(handler)
    dispatcher.dispatch(eventName, payload)

    expect(handler).toHaveBeenCalledWith(payload)

    unsubscribe()
    dispatcher.dispatch(eventName, payload)

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
