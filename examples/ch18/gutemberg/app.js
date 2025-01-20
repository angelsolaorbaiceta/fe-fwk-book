import {
  createApp,
  defineComponent,
  h,
  hFragment,
  RouterOutlet,
} from './fwk.js'
import { router } from './router.js'

const App = defineComponent({
  render() {
    return hFragment([
      h('header', { class: 'header' }, [
        h('h1', {}, ['Gutemberg Books']),
        h('p', {}, [
          'This is a simple app that uses the ',
          h('a', { href: 'https://gutendex.com/' }, ['Gutemberg API']),
          ' to display books.',
        ]),
      ]),

      h('main', {}, [h(RouterOutlet)]),

      h('footer', { class: 'footer' }, [
        'Made with ❤️ using my own framework.',
      ]),
    ])
  },
})

createApp(App, {}, { router }).mount(document.getElementById('app'))
