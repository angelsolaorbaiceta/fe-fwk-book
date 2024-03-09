import { defineComponent } from './component'
import { h } from './h'

/**
 * A component that renders the component for the current route.
 * The content is rendered inside a div with the id "router-outlet".
 */
export const RouterOutlet = defineComponent({
  state() {
    return {
      matchedRoute: null,
      subscription: null,
    }
  },

  onMounted() {
    const subscription = this.appContext.router.subscribe(({ to }) => {
      this.handleRouteChange(to)
    })

    this.updateState({ subscription })
  },

  onUnmounted() {
    const { subscription } = this.state
    this.appContext.router.unsubscribe(subscription)
  },

  handleRouteChange(matchedRoute) {
    this.updateState({ matchedRoute })
  },

  render() {
    const { matchedRoute } = this.state

    return h('div', { id: 'router-outlet' }, [
      matchedRoute ? h(matchedRoute.component) : null,
    ])
  },
})
