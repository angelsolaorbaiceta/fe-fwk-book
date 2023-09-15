export function normalizeTagName(tag) {
  return isComponentName(tag) ? normalizeComponentName(tag) : `'${tag}'`
}

export function isComponentName(tag) {
  return /[A-Z-]+/.test(tag)
}

function normalizeComponentName(tag) {
  return (
    'this.components.' +
    tag[0].toUpperCase() +
    tag.slice(1).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
  )
}
