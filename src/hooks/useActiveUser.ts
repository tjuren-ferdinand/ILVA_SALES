import { useSession } from './useSession'

export type ActiveUser = {
  id: string
  name: string
  role: string
  image?: string
}

export function useActiveUser() {
  const { activeEmployee, isEmployeeActive, timeLabel, logout } = useSession()

  const user: ActiveUser | null = (activeEmployee && isEmployeeActive)
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
