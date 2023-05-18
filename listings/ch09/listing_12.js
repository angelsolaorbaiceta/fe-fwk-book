import { mountDOM } from './mount-dom'
import { patchDOM } from './patch-dom'
// --add--
import { hasOwnProperty } from './utils/objects'
// --add--

export function defineComponent({ render, state/* --add-- */, ...methods/* --add-- */ }) {
  const Component = class {
    // --snip-- //
  }

  // --add--
  for (const methodName in methods) {
    if (hasOwnProperty(Component, methodName)) {
      throw new Error(
        `Method "${methodName}()" already exists in the component. Can't override existing methods.`
      )
    }

    Component.prototype[methodName] = methods[methodName]
  }
  // --add--

  return Component
}