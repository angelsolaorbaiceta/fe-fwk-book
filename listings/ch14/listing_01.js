// --add--
const emptyFn = () => {}
// --add--

export function defineComponent({
  render,
  state,
  // --add--
  onMounted = emptyFn,
  onUnmounted = emptyFn,
  // --add--
  ...methods
}) {
  class Component {
    // --snip-- //
  }
}
