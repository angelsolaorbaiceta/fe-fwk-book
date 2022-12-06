export function toArray(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray]
}

export function withoutNulls(arr) {
  return arr.filter((item) => item != null)
}
