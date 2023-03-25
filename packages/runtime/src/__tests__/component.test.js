import { beforeEach, describe, expect, test } from 'vitest'
import { defineComponent } from '../component'
import { h } from '../h'

// References from Euclid's Elements, Book I
// http://aleph0.clarku.edu/~djoyce/elements/bookI/bookI.html#defs

describe('A component', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  test('can be mounted into the DOM', () => {
    const Comp = defineComponent({
      render() {
        return h('p', {}, ['A point is that which has no part.'])
      },
    })

    new Comp().mount(document.body)

    expect(document.body.innerHTML).toBe(
      '<p>A point is that which has no part.</p>'
    )
  })
})
