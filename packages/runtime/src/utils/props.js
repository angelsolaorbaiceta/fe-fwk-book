import { DOM_TYPES } from '../h'
import { assert } from './assert'

/**
 * @typedef ExtractedPropsEvents
 * @type {object}
 * @property {Object.<string,Function>} events - The event listeners to add to the element.
 * @property {Object.<string,any} props - The props to add to the element.
 */

/**
 * Extracts the events and props of a component or element virtual node, ignoring
 * the 'key' attribute.
 *
 * @param {import('../h').VNode} vdom
 * @returns {ExtractedPropsEvents} the events and props of the component
 */
export function extractPropsAndEvents(vdom) {
  assert(
    vdom.type === DOM_TYPES.COMPONENT,
    "Can't extract props from a non-component virtual node"
  )

  const { on: events = {}, ...props } = vdom.props
  delete props.key

  return { props, events }
}
