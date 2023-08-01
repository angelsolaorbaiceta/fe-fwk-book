unmount() {
  if (!this.#isMounted) {
    throw new Error('Component is not mounted')
  }

  destroyDOM(this.#vdom)
  this.#subscriptions.forEach((unsubscribe) => unsubscribe())

  this.#vdom = null
  this.#isMounted = false
  this.#hostEl = null
  this.#subscriptions = []

  // --add--
  return this.onUnmounted()
  // --add--
}