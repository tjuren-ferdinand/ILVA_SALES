import type { Store } from '../types'

export const stores: Store[] = [
  {
    id: 'halmstad',
    name: 'ILVA Halmstad',
    city: 'Halmstad',
    code: 'HAL',
    active: true,
    phone: '035-xxx xx xx',
    address: 'Handelsplatsen 1, 302 55 Halmstad',
    email: 'halmstad@ilva.se',
    team: [
      { id: 'simon', name: 'Simon', role: 'Säljare', image: '/team/simon.jpeg', pin: '1580', active: true },
      { id: 'johanna', name: 'Johanna', role: 'Platschef', image: '/team/johanna.jpeg', pin: '0000', active: true },
      { id: 'ida', name: 'Ida', role: 'Biträdande chef', image: '/team/ida.jpeg', pin: '0000', active: true },
      { id: 'isak', name: 'Isak', role: 'Säljare', image: '/team/isak.jpeg', pin: '0000', active: true },
      { id: 'karin', name: 'Karin', role: 'Säljare', image: '/team/karin.jpeg', pin: '0304', active: true },
      { id: 'marielle', name: 'Marielle', role: 'Säljare', image: '/team/marielle.jpeg', pin: '5153', active: true },
      { id: 'nellie', name: 'Nellie', role: 'Säljare', image: '/team/nellie.jpeg', pin: '0505', active: true },
    ],
  },
  {
    id: 'malmo',
    name: 'ILVA Malmö',
    city: 'Malmö',
    code: 'MAL',
    active: true,
    phone: '040-xxx xx xx',
    address: 'Handelsvägen 12, 215 86 Malmö',
    email: 'malmo@ilva.se',
    team: [
      { id: 'anna', name: 'Anna', role: 'Säljare', pin: '1234', active: true },
      { id: 'erik', name: 'Erik', role: 'Platschef', pin: '1111', active: true },
      { id: 'lisa', name: 'Lisa', role: 'Säljare', pin: '2222', active: true },
    ],
  },
  {
    id: 'goteborg',
    name: 'ILVA Göteborg',
    city: 'Göteborg',
    code: 'GOT',
    active: true,
    phone: '031-xxx xx xx',
    address: 'Möbelgatan 8, 411 04 Göteborg',
    email: 'goteborg@ilva.se',
    team: [
      { id: 'mats', name: 'Mats', role: 'Säljare', pin: '3333', active: true },
      { id: 'sofia', name: 'Sofia', role: 'Säljare', pin: '4444', active: true },
    ],
  },
]

export const activeStores = stores.filter((s) => s.active)

export function getStoreById(id: string): Store | undefined {
  return stores.find((s) => s.id === id)
}
