import { DOM_TYPES } from '../h'
import { assert } from './assert'

/**
 * @typedef ExtractedComponentProps
 * @type {object}
 * @property {Object.<string,Function>} events - The event listeners to add to the element.
 * @property {Object.<string,any} props - The props to add to the element.
 */

/**
 * Extracts the events and props of a component virtual node, ignoring the 'key' attribute
 * and the 'data-' attributes.
 *
 * @param {import('../h').VNode} vdom
 * @returns {ExtractedComponentProps} the events and props of the component
 */
export function extractComponentProps(vdom) {
  assert(
    vdom.type === DOM_TYPES.COMPONENT,
    "Can't extract props from a non-component virtual node"
  )

  const { on: events = {}, ...props } = vdom.props
  delete props.key

  for (const prop in props) {
    if (prop.startsWith('data-')) {
      delete props[prop]
    }
  }

  return { props, events }
}
