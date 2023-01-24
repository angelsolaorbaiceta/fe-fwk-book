export function setAttributes(el, attrs) {
  const { class: className, style, ...otherAttrs } = attrs //--1--

  if (className) {
    setClass(el, className) //--2--
  }

  if (style) {
    Object.entries(style).forEach(([prop, value]) => {
      setStyle(el, prop, value) //--3--
    })
  }

  for (const [name, value] of Object.entries(otherAttrs)) {
    setAttribute(el, name, value) //--4--
  }
}

// TODO: implement setClass

// TODO: implement setStyle

// TODO: implement setAttribute
