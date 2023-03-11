export function objectsDiff(oldObj, newObj) {
  const oldKeys = Object.keys(oldObj)
  const newKeys = Object.keys(newObj)

  return {
    added: newKeys.filter((key) => !(key in oldObj)), // --1--
    removed: oldKeys.filter((key) => !(key in newObj)), // --2--
    updated: newKeys.filter(
      (key) => key in oldObj && oldObj[key] !== newObj[key] // --3--
    ),
  }
}