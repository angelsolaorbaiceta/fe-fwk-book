import { toArray } from './arrays'

// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
// https://www.w3.org/TR/SVGTiny12/attributeTable.html#PropertyTable
const propertyNames = new Set(['value', 'checked', 'selected', 'disabled'])

export function setAttribute(el, name, value) {
  if (propertyNames.has(name)) {
    el[name] = value
  } else {
    el.setAttribute(name, value)
  }
}

export function setStyle(el, name, value) {
  el.style[name] = value
}

export function removeAttribute(el, name) {
  if (propertyNames.has(name)) {
    el[name] = null
  } else {
    el.removeAttribute(name)
  }
}

export function removeStyle(el, name) {
  el.style[name] = null
}

export function setAttributes(domEl, attrs) {
  const { class: className, style, ...otherAttrs } = attrs

  // Delete the "key" property if it exists
  delete otherAttrs.key

  if (className) {
    domEl.className = ''
    domEl.classList.add(...toArray(className))
  }

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(domEl, prop, value)
    })
  }

  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(domEl, name, value)
  }
}
