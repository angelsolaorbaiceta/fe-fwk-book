export function arraysDiff(oldArray, newArray) {
  return {
    added: newArray.filter(
      (newItem) => !oldArray.includes(newItem) // --1--
    ),
    removed: oldArray.filter(
      (oldItem) => !newArray.includes(oldItem) // --2--
    ),
  }
}