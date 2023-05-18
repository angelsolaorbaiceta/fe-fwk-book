
export function defineComponent({ render, state }) {
  const Component = class {
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