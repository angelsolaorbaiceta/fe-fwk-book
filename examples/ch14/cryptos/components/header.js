import { defineComponent, h, hFragment } from 'https://unpkg.com/fe-fwk@4'

export const Header = defineComponent({
  render() {
    return h('header', { class: 'header' }, [
      h('h1', {}, ['Cryptocurrencies']),
    ])
  },
})
