import { beforeEach, describe, expect, test } from 'vitest'
import { defineComponent } from '../component'
import { h } from '../h'

// References from Euclid's Elements, Book I
// http://aleph0.clarku.edu/~djoyce/elements/bookI/bookI.html#defs

const Comp = defineComponent({
  render() {
    return h('p', {}, ['A point is that which has no part.'])
  },
})

describe('A component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('can be mounted into the DOM', () => {
    new Comp().mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p>'
    )
  })

  test("can't be mounted twice", () => {
    const comp = new Comp()
    comp.mount(document.body)

    expect(() => comp.mount(document.body)).toThrow(/already mounted/)
  })

  test('can be unmounted', () => {
    const comp = new Comp()
    comp.mount(document.body)
    comp.unmount()

    expect(document.body.innerHTML).toBe('')
  })

  test("can't be unmounted if it wasn't mounted", () => {
    const comp = new Comp()
    expect(() => comp.unmount()).toThrow(/not mounted/)
  })

  test('can be mounted after being unmounted', () => {
    const comp = new Comp()
    comp.mount(document.body)
    comp.unmount()
    comp.mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p>'
    )
  })
})
