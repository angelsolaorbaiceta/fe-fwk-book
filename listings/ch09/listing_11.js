// Safely evaluate `hasOwnProperty` calls.
// https://eslint.org/docs/latest/rules/no-prototype-builtins
export function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}