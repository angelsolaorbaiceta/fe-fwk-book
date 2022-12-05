// https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes
// https://www.w3.org/TR/SVGTiny12/attributeTable.html#PropertyTable
// https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes

/**
 * Sets the attributes of an element.
 *
 * It doesn't remove attributes that are not present in the new attributes,
 * except in the case of the `class` attribute.
 *
 * @param {HTMLElement} el target element
 * @param {object} attrs attributes to set
 */
export function setAttributes(el, attrs) {
  const { class: className, style, ...otherAttrs } = attrs

  // Delete the "key" property if it exists
  delete otherAttrs.key

  if (className) {
    setClass(el, className)
  }

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value)
    })
  }

  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value)
  }
}

export function setAttribute(el, name, value) {
  if (name === 'value') {
    el.value = value
    return
  }

  if (value == null) {
    el.removeAttribute(name)
    return
  }

  if (typeof value === 'boolean') {
    setBooleanAttribute(el, name, value)
  } else {
    el.setAttribute(name, value)
  }
}

function setBooleanAttribute(el, name, value) {
  if (value) {
    el.setAttribute(name, '')
  } else {
    el.removeAttribute(name)
  }
}

export function removeAttribute(el, name) {
  setAttribute(el, name, null)
}

export function setStyle(el, name, value) {
  el.style[name] = value
}

export function removeStyle(el, name) {
  el.style[name] = null
}

function setClass(el, className) {
  el.className = ''

  if (typeof className === 'string') {
    el.className = className
  }

  if (Array.isArray(className)) {
    el.classList.add(...className)
  }
}
