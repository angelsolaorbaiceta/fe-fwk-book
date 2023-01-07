/**
 * Given two objects, returns the keys that have been added, removed or updated.
 * The comparison is shallow—only the first level of keys is compared.
 *
 * @param {object} oldObj the old object
 * @param {object} newObj the new object
 * @returns {{added: string[], removed: string[], updated: string[]}}
 */
export function objectsDiff(oldObj, newObj) {
  const added = Object.keys(newObj).filter((key) => !(key in oldObj))
  const removed = Object.keys(oldObj).filter((key) => !(key in newObj))
  const updated = Object.keys(newObj).filter(
    (key) => key in oldObj && oldObj[key] !== newObj[key]
  )

  return {
    added,
    removed,
    updated,
  }
}
