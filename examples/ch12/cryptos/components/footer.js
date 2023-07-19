import { defineComponent, h } from 'https://unpkg.com/fe-fwk@3'

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
