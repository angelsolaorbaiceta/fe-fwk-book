const resolvedPromise = Promise.resolve()

export function nextTick() {
  scheduleUpdate()
  return resolvedPromise
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}