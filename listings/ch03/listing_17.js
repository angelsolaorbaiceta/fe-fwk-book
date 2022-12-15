export function setAttribute(el, name, value) {
  if (value == null) {
    removeAttribute(el, name)
  } else {
    el[name] = value
  }
}

export function removeAttribute(el, name) {
  el[name] = null
  el.removeAttribute(name)
}
