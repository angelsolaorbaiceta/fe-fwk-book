import { defineComponent, h, hFragment } from 'https://unpkg.com/fe-fwk@3'
import { irpfTiers } from '../irpf.js'

export const IrpfTable = defineComponent({
  render() {
    const { tiers, grossSalary } = this.props
    const total = tiers.reduce((acc, curr) => acc + curr, 0)
    const effectiveRate = (total / grossSalary) * 100
    const netSalary = grossSalary - total
    const monthlyNetSalary = netSalary / 12

    return hFragment([
      h('table', {}, [
        header,
        h(
          'tbody',
          {},
          irpfTiers.map((tier, i) => TierVdom(tier, tiers[i]))
        ),
      ]),
      h('div', { style: { 'text-align': 'right' } }, [
        h('section', { class: 'result-grid' }, [
          h('span', {}, ['Total to pay:']),
          h('span', {}, [formatMoney(total)]),
          h('span', {}, ['Effective IRPF:']),
          h('span', {}, [`${effectiveRate.toFixed(2)}%`]),
          h('span', {}, ['Net Salary:']),
          h('span', {}, [formatMoney(netSalary)]),
          h('span', {}, ['Monthly Salary:']),
          h('span', {}, [formatMoney(monthlyNetSalary)]),
        ]),
      ]),
    ])
  },
})

const header = h('thead', {}, [
  h('tr', {}, [
    h('th', {}, ['Percentage']),
    h('th', {}, ['From']),
    h('th', {}, ['To']),
    h('th', {}, ['Amount']),
  ]),
])

function TierVdom(tier, amount) {
  const amountText =
    amount > 0 && Number.isFinite(amount)
      ? `€${amount.toLocaleString()}`
      : '—'

  return h(
    'tr',
    {
      class: amount > 0 ? '' : 'empty',
    },
    [
      h('td', {}, [`${parseInt(tier.rate * 100)}%`]),
      h('td', {}, [formatMoney(tier.from)]),
      h('td', {}, [formatMoney(tier.to)]),
      h('td', {}, [formatMoney(amount)]),
    ]
  )
}

function formatMoney(amount) {
  return amount > 0 && Number.isFinite(amount)
    ? `€${amount.toLocaleString()}`
    : '—'
}
