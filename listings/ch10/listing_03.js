export function addEventListeners(
  listeners = {},
  el,
  /*--add--*/hostComponent = null/*--add--*/ // --1--
) {
  const addedListeners = {}

  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(
      eventName, 
      handler, 
      el/*--add--*/, 
      hostComponent/*--add--*/
    ) // --2--
    addedListeners[eventName] = listener
  })

  return addedListeners
}

export function addEventListener(
  eventName,
  handler,
  el,
  /*--add--*/hostComponent = null/*--add--*/ // --3--
) {
  // --remove--
  el.addEventListener(eventName, handler)
  return handler
  // --remove--
  // --add--
  function boundHandler() {
    hostComponent
      ? handler.apply(hostComponent, arguments) // --4--
      : handler(...arguments) // --5--
  }

  el.addEventListener(eventName, boundHandler) // --6--

  return boundHandler
  // --add--
}