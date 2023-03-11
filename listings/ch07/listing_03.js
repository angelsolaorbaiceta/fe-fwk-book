export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter(
      (newItem) => !oldArray.some((oldItem) => newItem === oldItem) // --1--
    ),
    removed: oldArray.filter(
      (oldItem) => !newArray.some((newItem) => newItem === oldItem) // --2--
    ),
  }
}