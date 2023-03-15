import {
  removeAttribute,
  setAttribute,
} from './attributes'
import { destroyDOM } from './destroy-dom'
import { DOM_TYPES } from './h'
import { mountDOM } from './mount-dom'
import { areNodesEqual } from './nodes-equal'
// --add--
import {
  arraysDiff,
} from './utils/arrays'
// --add--
import { objectsDiff } from './utils/objects'
// --add--
import { isNotBlankOrEmptyString } from './utils/strings'
// --add--

// --snip-- //

// --add--
function patchClass(el, oldClass, newClass) {
  if (oldClass === newClass) {
    return
  }

  const oldClasses = toClassList(oldClass)
  const newClasses = toClassList(newClass)

  const { added, removed } = arraysDiff(oldClasses, newClasses)
  el.classList.remove(...removed)
  el.classList.add(...added)
}

function toClassList(classes = '') {
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString)
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString)
}
// --add--