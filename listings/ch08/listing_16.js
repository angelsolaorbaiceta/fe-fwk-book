import {
  removeAttribute,
  setAttribute,
  removeStyle,
  setStyle,
} from './attributes'
import { destroyDOM } from './destroy-dom'
// --add--
import { addEventListener } from './events'
// --add--
import { DOM_TYPES } from './h'
import { mountDOM } from './mount-dom'
import { areNodesEqual } from './nodes-equal'
import {
  arraysDiff,
} from './utils/arrays'
import { objectsDiff } from './utils/objects'
import { isNotBlankOrEmptyString } from './utils/strings'

// --snip-- //

// --add--
function patchEvents(el, oldEvents = {}, newEvents = {}) {
  if (oldEvents === newEvents) {
    return
  }

  const { removed, added, updated } = objectsDiff(oldEvents, newEvents)

  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldEvents[eventName])
  }

  const addedListeners = {}

  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(eventName, newEvents[eventName], el)
    addedListeners[eventName] = listener
  }

  return addedListeners
}
// --add--