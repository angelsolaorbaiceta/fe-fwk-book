export function defineComponent({ render/*--add--*/, state/*--add--*/ }) { // --1--
  class Component {
    #isMounted = false
    #vdom = null
    #hostEl = null

    // --add--
    constructor(props = {}) {
      this.props = props // --2--
      this.state = state ? state(props) : {} // --3--
    }
    // --add--

    render() {
      return render()
    }

    mount(hostEl, index = null) {
      // --snip-- //
    }
    
    unmount() {
      // --snip-- //
    }
  }

  return Component
}