import {
  removeAttribute,
  setAttribute,
  removeStyle,
  setStyle,
} from './attributes'
import { destroyDOM } from './destroy-dom'
import { addEventListener } from './events'
import { DOM_TYPES } from './h'
import { mountDOM, /*--add--*/extractChildren/*--add--*/} from './mount-dom'
import { areNodesEqual } from './nodes-equal'
import {
  arraysDiff,
  arraysDiffSequence,
  ARRAY_DIFF_OP,
} from './utils/arrays'
import { objectsDiff } from './utils/objects'
import { isNotBlankOrEmptyString } from './utils/strings

// --snip-- //

function patchChildren(oldVdom, newVdom) {
  const oldChildren = extractChildren(oldVdom)
  const newChildren = extractChildren(newVdom)
  const parentEl = oldVdom.el

  const diffSeq = arraysDiffSequence( // --3--
    oldChildren,
    newChildren,
    areNodesEqual
  )

  for (const operation of diffSeq) { // --4--
    const { from, index, item } = operation

    switch (operation.op) { // --5--
      case ARRAY_DIFF_OP.ADD: {
        // TODO: implement
      }

      case ARRAY_DIFF_OP.REMOVE: {
        // TODO: implement
      }

      case ARRAY_DIFF_OP.MOVE: {
        // TODO: implement
      }

      case ARRAY_DIFF_OP.NOOP: {
        // TODO: implement
      }
    }
  }
}