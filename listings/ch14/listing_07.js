export function nextTick() {
  scheduleUpdate()
  return promise
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}