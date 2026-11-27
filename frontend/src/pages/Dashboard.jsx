
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

const summaryCards = [
  {
    title: 'Total Products',
    value: '248',
    change: '+12 this month',
    icon: Package,
    color: 'blue',
  },
  {
    title: 'Total Purchases',
    value: 'Rs. 485,000',
    change: '+8.2% this month',
    icon: ShoppingCart,
    color: 'violet',
  },
  {
    title: 'Total Sales',
    value: 'Rs. 625,000',
    change: '+12.5% this month',
    icon: TrendingUp,
    color: 'emerald',
  },
  {
    title: 'Low Stock Items',
    value: '12',
    change: 'Requires attention',
    icon: AlertTriangle,
    color: 'amber',
  },
]

const salesData = [
  { month: 'Jan', sales: 32000 },
  { month: 'Feb', sales: 45000 },
  { month: 'Mar', sales: 38000 },
  { month: 'Apr', sales: 52000 },
  { month: 'May', sales: 48000 },
  { month: 'Jun', sales: 65000 },
  { month: 'Jul', sales: 59000 },
  { month: 'Aug', sales: 72000 },
  { month: 'Sep', sales: 68000 },
  { month: 'Oct', sales: 85000 },
  { month: 'Nov', sales: 78000 },
  { month: 'Dec', sales: 92000 },
]

const recentTransactions = [
  {
    id: 'PUR-001',
    type: 'Purchase',
    party: 'ABC Beverage Suppliers',
    date: 'Nov 25, 2026',
    amount: 'Rs. 45,000',
    status: 'Completed',
  },
  {
    id: 'SAL-001',
    type: 'Sale',
    party: 'Shree Retail Shop',
    date: 'Nov 25, 2026',
    amount: 'Rs. 18,500',
    status: 'Completed',
  },
  {
    id: 'SAL-002',
    type: 'Sale',
    party: 'Mountain Grocery',
    date: 'Nov 24, 2026',
    amount: 'Rs. 12,800',
    status: 'Completed',
  },
  {
    id: 'PUR-002',
    type: 'Purchase',
    party: 'XYZ Distributors',
    date: 'Nov 23, 2026',
    amount: 'Rs. 32,000',
    status: 'Pending',
  },
]

const lowStockItems = [
  { name: 'Khukuri Rum', sku: 'KHU-001', stock: 18, unit: 'bottles' },
  { name: 'Vodka', sku: 'VOD-002', stock: 8, unit: 'bottles' },
  { name: 'Whisky', sku: 'WHI-003', stock: 12, unit: 'bottles' },
  { name: 'Beer', sku: 'BEER-004', stock: 6, unit: 'bottles' },
]

const colorStyles = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
  },
  violet: {
    bg: 'bg-violet-50',
    icon: 'text-violet-600',
  },
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
  },
}

function SummaryCard({ card }) {
  const Icon = card.icon
  const colors = colorStyles[card.color]

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {card.title}
          </p>

          <h3 className="mt-3 text-2xl font-bold text-slate-800">
            {card.value}
          </h3>

          <p className="mt-2 text-xs text-slate-500">
            {card.change}
          </p>
        </div>

        <div className={`rounded-xl p-3 ${colors.bg}`}>
          <Icon size={22} className={colors.icon} />
        </div>
      </div>
    </div>
  )
}

function SalesChart() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-800">
          Sales Overview
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Monthly sales performance
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={salesData}>
            <defs>
              <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopOpacity={0.25} />
                <stop offset="95%" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${value / 1000}k`}
            />

            <Tooltip
              formatter={(value) => [`Rs. ${value.toLocaleString()}`, 'Sales']}
            />

            <Area
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={2.5}
              fill="url(#salesGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function RecentTransactions() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <h2 className="text-lg font-semibold text-slate-800">
          Recent Transactions
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Latest purchases and sales
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-5 py-3">Invoice</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Party</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {recentTransactions.map((transaction) => (
              <tr key={transaction.id} className="border-t border-slate-100">
                <td className="px-5 py-4 font-medium text-slate-700">
                  {transaction.id}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      transaction.type === 'Purchase'
                        ? 'bg-violet-50 text-violet-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {transaction.party}
                </td>

                <td className="px-5 py-4 font-medium text-slate-700">
                  {transaction.amount}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      transaction.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function LowStockTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle size={19} className="text-amber-500" />

          <h2 className="text-lg font-semibold text-slate-800">
            Low Stock Alerts
          </h2>
        </div>

        <p className="mt-1 text-sm text-slate-500">
          Products that need replenishment
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {lowStockItems.map((product) => (
          <div
            key={product.sku}
            className="flex items-center justify-between px-5 py-4"
          >
            <div>
              <p className="font-medium text-slate-800">
                {product.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {product.sku}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold text-amber-600">
                {product.stock} {product.unit}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Low stock
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Overview of your inventory and business performance.
          </p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
          November 2026
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <SummaryCard key={card.title} card={card} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <SalesChart />
        </div>

        <div>
          <LowStockTable />
        </div>
      </div>

      <RecentTransactions />

      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <TrendingUp size={20} className="mt-1 text-blue-600" />

          <div>
            <h3 className="font-semibold text-blue-900">
              Inventory Management
            </h3>

            <p className="mt-1 text-sm text-blue-800">
              Monitor purchases, sales, stock levels and business activity
              from one central dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
