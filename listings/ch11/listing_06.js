export function defineComponent({ render, state, ...methods }) {
  class Component {
    // --snip-- //

    // --add--
    updateProps(props) {
      this.props = { ...this.props, ...props } // --1--
      this.#patch() // --2--
    }
    // --add--
    
    updateState(state) {
      this.state = { ...this.state, ...state }
      this.#patch()
    }

    // --snip-- //
  }

  // --snip-- //
}