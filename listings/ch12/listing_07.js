export function createApp(RootComponent, props = {}) { // --1--
  let parentEl = null
  let isMounted = false
  let component = null

  function reset() { // --2-- 
    parentEl = null
    isMounted = false
    component = null
  }

  return {
    mount(_parentEl) {
      if (isMounted) { // --3-- 
        throw new Error('The application is already mounted')
      }

      parentEl = _parentEl // --4--
      component = new RootComponent(props) // --5--
      component.mount(parentEl) // --6--

      isMounted = true
    },

    unmount() {
      if (!isMounted) { // --7--
        throw new Error('The application is not mounted')
      }

      component.unmount() // --8--
      reset() // --9--
    },
  }
}