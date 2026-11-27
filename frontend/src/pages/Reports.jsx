
import { useMemo, useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Users,
  Download,
  CalendarDays,
  FileText,
  IndianRupee,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

const monthlyData = [
  { month: 'Jan', sales: 185000, purchases: 120000 },
  { month: 'Feb', sales: 220000, purchases: 145000 },
  { month: 'Mar', sales: 195000, purchases: 130000 },
  { month: 'Apr', sales: 260000, purchases: 180000 },
  { month: 'May', sales: 240000, purchases: 155000 },
  { month: 'Jun', sales: 310000, purchases: 210000 },
  { month: 'Jul', sales: 285000, purchases: 195000 },
  { month: 'Aug', sales: 340000, purchases: 230000 },
  { month: 'Sep', sales: 295000, purchases: 200000 },
  { month: 'Oct', sales: 380000, purchases: 250000 },
  { month: 'Nov', sales: 420000, purchases: 275000 },
  { month: 'Dec', sales: 0, purchases: 0 },
]

const categoryData = [
  { name: 'Rum', value: 35 },
  { name: 'Whisky', value: 28 },
  { name: 'Vodka', value: 20 },
  { name: 'Beer', value: 17 },
]

const productData = [
  {
    id: 1,
    name: 'Khukuri Rum',
    sku: 'RUM-001',
    sold: 240,
    revenue: 360000,
    stock: 162,
  },
  {
    id: 2,
    name: '8848 Vodka',
    sku: 'VOD-001',
    sold: 180,
    revenue: 324000,
    stock: 108,
  },
  {
    id: 3,
    name: 'Signature Whisky',
    sku: 'WHI-001',
    sold: 145,
    revenue: 261000,
    stock: 84,
  },
  {
    id: 4,
    name: 'Tuborg Beer',
    sku: 'BEER-001',
    sold: 320,
    revenue: 160000,
    stock: 108,
  },
]

const transactionData = [
  {
    id: 1,
    invoice: 'SAL-001',
    type: 'Sale',
    party: 'New Sunrise Store',
    date: '2026-11-22',
    amount: 36000,
  },
  {
    id: 2,
    invoice: 'PUR-001',
    type: 'Purchase',
    party: 'ABC Beverage Suppliers',
    date: '2026-11-20',
    amount: 144000,
  },
  {
    id: 3,
    invoice: 'SAL-002',
    type: 'Sale',
    party: 'Himalayan Mart',
    date: '2026-11-19',
    amount: 18000,
  },
  {
    id: 4,
    invoice: 'PUR-002',
    type: 'Purchase',
    party: 'XYZ Distributors',
    date: '2026-11-18',
    amount: 96000,
  },
]

const formatCurrency = (value) =>
  `Rs. ${Number(value || 0).toLocaleString('en-IN')}`

const formatNumber = (value) =>
  Number(value || 0).toLocaleString('en-IN')

const COLORS = ['#2563eb', '#7c3aed', '#0891b2', '#d97706']

export default function Reports() {
  const [period, setPeriod] = useState('year')
  const [reportType, setReportType] = useState('all')

  const filteredMonths = useMemo(() => {
    if (period === 'last3') return monthlyData.slice(8, 11)
    if (period === 'last6') return monthlyData.slice(5, 11)
    if (period === 'year') return monthlyData.slice(0, 11)
    return monthlyData
  }, [period])

  const totalSales = filteredMonths.reduce(
    (sum, item) => sum + item.sales,
    0,
  )

  const totalPurchases = filteredMonths.reduce(
    (sum, item) => sum + item.purchases,
    0,
  )

  const grossDifference = totalSales - totalPurchases

  const filteredTransactions = transactionData.filter((item) => {
    return reportType === 'all' || item.type.toLowerCase() === reportType
  })

  const handleExport = () => {
    const rows = [
      ['Invoice', 'Type', 'Party', 'Date', 'Amount'],
      ...filteredTransactions.map((item) => [
        item.invoice,
        item.type,
        item.party,
        item.date,
        item.amount,
      ]),
    ]

    const csvContent = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(','),
      )
      .join('\n')

    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = 'ganesh-trade-transactions-report.csv'
    link.click()

    URL.revokeObjectURL(url)
  }

  const summaryCards = [
    {
      title: 'Total Sales',
      value: formatCurrency(totalSales),
      subtitle: 'Sales in selected period',
      icon: TrendingUp,
      iconStyle: 'bg-green-50 text-green-600',
    },
    {
      title: 'Total Purchases',
      value: formatCurrency(totalPurchases),
      subtitle: 'Purchases in selected period',
      icon: ShoppingCart,
      iconStyle: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Sales - Purchases',
      value: formatCurrency(grossDifference),
      subtitle: 'Difference before expenses',
      icon: IndianRupee,
      iconStyle: 'bg-purple-50 text-purple-600',
    },
    {
      title: 'Products',
      value: formatNumber(productData.length),
      subtitle: 'Products in sample data',
      icon: Package,
      iconStyle: 'bg-amber-50 text-amber-600',
    },
  ]

  return (
    <div className="space-y-6">

      {/* Page Introduction */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Business Reports
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Analyze sales, purchases, inventory, and product performance.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Download size={17} />
          Export Transactions CSV
        </button>
      </div>

      {/* Period Filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <CalendarDays size={18} className="text-slate-500" />
          Report Period
        </div>

        <select
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-blue-500"
        >
          <option value="last3">Last 3 months</option>
          <option value="last6">Last 6 months</option>
          <option value="year">Current year</option>
          <option value="all">All sample months</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-slate-800">
                    {card.value}
                  </h3>
                </div>

                <div className={`rounded-lg p-3 ${card.iconStyle}`}>
                  <Icon size={22} />
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-400">
                {card.subtitle}
              </p>
            </div>
          )
        })}
      </div>

      {/* Sales and Purchase Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800">
            Sales vs Purchases
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Monthly comparison of sales and purchases.
          </p>
        </div>

        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredMonths}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
              />
              <XAxis dataKey="month" />
              <YAxis
                tickFormatter={(value) =>
                  `${Math.round(value / 1000)}k`
                }
              />
              <Tooltip
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar
                dataKey="sales"
                name="Sales"
                fill="#2563eb"
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="purchases"
                name="Purchases"
                fill="#10b981"
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution and Performance */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800">
            Sales by Category
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Distribution of sample sales across categories.
          </p>

          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
            <div className="h-[240px] w-full sm:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    innerRadius={48}
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => `${value}%`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full space-y-4 sm:w-1/2">
              {categoryData.map((category, index) => (
                <div
                  key={category.name}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />
                    <span className="text-sm text-slate-600">
                      {category.name}
                    </span>
                  </div>

                  <span className="text-sm font-semibold text-slate-800">
                    {category.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-slate-800">
              Top Selling Products
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Products ranked by sample quantity sold.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px] text-left text-sm">
              <thead className="border-b border-slate-100 text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3">Product</th>
                  <th className="py-3">Sold</th>
                  <th className="py-3 text-right">Revenue</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {[...productData]
                  .sort((a, b) => b.sold - a.sold)
                  .map((product) => (
                    <tr key={product.id}>
                      <td className="py-4">
                        <p className="font-medium text-slate-800">
                          {product.name}
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                          {product.sku}
                        </p>
                      </td>

                      <td className="py-4 text-slate-600">
                        {formatNumber(product.sold)}
                      </td>

                      <td className="py-4 text-right font-medium text-slate-800">
                        {formatCurrency(product.revenue)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Inventory Summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
            <Package size={21} />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Inventory Summary
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Current sample stock by product.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Current Stock</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {productData.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-4 font-medium text-slate-800">
                    {product.name}
                  </td>

                  <td className="px-4 py-4 text-slate-500">
                    {product.sku}
                  </td>

                  <td className="px-4 py-4 font-semibold text-slate-700">
                    {product.stock} bottles
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.stock <= 24
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {product.stock <= 24 ? 'Low Stock' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Report */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              Transaction Report
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Recent sales and purchase invoices.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <FileText size={19} className="text-slate-400" />

            <select
              value={reportType}
              onChange={(event) => setReportType(event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-500"
            >
              <option value="all">All Transactions</option>
              <option value="sale">Sales Only</option>
              <option value="purchase">Purchases Only</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Invoice</th>
                <th className="px-5 py-4">Type</th>
                <th className="px-5 py-4">Customer / Supplier</th>
                <th className="px-5 py-4">Date</th>
                <th className="px-5 py-4 text-right">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {transaction.invoice}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        transaction.type === 'Sale'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {transaction.party}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {transaction.date}
                  </td>

                  <td className="px-5 py-4 text-right font-semibold text-slate-800">
                    {formatCurrency(transaction.amount)}
                  </td>
                </tr>
              ))}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Note */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex gap-3">
          <BarChart3
            size={21}
            className="mt-0.5 shrink-0 text-blue-600"
          />
          <div>
            <h4 className="text-sm font-semibold text-blue-900">
              Report Information
            </h4>
            <p className="mt-1 text-sm leading-6 text-blue-800">
              These reports currently use demonstration data. Sales minus
              purchases is a simple transaction difference, not net profit.
              Actual reports will be calculated from completed transactions
              and stock records after backend integration.
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
