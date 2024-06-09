/**
 * Given two maps, returns the keys that have been added, removed or updated.
 * The comparison is shallow—only the first level of keys is compared.
 * The keys keep their original type.
 *
 * For example:
 *
 * Given the following maps:
 *
 * ```js
 * const oldMap = new Map([
 *   ['a', 1],
 *   ['b', 2],
 *   ['c', 3],
 * ])
 * const newMap = new Map([
 *   ['a', 1],
 *   ['b', 4],
 *   ['d', 5],
 * ])
 * ```
 *
 * The result will be:
 *
 * ```js
 * mapsDiff(oldMap, newMap)
 * // { added: ['d'], removed: ['c'], updated: ['b'] }
 * ```
 *
 * @param {Map<any, any>} oldMap the old map
 * @param {Map<any, any>} newMap the new map
 *  * @returns {{added: any[], removed: any[], updated: any[]}}
 */
export function mapsDiff(oldMap, newMap) {
  const oldKeys = Array.from(oldMap.keys())
  const newKeys = Array.from(newMap.keys())

  return {
    added: newKeys.filter((key) => !oldMap.has(key)),
    removed: oldKeys.filter((key) => !newMap.has(key)),
    updated: newKeys.filter(
      (key) => oldMap.has(key) && oldMap.get(key) !== newMap.get(key)
    ),
  }
}

/**
 * Creates a `Map` that counts the occurrences of each item in the given array.
 * The keys of the `Map` are the items in the array, and the values are the
 * number of times each item appears in the array.
 *
 * A `Map` is used instead of an object because it can store any type of key,
 * while an object can only store string keys. Thus, the key type is preserved.
 *
 * For example, given the array `[A, B, A, C, B, A]`, the object would be:
 * ```
 * {
 *    A: 3,
 *    B: 2,
 *    C: 1
 * }
 * ```
 *
 * @param {any[]} array an array of items
 * @returns {Map<any, number>} a map of item counts
 */
export function makeCountMap(array) {
  const map = new Map()

  for (const item of array) {
    map.set(item, (map.get(item) || 0) + 1)
  }

  return map
}
