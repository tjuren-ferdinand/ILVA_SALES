import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'God morgon'
  if (hour < 17) return 'God eftermiddag'
  return 'God kväll'
}
