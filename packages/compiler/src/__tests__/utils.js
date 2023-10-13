export function singleJSLine(str) {
  return toSingleJSLine(str[0])
}

export function toSingleJSLine(str) {
  return str.replace(/\s+/g, ' ').trim()
}
