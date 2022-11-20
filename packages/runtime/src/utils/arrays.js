export function toArray(maybeArray) {
  return Array.isArray(maybeArray) ? maybeArray : [maybeArray]
}
