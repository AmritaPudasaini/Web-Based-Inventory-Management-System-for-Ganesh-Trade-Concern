
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Categories from './pages/Categories'
import Suppliers from './pages/Suppliers'
import Customers from './pages/Customers'
import Purchases from './pages/Purchases'
import Sales from './pages/Sales'
import Stock from './pages/Stock'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function PlaceholderPage({ name }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8">
      <h1 className="text-xl font-semibold text-slate-800">
        {name}
      </h1>

      <p className="mt-2 text-slate-500">
        This module will be developed in the upcoming stages.
      </p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />

          <Route path="categories" element={<Categories />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="purchases" element={<Purchases />} />
          <Route path="sales" element={<Sales />} />
          <Route path="customers" element={<Customers />} />
          <Route path="stock" element={<Stock />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
