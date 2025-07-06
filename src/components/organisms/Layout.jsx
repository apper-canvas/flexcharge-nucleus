import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'

const Layout = () => {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar />
        
        {/* Header with proper z-index positioning */}
        <div className="lg:pl-64 relative z-40">
          <Header />
        </div>
        
        <main className="lg:pl-64 relative z-0">
          <div className="p-6 lg:p-8 relative">
            <Outlet />
          </div>
        </main>
      </div>
    )
  }

export default Layout