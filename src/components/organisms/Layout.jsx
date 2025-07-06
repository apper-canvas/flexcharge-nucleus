import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'

const Layout = () => {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        
        <main className="lg:pl-64 relative z-0">
          <div className="p-6 lg:p-8 relative">
            <Outlet />
          </div>
        </main>
      </div>
    )
  }

export default Layout