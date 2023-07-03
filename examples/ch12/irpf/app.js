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
      h('p', {}, [
        "The following results are an approximation, as the calculation doesn't take into account the deductions on the gross salary. Below is the breakdown of the IRPF tiers, and the amount to pay in each tier.",
      ]),
      h(IrpfTable, { tiers: irpf, grossSalary }),
    ])
  },
})

createApp(App).mount(document.body)
