// --add--
import { toPromise } from './utils/promises'
// --add--

export function addEventListeners(
  listeners = {},
  el,
  /*--add--*/hostComponent = null/*--add--*/
) {
  const addedListeners = {}

  Object.entries(listeners).forEach(([eventName, handler]) => {
    const listener = addEventListener(eventName, handler, el/*--add--*/, hostComponent/*--add--*/)
    addedListeners[eventName] = listener
  })

  return addedListeners
}

export function addEventListener(
  eventName,
  handler,
  el,
  /*--add--*/hostComponent = null/*--add--*/
) {
  // --remove--
  el.addEventListener(eventName, handler)
  return handler
  // --remove--
  // --add--
  async function asyncHandler() {
    await toPromise(
      hostComponent
        ? handler.call(hostComponent, ...arguments)
        : handler(...arguments)
    )
  }

  el.addEventListener(eventName, asyncHandler)

  return asyncHandler
  // --add--
}