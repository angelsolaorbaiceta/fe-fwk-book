export function defineComponent({ render, state, ...methods }) {
  class Component {
    #isMounted = false
    #vdom = null
    #hostEl = null
    // --add--
    #eventHandlers = null // --1--
    #parentComponent = null // --2--
    // --add--

    constructor(
      props = {},
      // --add-- 
      eventHandlers = {}, 
      parentComponent = null,
      // --add--
    ) {
      this.props = props
      this.state = state ? state(props) : {}
      // --add--
      this.#eventHandlers = eventHandlers // --3--
      this.#parentComponent = parentComponent // --4--
      // --add--
    }

    // --snip-- //
  }

  // --snip-- //

  return Component
}