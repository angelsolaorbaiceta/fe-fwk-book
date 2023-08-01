mount(hostEl, index = null) {
  if (this.#isMounted) {
    throw new Error('Component is already mounted')
  }

  this.#vdom = this.render()
  mountDOM(this.#vdom, hostEl, index, this)
  this.#wireEventHandlers()

  this.#isMounted = true
  this.#hostEl = hostEl

  // --add--
  return this.onMounted()
  // --add--
}