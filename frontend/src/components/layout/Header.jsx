
import { Bell, Search, UserCircle } from 'lucide-react'

export default function Header({ title }) {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-800">
          {title}
        </h2>
        <p className="text-sm text-slate-500">
          Ganesh Trade Concern Inventory System
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 md:flex">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-40 border-none bg-transparent text-sm outline-none"
          />
        </div>

        <button className="relative text-slate-600 hover:text-blue-600">
          <Bell size={21} />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <div className="flex items-center gap-3">
          <UserCircle size={35} className="text-slate-500" />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              Administrator
            </p>
            <p className="text-xs text-slate-500">
              System Admin
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
