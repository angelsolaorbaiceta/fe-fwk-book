// --add--
import { toPromise } from './utils/promises'
// --add--

export function addEventListeners(
  listeners = {},
  el,
  /*--add--*/hostComponent = null/*--add--*/ // --1--
) {
  const addedListeners = {}

  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el/*--add--*/, hostComponent/*--add--*/) // --2--
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
  async function asyncHandler() { // --4--
    await toPromise( // --5--
      hostComponent
        ? handler.call(hostComponent, ...arguments) // --6--
        : handler(...arguments) // --7--
    )
  }

  el.addEventListener(eventName, asyncHandler) // --8--

  return asyncHandler
  // --add--
}