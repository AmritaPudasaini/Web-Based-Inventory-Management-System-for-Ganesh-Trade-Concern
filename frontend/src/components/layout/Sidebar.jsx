
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  Tags,
  Truck,
  ShoppingCart,
  Receipt,
  Users,
  Boxes,
  BarChart3,
  Settings,
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Products', path: '/products', icon: Package },
  { name: 'Categories', path: '/categories', icon: Tags },
  { name: 'Suppliers', path: '/suppliers', icon: Truck },
  { name: 'Purchases', path: '/purchases', icon: ShoppingCart },
  { name: 'Sales', path: '/sales', icon: Receipt },
  { name: 'Customers', path: '/customers', icon: Users },
  { name: 'Stock', path: '/stock', icon: Boxes },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
]

export default function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="border-b border-slate-800 px-6 py-6">
        <h1 className="text-xl font-bold tracking-wide">
          Ganesh Trade Concern
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          Inventory Management
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-slate-800 px-6 py-4">
        <p className="text-xs text-slate-500">
          Ganesh Trade Concern
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Inventory System v1.0
        </p>
      </div>
    </aside>
  )
}
