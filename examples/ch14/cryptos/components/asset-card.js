import { fetchRates } from '../api.js'
import { defineComponent, h } from '../fwk.js'
import { CoinConverter } from './coin-converter.js'

export const AssetCard = defineComponent({
  state() {
    return {
      showConverter: false,
      isLoading: false,
      rate: null,
    }
  },

  render() {
    const { asset } = this.props
    const { name, symbol, explorer, changePercent24Hr } = asset
    const { showConverter, isLoading, rate } = this.state

    return h('li', {}, [
      h('div', { class: 'card' }, [
        h('header', {}, [
          h('h3', {}, [`${name} (${symbol})`]),
          h(ChangePercent, { changePercent24Hr }),
        ]),
        h('p', { class: 'ellipsis' }, [
          'Explorer: ',
          h('a', { href: explorer, target: '_blank' }, [explorer]),
        ]),
        h('hr'),
        showConverter
          ? isLoading
            ? h('p', {}, ['Loading conversion rate...'])
            : h(CoinConverter, { name, symbol, rate })
          : h('button', { on: { click: this.showConverter } }, ['Convert']),
      ]),
    ])
  },

  async showConverter() {
    const { asset } = this.props

    this.updateState({ isLoading: true })

    const response = await fetchRates(asset.id)
    const rate = parseFloat(response?.rateUsd)

    this.updateState({ rate, showConverter: true, isLoading: false })
  },
})

const ChangePercent = defineComponent({
  render() {
    const { changePercent24Hr } = this.props
    const change = parseFloat(changePercent24Hr).toFixed(2)
    const _class = change > 0 ? 'positive' : 'negative'

    return h('div', {}, [
      h('span', { class: _class }, [`${change}%`]),
      h('span', { class: _class }, [change > 0 ? '⬆︎' : '⬇︎']),
    ])
  },
})
