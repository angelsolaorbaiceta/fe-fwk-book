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
function patchClasses(el, oldClass, newClass) {
  const oldClasses = toClassList(oldClass) // --1--
  const newClasses = toClassList(newClass) // --2--

  const { added, removed } = arraysDiff(oldClasses, newClasses) // --3--
  
  if (removed.length > 0) {
    el.classList.remove(...removed) // --4--
  }
  if (added.length > 0) {
    el.classList.add(...added) // --5--
  }
}

function toClassList(classes = '') { 
  return Array.isArray(classes)
    ? classes.filter(isNotBlankOrEmptyString) // --6--
    : classes.split(/(\s+)/).filter(isNotBlankOrEmptyString) // --7--
}
// --add--