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