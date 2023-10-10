function insert(el, parentEl, index) {
  // If index is null or undefined, simply append.
  // Note the usage of `==` instead of `===`.
  if (index == null) {
    parentEl.append(el) // --1--
    return
  }

  if (index < 0) {
    throw new Error(`Index must be a positive integer, got ${index}`) // --2--
  }

  const children = parentEl.childNodes

  if (index >= children.length) {
    parentEl.append(el) // --3--
  } else {
    parentEl.insertBefore(el, children[index]) // --4--
  }
}