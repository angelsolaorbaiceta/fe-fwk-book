export function defineComponent({ render/* --add-- */, state/* --add-- */ }) {
  const Component = class {
    #isMounted = false
    #vdom = null
    #hostEl = null

    // --add--
    constructor(props = {}) {
      this.props = props
      this.state = state ? state(props) : {}
    }
    // --add--

    render() {
      return render()
    }

    mount(hostEl, index = null) {
      if (this.#isMounted) {
        throw new Error('Component is already mounted')
      }
      
      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index)
      
      this.#hostEl = hostEl
      this.#isMounted = true
    }
    
    unmount() {
      if (!this.#isMounted) {
        throw new Error('Component is not mounted')
      }

      destroyDOM(this.#vdom)

      this.#vdom = null
      this.#hostEl = null
      this.#isMounted = false
    }
  }

  return Component
}