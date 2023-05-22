export function defineComponent({ render, state, ...methods }) {
  const Component = class {
    #isMounted = false
    #vdom = null
    #hostEl = null
    // --add--
    #eventHandlers = null
    #parentComponent = null
    // --add--

    constructor(props = {}/*--add--*/, eventHandlers = {}, parentComponent = null/*--add--*/) {
      this.props = props
      this.state = state ? state(props) : {}
      // --add--
      this.#eventHandlers = eventHandlers
      this.#parentComponent = parentComponent
      // --add--
    }

    // --snip-- //
  }

  // --snip-- //

  return Component
}