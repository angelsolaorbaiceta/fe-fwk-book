import { defineComponent, h } from '../fwk.js'

export const CoinConverter = defineComponent({
  state() {
    return {
      amount: 1,
    }
  },

  render() {
    const { name, symbol, rate } = this.props
    const { amount } = this.state

    if (!rate) {
      return h('p', { class: 'error' }, ['No conversion rate available'])
    }

    return h('div', {}, [
      h('h4', {}, [`Convert ${name} to USD`]),
      h(
        'input',
        {
          type: 'number',
          value: amount,
          on: {
            input: () => this.updateState({ amount: event.target.value }),
          },
        },
        []
      ),
      h('span', {}, [`${symbol} = ${(amount * rate).toFixed(2)} USD`]),
    ])
  },
})
