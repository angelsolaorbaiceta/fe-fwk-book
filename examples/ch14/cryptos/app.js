import { createApp, defineComponent, h, hFragment } from './fwk.js'
import { AssetsList } from './components/assets-list.js'
import { Footer } from './components/footer.js'
import { Header } from './components/header.js'

const App = defineComponent({
  render() {
    return hFragment([h(Header), h('main', {}, [h(AssetsList)]), h(Footer)])
  },
})

createApp(App).mount(document.body)
