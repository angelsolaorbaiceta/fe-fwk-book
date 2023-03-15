// --add--
import {
  removeAttribute,
  setAttribute,
} from './attributes'
// --add--
import { destroyDOM } from './destroy-dom'
import { DOM_TYPES } from './h'
import { mountDOM } from './mount-dom'
import { areNodesEqual } from './nodes-equal'
// --add--
import { objectsDiff } from './utils/objects'
// --add--

// --snip-- //

// --add--
function patchAttrs(el, oldAttrs, newAttrs) {
  const { added, removed, updated } = objectsDiff(oldAttrs, newAttrs)

  for (const attr of removed) {
    removeAttribute(el, attr)
  }

  for (const attr of added.concat(updated)) {
    setAttribute(el, attr, newAttrs[attr])
  }
}
// --add--