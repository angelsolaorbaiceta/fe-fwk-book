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
function patchEvents(
  el,
  oldListeners = {},
  oldEvents = {},
  newEvents = {}
) {
  const { removed, added, updated } = objectsDiff(oldEvents, newEvents) // --1--

  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldListeners[eventName]) // --2--
  }

  const addedListeners = {} // --3--

  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(eventName, newEvents[eventName], el) // --4--
    addedListeners[eventName] = listener // --5--
  }

  return addedListeners // --6--
}
// --add--