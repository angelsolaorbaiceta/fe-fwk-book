import { fetchAssets } from '../api.js'
import { defineComponent, h, hFragment } from '../fwk.js'
import { AssetCard } from './asset-card.js'

export const AssetsList = defineComponent({
  state() {
    return {
      assets: [],
      isLoading: false,
      offset: 10,
    }
  },

  async onMounted() {
    this.updateState({ isLoading: true })
    const assets = await fetchAssets()
    this.updateState({ assets, isLoading: false })
  },

  render() {
    const { assets, isLoading } = this.state

    if (assets.length === 0 && isLoading) {
      return h('p', {}, ['Loading assets...'])
    }

    return hFragment([
      h(
        'ul',
        {},
        assets.map((asset) => h(AssetCard, { asset, key: asset.id }))
      ),
      h('p', {}, [
        'Showing ',
        h('strong', {}, [`${assets.length}`]),
        ' assets',
      ]),
      isLoading
        ? h('p', {}, ['Loading...'])
        : h('button', { on: { click: this.loadMore } }, ['Load more']),
    ])
  },

  async loadMore() {
    const { offset, assets } = this.state
    this.updateState({ isLoading: true })

    const newAssets = await fetchAssets(10, offset)

    setTimeout(() => {
      this.updateState({
        assets: [...assets, ...newAssets],
        isLoading: false,
        offset: offset + 10,
      })
    }, 1000)
  },
})
