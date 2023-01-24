export function addEventListener(eventName, handler, el) {
  el.addEventListener(eventName, handler)
  return handler
}
