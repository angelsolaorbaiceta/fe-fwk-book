function setClass(el, className) {
  el.className = '' // --1--

  if (typeof className === 'string') {
    el.className = className // --2--
  }

  if (Array.isArray(className)) {
    el.classList.add(...className) // --3--
  }
}
