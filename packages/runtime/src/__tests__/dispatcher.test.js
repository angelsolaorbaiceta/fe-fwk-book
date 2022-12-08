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

  it("can't register the same handler twice", () => {
    const dispatcher = new Dispatcher()
    const handler = vi.fn()

    const unsubscribe = dispatcher.subscribe(eventName, handler)
    dispatcher.subscribe(eventName, handler)
    dispatcher.subscribe(eventName, handler)

    dispatcher.dispatch(eventName, payload)

    expect(handler).toHaveBeenCalledTimes(1)

    unsubscribe()
    dispatcher.dispatch(eventName, payload)

    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('unsubscribe multiple handlers', () => {
    const dispatcher = new Dispatcher()
    const handler1 = vi.fn()
    const handler2 = vi.fn()

    const unsubscribe1 = dispatcher.subscribe(eventName, handler1)
    const unsubscribe2 = dispatcher.subscribe(eventName, handler2)
    dispatcher.dispatch(eventName, payload)

    expect(handler1).toHaveBeenCalledWith(payload)
    expect(handler2).toHaveBeenCalledWith(payload)

    unsubscribe1()
    unsubscribe2()
    dispatcher.dispatch(eventName, payload)

    expect(handler1).toHaveBeenCalledTimes(1)
    expect(handler2).toHaveBeenCalledTimes(1)
  })

  it('can register and unregister handlers that run after each event', () => {
    const dispatcher = new Dispatcher()
    const handler = vi.fn()

    const unsubscribe = dispatcher.afterEveryEvent(handler)
    dispatcher.dispatch(eventName, payload)

    expect(handler).toHaveBeenCalled()

    unsubscribe()
    dispatcher.dispatch(eventName, payload)

    expect(handler).toHaveBeenCalledTimes(1)
  })
})
