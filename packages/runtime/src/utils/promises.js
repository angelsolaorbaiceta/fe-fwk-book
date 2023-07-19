export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}
