import {
  createApp,
  defineComponent,
  h,
  hFragment,
} from 'https://unpkg.com/fe-fwk@3'
import { calculateIrpfByTier } from './irpf.js'
import { IrpfTable } from './components/table.js'

const App = defineComponent({
  state() {
    return {
      grossSalary: 30_000,
    }
  },
  render() {
    const { grossSalary } = this.state
    const irpf = calculateIrpfByTier(grossSalary)

    return hFragment([
      h('h1', {}, ['IRPF Calculator']),
      h('form', {}, [
        h('label', {}, ['Gross Salary']),
        h('input', {
          type: 'number',
          value: grossSalary,
          on: {
            input: ({ target }) =>
              this.updateState({ grossSalary: target.valueAsNumber }),
          },
        }),
      ]),
      h('h2', {}, ['Result']),
      h(IrpfTable, { tiers: irpf, grossSalary }),
    ])
  },
})

const host = document.getElementById('app')
createApp(App).mount(host)
