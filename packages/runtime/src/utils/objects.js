/**
 * Given two objects, returns the keys that have been added, removed or updated.
 * The comparison is shallow—only the first level of keys is compared.
 *
 * @param {object} oldObj the old object
 * @param {object} newObj the new object
 * @returns {{added: string[], removed: string[], updated: string[]}}
 */
export function objectsDiff(oldObj, newObj) {
  const oldKeys = Object.keys(oldObj)
  const newKeys = Object.keys(newObj)

  return {
    added: newKeys.filter((key) => !(key in oldObj)),
    removed: oldKeys.filter((key) => !(key in newObj)),
    updated: newKeys.filter(
      (key) => key in oldObj && oldObj[key] !== newObj[key]
    ),
  }
}

// Safely evaluate `hasOwnProperty` calls.
// https://eslint.org/docs/latest/rules/no-prototype-builtins
export function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}
