import {
  removeAttribute,
  setAttribute,
  // --add--
  removeStyle,
  setStyle,
  // --add--
} from './attributes'
import { destroyDOM } from './destroy-dom'
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
function patchStyles(el, oldStyle = {}, newStyle = {}) {
  const { added, removed, updated } = objectsDiff(oldStyle, newStyle)

  for (const style of removed) {
    removeStyle(el, style)
  }

  for (const style of added.concat(updated)) {
    setStyle(el, style, newStyle[style])
  }
}
// --add--