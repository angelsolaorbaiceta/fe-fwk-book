function patchEvents(
  el,
  oldListeners = {},
  oldEvents = {},
  newEvents = {},
  // --add--
  hostComponent
  // --add--
) {
  const { removed, added, updated } = objectsDiff(oldEvents, newEvents)

  for (const eventName of removed.concat(updated)) {
    el.removeEventListener(eventName, oldListeners[eventName])
  }
  const addedListeners = {}

  for (const eventName of added.concat(updated)) {
    const listener = addEventListener(
      eventName,
      newEvents[eventName],
      el,
      // --add--
      hostComponent
      // --add--
    )
    addedListeners[eventName] = listener
  }

  return addedListeners
}