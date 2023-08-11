export function nextTick() {
  scheduleUpdate()
  return Promise.resolve()
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}