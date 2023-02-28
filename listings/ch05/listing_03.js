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