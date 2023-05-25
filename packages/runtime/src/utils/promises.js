export function toPromise(value) {
  return Promise.resolve(value)
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve))
}
