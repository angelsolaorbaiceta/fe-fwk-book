export function isNotEmptyString(str) {
  return str !== ''
}

export function isNotBlankOrEmptyString(str) {
  return isNotEmptyString(str.trim())
}
