import { defineComponent, h, hFragment } from '../fwk.js'

export const Header = defineComponent({
  render() {
    return h('header', { class: 'header' }, [
      h('h1', {}, ['Cryptocurrencies']),
    ])
  },
})
