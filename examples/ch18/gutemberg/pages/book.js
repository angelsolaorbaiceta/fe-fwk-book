import { getAllBooks } from '../api.js'
import { defineComponent, h, hFragment } from '../fwk.js'

export const Book = defineComponent({
  render() {
    return h('div', {}, ['Book'])
  },
})
