import type { ResursPlan, ResursCalculation } from '../types'

export function calculateResurs(amount: number, plan: ResursPlan): ResursCalculation {
  const months = plan.months
  const rate = (plan.campaignRate ?? plan.interestRate) / 100

  // Enkel nominell ränta: ränta på hela beloppet över perioden.
  const totalInterest = Math.round(amount * rate * (months / 12))
  const totalFees = plan.setupFee + plan.monthlyFee * months
  const totalCost = amount + totalInterest + totalFees

  if (plan.type === 'deferred') {
    return {
      amount,
      months,
      type: plan.type,
      interestRate: plan.interestRate,
      setupFee: plan.setupFee,
      monthlyFee: plan.monthlyFee,
      totalInterest,
      totalFees,
      monthlyPayment: 0,
      finalPayment: totalCost,
      totalCost,
      financedAmount: amount,
    }
  }

  // Delbetalning: jämn kostnad spridd över månaderna.
  const monthlyPayment = Math.round(totalCost / months)

  return {
    amount,
    months,
    type: plan.type,
    interestRate: plan.interestRate,
    setupFee: plan.setupFee,
    monthlyFee: plan.monthlyFee,
    totalInterest,
    totalFees,
    monthlyPayment,
    finalPayment: 0,
    totalCost: monthlyPayment * months,
    financedAmount: amount,
  }
}
