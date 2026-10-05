import { Outlet } from 'react-router-dom'
import SkipToMain from './skip-to-main'

export default function AppShell() {
  return (
    <div className='relative h-full overflow-hidden bg-background'>
      <SkipToMain />
      <main
        id='content'
        className='h-full overflow-x-hidden md:overflow-y-hidden'
      >
        <Outlet />
      </main>
    </div>
  )
}
