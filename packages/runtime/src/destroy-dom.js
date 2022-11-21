import { DOM_TYPES } from './h'
import { assert } from './utils/assert'

export function destroyDOM(vdom) {
  const { type, el } = vdom

  assert(!!el, 'Can only destroy DOM nodes that have been mounted')

  if (type === DOM_TYPES.ELEMENT || type === DOM_TYPES.TEXT) {
    assert(el instanceof HTMLElement, 'el must be an HTMLElement')
    el.parentNode.removeChild(el)

    return
  }

  if (type === DOM_TYPES.FRAGMENT) {
    throw new Error('implement me')
  }
}
