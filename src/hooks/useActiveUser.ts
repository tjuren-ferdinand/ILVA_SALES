import { useSession } from './useSession'

export type ActiveUser = {
  id: string
  name: string
  role: string
  image?: string
}

export function useActiveUser() {
  const { activeEmployee, timeLabel, logout } = useSession()

  const user: ActiveUser | null = activeEmployee
    ? {
        id: activeEmployee.id,
        name: activeEmployee.name,
        role: activeEmployee.role,
        image: activeEmployee.image,
      }
    : null

  return {
    user,
    activate: (_: ActiveUser) => {},
    deactivate: logout,
    timeLabel,
    remaining: 0,
  }
}
