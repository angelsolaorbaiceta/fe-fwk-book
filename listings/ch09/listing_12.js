import { mountDOM } from './mount-dom'
import { patchDOM } from './patch-dom'
// --add--
import { hasOwnProperty } from './utils/objects'
// --add--

export function defineComponent({ render, state/* --add-- */, ...methods/* --add-- */ }) { // --1--
  class Component {
    // --snip-- //
  }

  // --add--
  for (const methodName in methods) { // --2--
    if (hasOwnProperty(Component, methodName)) { // --3--
      throw new Error(
        `Method "${methodName}()" already exists in the component. Can't override existing methods.`
      )
    }

    Component.prototype[methodName] = methods[methodName] // --4--
  }
  // --add--

  return Component
}