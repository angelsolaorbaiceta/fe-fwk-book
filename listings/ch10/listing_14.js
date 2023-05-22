export function createApp(ParentComponent, props = {}) {
  let parentEl = null
  let isMounted = false
  let component = null

  function reset() {
    parentEl = null
    isMounted = false
    component = null
  }

  return {
    mount(_parentEl) {
      parentEl = _parentEl
      component = new ParentComponent(props)
      component.mount(parentEl)

      isMounted = true
    },

    unmount() {
      if (!isMounted) {
        return
      }

      component.unmount()
      reset()
    },
  }
}