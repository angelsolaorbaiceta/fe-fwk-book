import { parse } from 'node-html-parser'
import { normalizeTagName } from './tag'

const NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
}

export class TemplateCompiler {
  #lines = []
  #stack = []
  #imports = new Set()

  #reset() {
    this.#lines = ['function render() {', 'return (']
    this.#stack = [')', '}']
    this.#imports = new Set()
  }

  /**
   * Compiles the given HTML template into a render function.
   * It transforms the directives into JavaScript code.
   *
   * @param {string} template the HTML template to compile
   * @returns {object} the compiled render function
   */
  compile(template) {
    this.#reset()
    const { childNodes } = parse(normalize(template))

    // Top level contiguous elements are wrapped in a fragment.
    if (childNodes.length > 1) {
      this.#lines.push('h(Fragment, {}, [')
      this.#imports.add('hFragment')
      this.#stack.unshift('])')
    }

    for (const node of childNodes) {
      this.#addNode(node)
    }

    this.#moveStackToLines()

    return {
      imports: this.#imports,
      code: this.#lines.join(' '),
    }
  }

  #addNode(node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT: {
        this.#addElement(node)
        break
      }
      case NODE_TYPE.TEXT: {
        this.#addText(node)
        break
      }
    }
  }

  #addElement(node) {
    const { rawTagName, childNodes, attributes } = node

    const tag = normalizeTagName(rawTagName)
    this.#lines.push(`h(${tag}, {}, [`)
    this.#imports.add('h')
    this.#stack.unshift(']),')

    childNodes.forEach((node) => this.#addNode(node))

    this.#addLineFromStack()
  }

  #addText(node) {
    const { rawText } = node
    const text = rawText.trim()

    if (text) {
      this.#lines.push(`hString('${text}'),`)
      this.#imports.add('hString')
    }
  }

  #addLineFromStack() {
    let line = this.#stack.shift()
    const prevIdx = this.#lines.length - 1
    const prevLine = this.#lines[prevIdx]

    // Avoid the comma if the next character is a closing parenthesis.
    // The ",)" sequence is not valid JavaScript.
    if (prevLine.endsWith(',') && line.startsWith(')')) {
      this.#lines[prevIdx] = prevLine.slice(0, -1)
    }

    this.#lines.push(line)
  }

  #moveStackToLines() {
    while (this.#stack.length) {
      this.#addLineFromStack()
    }
  }
}

export function compileTemplate(template) {
  const { childNodes } = parse(normalize(template))
  const lines = ['function render() {', 'return (']
  const stack = [')', '}']
  const imports = new Set()

  for (const node of childNodes) {
    addNode(node)
  }

  if (lines[lines.length - 1].endsWith(',')) {
    lines[lines.length - 1] = lines[lines.length - 1].slice(0, -1)
  }

  while (stack.length) {
    addLineFromStack()
  }

  function addLineFromStack() {
    const line = stack.shift()
    lines.push(line)
  }

  function addNode(node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT: {
        addElement(node)
        break
      }
      case NODE_TYPE.TEXT: {
        addText(node)
        break
      }
    }
  }

  function addElement(node) {
    const { rawTagName, childNodes, attributes } = node

    const tag = normalizeTagName(rawTagName)
    lines.push(`h(${tag}, {}, [`)
    imports.add('h')

    childNodes.forEach(addNode)

    stack.unshift(']),')
  }

  function addText(node) {
    const { rawText } = node
    const text = rawText.trim()

    if (text) {
      lines.push(`'${text}',`)
    }
  }

  return {
    imports: imports,
    code: lines.join(' '),
  }
}

/**
 * Removes newlines and replaces all the whitespace between tags.
 *
 * @param {string} str the string to normalize
 * @returns {string} the normalized string
 */
function normalize(str) {
  return str.replace(/\n/g, ' ').replace(/>\s+</g, '><').trim()
}
