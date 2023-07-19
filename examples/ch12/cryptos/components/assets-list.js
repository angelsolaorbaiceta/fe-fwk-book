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
