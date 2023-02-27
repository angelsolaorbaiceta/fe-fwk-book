import { setAttributes } from './attributes'
import { addEventListeners } from './events'

// --snip-- //

function createElementNode(vdom, parentEl) {
  const { tag, props, children } = vdom

  const element = document.createElement(tag) //--1--
  addProps(element, props, vdom) //--2--
  vdom.el = element

  children.forEach((child) => mountDOM(child, element))
  parentEl.append(element)
}

function addProps(el, props, vdom) {
  const { on: events, ...attrs } = props //--3--

  vdom.listeners = addEventListeners(events, el) //--4--
  setAttributes(el, attrs) //--5--
}
