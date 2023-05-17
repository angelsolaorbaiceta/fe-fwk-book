import { mountDOM } from './mount-dom'

export function defineComponent({ render }) {
  const Component = class {
    #vdom = null
    #hostEl = null

    render() {
      return render()
    }

    mount(hostEl, index = null) {
      this.#vdom = this.render()
      mountDOM(this.#vdom, hostEl, index)
      
      this.#hostEl = hostEl
    }
    
    unmount() {
      destroyDOM(this.#vdom)

      this.#vdom = null
      this.#hostEl = null
    }
  }

  return Component
}