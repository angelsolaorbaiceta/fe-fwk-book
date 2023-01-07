/**
 * If the given value is an array, it returns it. Otherwise, it returns an array
 * containing the given value.
 *
 * @param {any|any[]} maybeArray something that might be an array
 * @returns {any[]} an array
 */
export function toArray(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray]
}

/**
 * It filters out the nulls and undefined values from the given array.
 *
 * @param {any[]} arr the array to filter
 * @returns {any[]} the array without nulls and undefined values
 */
export function withoutNulls(arr) {
  return arr.filter((item) => item != null)
}

/**
 * Given two arrays, it returns the items that have been added to the new array
 * and the items that have been removed from the old array.
 *
 * @param {any[]} oldArray the old array
 * @param {any[]} newArray the new array
 * @returns {{added: any[], removed: any[]}}}
 */
export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter(
      (newItem) => !oldArray.some((oldItem) => newItem === oldItem)
    ),
    removed: oldArray.filter(
      (oldItem) => !newArray.some((newItem) => newItem === oldItem)
    ),
  }
}
