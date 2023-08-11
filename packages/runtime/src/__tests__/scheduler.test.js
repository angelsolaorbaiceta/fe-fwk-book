import { test, expect, vi } from 'vitest'
import { enqueueJob, nextTick } from '../scheduler'

test('Enqueued jobs run after nextTick', async () => {
  const job = vi.fn()
  enqueueJob(job)

  expect(job).not.toHaveBeenCalled()

  await nextTick()
  expect(job).toHaveBeenCalled()
})

test('Enqueued jobs run in order', async () => {
  const order = []
  enqueueJob(() => order.push(1))
  enqueueJob(() => order.push(2))
  enqueueJob(() => order.push(3))

  expect(order).toEqual([])

  await nextTick()
  expect(order).toEqual([1, 2, 3])
})

test('Jobs run after synchronous code', async () => {
  const order = []
  enqueueJob(() => order.push(1))
  enqueueJob(() => order.push(2))
  enqueueJob(() => order.push(3))

  expect(order).toEqual([])

  order.push(4)

  await nextTick()
  expect(order).toEqual([4, 1, 2, 3])
})
