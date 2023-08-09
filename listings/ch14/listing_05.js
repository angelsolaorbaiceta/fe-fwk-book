import { setAttributes } from './attributes'
import { addEventListeners } from './events'
import { DOM_TYPES } from './h'
// --add--
import { enqueueJob } from './scheduler'
// --add--
import { extractPropsAndEvents } from './utils/props'

export function mountDOM(vdom, parentEl, index, hostComponent = null) {
  switch (vdom.type) {
    // --snip-- //

    case DOM_TYPES.COMPONENT: {
      createComponentNode(vdom, parentEl, index, hostComponent)
      // --add--
      enqueueJob(() => vdom.component.onMounted())
      // --add--
      break
    }

    default: {
      throw new Error(`Can't mount DOM of type: ${vdom.type}`)
    }
  }
}

// --snip-- //