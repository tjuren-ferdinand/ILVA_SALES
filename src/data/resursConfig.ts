import type { ResursPlan } from '../types'

// Konfigurerbara exempelvillkor – ska justeras efter aktuellt avtal med Resurs.
export const resursPlans: ResursPlan[] = [
  {
    id: 'deferred-6',
    name: 'Betala hela beloppet senare',
    type: 'deferred',
    months: 6,
    interestRate: 0,
    setupFee: 0,
    monthlyFee: 0,
    active: true,
    displayOrder: 1,
  },
  {
    id: 'deferred-9',
    name: 'Betala hela beloppet senare',
    type: 'deferred',
    months: 9,
    interestRate: 0,
    setupFee: 0,
    monthlyFee: 0,
    active: true,
    displayOrder: 2,
  },
  {
    id: 'installment-12',
    name: 'Dela upp betalningen',
    type: 'installment',
    months: 12,
    interestRate: 14.9,
    setupFee: 49500,
    monthlyFee: 3500,
    active: true,
    displayOrder: 3,
  },
  {
    id: 'installment-24',
    name: 'Dela upp betalningen',
    type: 'installment',
    months: 24,
    interestRate: 14.9,
    setupFee: 49500,
    monthlyFee: 3500,
    active: true,
    displayOrder: 4,
  },
]

export const activeResursPlans = resursPlans
  .filter((p) => p.active)
  .sort((a, b) => a.displayOrder - b.displayOrder)
