import { destroyDOM } from './destroy-dom'
import { mountDOM } from './mount-dom'

export function defineComponent({ render }) { // --1--
  class Component { // --2--
    #vdom = null
    #hostEl = null

    render() { // --3--
      return render()
    }

    mount(hostEl, index = null) {
      this.#vdom = this.render() // --4--
      mountDOM(this.#vdom, hostEl, index) // --5--
      
      this.#hostEl = hostEl
    }
    
    unmount() {
      destroyDOM(this.#vdom) // --6--

      this.#vdom = null
      this.#hostEl = null
    }
  }

  return Component // --7--
}