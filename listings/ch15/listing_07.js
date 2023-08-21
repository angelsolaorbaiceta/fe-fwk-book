export function nextTick() {
  scheduleUpdate()
  return flushPromises()
}

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}