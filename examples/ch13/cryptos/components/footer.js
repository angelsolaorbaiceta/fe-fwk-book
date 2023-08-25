import { defineComponent, h } from '../fwk.js'

export const Footer = defineComponent({
  render() {
    return h('footer', {}, [
      h('p', {}, [
        `Made with ❤️ with my own `,
        h(
          'a',
          { href: 'https://github.com/angelsolaorbaiceta/fe-fwk-book' },
          ['frontend framework']
        ),
        '.',
      ]),
    ])
  },
})
