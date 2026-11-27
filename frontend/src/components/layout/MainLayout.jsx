
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
  '/categories': 'Categories',
  '/suppliers': 'Suppliers',
  '/purchases': 'Purchases',
  '/sales': 'Sales',
  '/customers': 'Customers',
  '/stock': 'Stock Management',
  '/reports': 'Reports',
  '/settings': 'Settings',
}

export default function MainLayout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Inventory Management'

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header title={title} />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
