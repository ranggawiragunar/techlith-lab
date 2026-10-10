import { Outlet } from 'react-router-dom'
import { ClassroomLabProvider } from '../features/session3/ClassroomLabProvider'

export function Session3ClassroomLayout() {
  return (
    <ClassroomLabProvider>
      <Outlet />
    </ClassroomLabProvider>
  )
}
