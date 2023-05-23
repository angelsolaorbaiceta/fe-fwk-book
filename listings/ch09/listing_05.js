
export function defineComponent({ render, state }) {
  class Component {
    // --snip-- //

    render() {
      // --remove--
      return render()
      // --remove--
      // --add--
      return render.call(this)
      // --add--
    }

    // --snip-- //
  }

  return Component
}