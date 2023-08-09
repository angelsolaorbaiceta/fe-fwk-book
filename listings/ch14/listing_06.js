import { removeEventListeners } from './events'
import { DOM_TYPES } from './h'
// --add--
import { enqueueJob } from './scheduler'
// --add--
import { assert } from './utils/assert'

export function destroyDOM(vdom) {
  const { type } = vdom

  switch (type) {
   // --snip-- //

    case DOM_TYPES.COMPONENT: {
      vdom.component.unmount()
      // --add--
      enqueueJob(() => vdom.component.onUnmounted())
      // --add--
      break
    }

    default: {
      throw new Error(`Can't destroy DOM of type: ${type}`)
    }
  }

  delete vdom.el
}