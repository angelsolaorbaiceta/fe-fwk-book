import { defineComponent, h, hFragment } from 'https://unpkg.com/fe-fwk@3'

export const Header = defineComponent({
  render() {
    return h('header', { class: 'header' }, [
      h('h1', {}, ['Cryptocurrencies']),
    ])
  },
})
