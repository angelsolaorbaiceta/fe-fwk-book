import { defineComponent, h, hFragment } from 'https://unpkg.com/fe-fwk@3'
import { fetchAssets } from '../api.js'
import { AssetCard } from './asset-card.js'

const data = await fetchAssets()

export const AssetsList = defineComponent({
  state() {
    return {
      assets: data,
      isLoading: false,
      offset: 10,
    }
  },

  render() {
    const { assets, isLoading } = this.state

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

  loadMore() {
    this.updateState({ isLoading: true })
    fetchAssets(10, this.state.offset).then((assets) => {
      setTimeout(() => {
        this.updateState({
          assets: [...this.state.assets, ...assets],
          isLoading: false,
          offset: this.state.offset + 10,
        })
      }, 1000)
    })
  },
})
