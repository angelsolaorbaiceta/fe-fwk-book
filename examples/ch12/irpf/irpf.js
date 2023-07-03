/*
Los tramos del IRPF 2023

  Hasta 12.450 euros: Retención del 19%
  Desde 12.450 hasta 20.199 euros: Retención del 24%
  Desde 20.200 hasta 35.199 euros: Retención del 30%
  Desde 35.200 hasta 59.999 euros: Retención del 37%
  Desde 60.000 hasta 299.999: Retención del 45%
  Más de 300.000 euros: Retención del 47%
*/
export const irpfTiers = [
  { from: 0, to: 12_450, rate: 0.19 },
  { from: 12_450, to: 20_199, rate: 0.24 },
  { from: 20_200, to: 35_199, rate: 0.3 },
  { from: 35_200, to: 59_999, rate: 0.37 },
  { from: 60_000, to: 299_999, rate: 0.45 },
  { from: 300_000, to: Infinity, rate: 0.47 },
]

export function calculateIrpfByTier(grossSalary) {
  return irpfTiers.map((tier) =>
    parseInt(calculateTierAmount(grossSalary, tier) * tier.rate)
  )
}

function calculateTierAmount(grossSalary, tier) {
  const { from, to } = tier

  if (grossSalary < from) {
    return 0
  }

  if (grossSalary > to) {
    return to - from
  }

  return grossSalary - from
}
