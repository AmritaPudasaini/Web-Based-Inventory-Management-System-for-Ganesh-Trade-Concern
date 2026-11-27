
import { useMemo, useState } from 'react'
import {
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Plus,
  X,
  Eye,
  ArrowDownToLine,
  ArrowUpFromLine,
  History,
} from 'lucide-react'

const initialProducts = [
  {
    id: 1,
    name: 'Khukuri Rum',
    sku: 'RUM-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    openingStock: 120,
    purchasedStock: 60,
    soldStock: 18,
    adjustmentIn: 0,
    adjustmentOut: 0,
    minimumStock: 24,
  },
  {
    id: 2,
    name: '8848 Vodka',
    sku: 'VOD-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    openingStock: 96,
    purchasedStock: 24,
    soldStock: 12,
    adjustmentIn: 0,
    adjustmentOut: 0,
    minimumStock: 24,
  },
  {
    id: 3,
    name: 'Signature Whisky',
    sku: 'WHI-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    openingStock: 72,
    purchasedStock: 24,
    soldStock: 12,
    adjustmentIn: 0,
    adjustmentOut: 0,
    minimumStock: 24,
  },
  {
    id: 4,
    name: 'Tuborg Beer',
    sku: 'BEER-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    openingStock: 120,
    purchasedStock: 24,
    soldStock: 36,
    adjustmentIn: 0,
    adjustmentOut: 0,
    minimumStock: 36,
  },
]

const initialMovements = [
  {
    id: 1,
    productId: 1,
    type: 'opening',
    quantity: 120,
    reference: 'OPEN-001',
    date: '2026-11-01',
    notes: 'Initial stock entry',
  },
  {
    id: 2,
    productId: 1,
    type: 'purchase',
    quantity: 60,
    reference: 'PUR-001',
    date: '2026-11-20',
    notes: 'Supplier purchase',
  },
  {
    id: 3,
    productId: 1,
    type: 'sale',
    quantity: 18,
    reference: 'SAL-001',
    date: '2026-11-22',
    notes: 'Customer sale',
  },
  {
    id: 4,
    productId: 2,
    type: 'opening',
    quantity: 96,
    reference: 'OPEN-002',
    date: '2026-11-01',
    notes: 'Initial stock entry',
  },
]

const emptyForm = {
  productId: '',
  type: 'adjustment_in',
  quantity: '',
  reference: '',
  date: new Date().toISOString().split('T')[0],
  notes: '',
}

const formatNumber = (value) =>
  Number(value || 0).toLocaleString('en-IN')

const getCurrentStock = (product) =>
  product.openingStock +
  product.purchasedStock -
  product.soldStock +
  product.adjustmentIn -
  product.adjustmentOut

const getStockDisplay = (quantity, unitsPerCarton) => {
  const cartons = Math.floor(quantity / unitsPerCarton)
  const bottles = quantity % unitsPerCarton

  return `${cartons} cartons ${bottles} bottles`
}

const movementLabels = {
  opening: 'Opening Stock',
  purchase: 'Purchase',
  sale: 'Sale',
  adjustment_in: 'Adjustment In',
  adjustment_out: 'Adjustment Out',
}

export default function Stock() {
  const [products, setProducts] = useState(initialProducts)
  const [movements, setMovements] = useState(initialMovements)

  const [search, setSearch] = useState('')
  const [stockFilter, setStockFilter] = useState('all')
  const [movementFilter, setMovementFilter] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  const [form, setForm] = useState(emptyForm)

  const stockProducts = useMemo(() => {
    return products.map((product) => ({
      ...product,
      currentStock: getCurrentStock(product),
    }))
  }, [products])

  const filteredProducts = stockProducts.filter((product) => {
    const query = search.toLowerCase()

    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)

    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'low' &&
        product.currentStock <= product.minimumStock) ||
      (stockFilter === 'available' &&
        product.currentStock > product.minimumStock) ||
      (stockFilter === 'out' && product.currentStock <= 0)

    return matchesSearch && matchesStock
  })

  const totalProducts = products.length

  const totalStockUnits = stockProducts.reduce(
    (sum, product) => sum + product.currentStock,
    0,
  )

  const lowStockCount = stockProducts.filter(
    (product) =>
      product.currentStock > 0 &&
      product.currentStock <= product.minimumStock,
  ).length

  const outOfStockCount = stockProducts.filter(
    (product) => product.currentStock <= 0,
  ).length

  const filteredMovements = movements.filter((movement) => {
    const product = products.find(
      (item) => item.id === movement.productId,
    )

    const query = search.toLowerCase()

    const matchesSearch =
      product?.name.toLowerCase().includes(query) ||
      movement.reference.toLowerCase().includes(query)

    const matchesType =
      movementFilter === 'all' ||
      movement.type === movementFilter

    const matchesProduct =
      !selectedProduct ||
      movement.productId === selectedProduct.id

    return matchesSearch && matchesType && matchesProduct
  })

  const openAdjustmentModal = (type = 'adjustment_in') => {
    setSelectedProduct(null)
    setForm({
      ...emptyForm,
      type,
    })
    setShowModal(true)
  }

  const handleFormChange = (event) => {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const product = products.find(
      (item) => item.id === Number(form.productId),
    )

    if (!product) {
      alert('Please select a product.')
      return
    }

    const quantity = Number(form.quantity)

    if (!Number.isFinite(quantity) || quantity <= 0) {
      alert('Please enter a valid positive quantity.')
      return
    }

    if (
      form.type === 'adjustment_out' &&
      quantity > getCurrentStock(product)
    ) {
      alert('Adjustment quantity exceeds the available stock.')
      return
    }

    const reference =
      form.reference.trim() ||
      `ADJ-${String(Date.now()).slice(-6)}`

    const newMovement = {
      id: Date.now(),
      productId: product.id,
      type: form.type,
      quantity,
      reference,
      date: form.date,
      notes: form.notes.trim(),
    }

    setProducts((previous) =>
      previous.map((item) => {
        if (item.id !== product.id) return item

        if (form.type === 'adjustment_in') {
          return {
            ...item,
            adjustmentIn: item.adjustmentIn + quantity,
          }
        }

        if (form.type === 'adjustment_out') {
          return {
            ...item,
            adjustmentOut: item.adjustmentOut + quantity,
          }
        }

        return item
      }),
    )

    setMovements((previous) => [
      newMovement,
      ...previous,
    ])

    setShowModal(false)
    setForm(emptyForm)
  }

  const openProductHistory = (product) => {
    setSelectedProduct(product)
    setShowHistory(true)
  }

  const closeHistory = () => {
    setSelectedProduct(null)
    setShowHistory(false)
  }

  const getMovementClass = (type) => {
    if (type === 'purchase' || type === 'opening' || type === 'adjustment_in') {
      return 'bg-green-50 text-green-700'
    }

    return 'bg-red-50 text-red-700'
  }

  const getMovementIcon = (type) => {
    if (type === 'purchase' || type === 'opening' || type === 'adjustment_in') {
      return <ArrowDownToLine size={16} />
    }

    return <ArrowUpFromLine size={16} />
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Products</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {totalProducts}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Package size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Stock</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {formatNumber(totalStockUnits)}
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Base units across products
              </p>
            </div>
            <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
              <Package size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Low Stock Products</p>
              <h2 className="mt-2 text-2xl font-bold text-amber-600">
                {lowStockCount}
              </h2>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <AlertTriangle size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Out of Stock</p>
              <h2 className="mt-2 text-2xl font-bold text-red-600">
                {outOfStockCount}
              </h2>
            </div>
            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <Package size={23} />
            </div>
          </div>
        </div>

      </div>

      {/* Stock Overview */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Current Stock
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Monitor available quantities for each product.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => openAdjustmentModal('adjustment_in')}
              className="flex items-center gap-2 rounded-lg border border-green-200 px-3 py-2.5 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              <TrendingUp size={17} />
              Stock In
            </button>

            <button
              onClick={() => openAdjustmentModal('adjustment_out')}
              className="flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <TrendingDown size={17} />
              Stock Out
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search product or SKU..."
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={stockFilter}
            onChange={(event) => setStockFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Stock</option>
            <option value="available">Available</option>
            <option value="low">Low Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>

        {/* Stock Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Opening</th>
                <th className="px-5 py-4 font-semibold">Purchased</th>
                <th className="px-5 py-4 font-semibold">Sold</th>
                <th className="px-5 py-4 font-semibold">Current Stock</th>
                <th className="px-5 py-4 font-semibold">Minimum</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map((product) => {
                const isOut = product.currentStock <= 0
                const isLow =
                  !isOut &&
                  product.currentStock <= product.minimumStock

                return (
                  <tr key={product.id} className="hover:bg-slate-50">

                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">
                        {product.name}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {product.sku}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {formatNumber(product.openingStock)}
                    </td>

                    <td className="px-5 py-4 text-green-700">
                      +{formatNumber(product.purchasedStock)}
                    </td>

                    <td className="px-5 py-4 text-red-600">
                      -{formatNumber(product.soldStock)}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">
                        {formatNumber(product.currentStock)}{' '}
                        {product.baseUnit}(s)
                      </p>
                      {product.baseUnit === 'bottle' && (
                        <p className="mt-1 text-xs text-slate-500">
                          {getStockDisplay(
                            product.currentStock,
                            product.unitsPerCarton,
                          )}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {product.minimumStock}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          isOut
                            ? 'bg-red-50 text-red-700'
                            : isLow
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-green-50 text-green-700'
                        }`}
                      >
                        {isOut
                          ? 'Out of Stock'
                          : isLow
                            ? 'Low Stock'
                            : 'Available'}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => openProductHistory(product)}
                          title="View stock history"
                          className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                        >
                          <Eye size={17} />
                        </button>
                      </div>
                    </td>

                  </tr>
                )
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Stock Movement History */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Recent Stock Movements
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Track incoming and outgoing inventory.
            </p>
          </div>

          <History size={22} className="text-slate-400" />
        </div>

        <div className="border-b border-slate-100 p-5">
          <select
            value={movementFilter}
            onChange={(event) => setMovementFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Movements</option>
            <option value="opening">Opening Stock</option>
            <option value="purchase">Purchases</option>
            <option value="sale">Sales</option>
            <option value="adjustment_in">Stock In</option>
            <option value="adjustment_out">Stock Out</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Product</th>
                <th className="px-5 py-4 font-semibold">Movement</th>
                <th className="px-5 py-4 font-semibold">Quantity</th>
                <th className="px-5 py-4 font-semibold">Reference</th>
                <th className="px-5 py-4 font-semibold">Notes</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredMovements.map((movement) => {
                const product = products.find(
                  (item) => item.id === movement.productId,
                )

                const incoming = [
                  'opening',
                  'purchase',
                  'adjustment_in',
                ].includes(movement.type)

                return (
                  <tr key={movement.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4 text-slate-600">
                      {movement.date}
                    </td>

                    <td className="px-5 py-4 font-medium text-slate-800">
                      {product?.name || 'Unknown product'}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${getMovementClass(
                          movement.type,
                        )}`}
                      >
                        {getMovementIcon(movement.type)}
                        {movementLabels[movement.type]}
                      </span>
                    </td>

                    <td
                      className={`px-5 py-4 font-semibold ${
                        incoming ? 'text-green-700' : 'text-red-600'
                      }`}
                    >
                      {incoming ? '+' : '-'}
                      {formatNumber(movement.quantity)}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {movement.reference}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {movement.notes || '—'}
                    </td>
                  </tr>
                )
              })}

              {filteredMovements.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No stock movements found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-6 w-full max-w-lg rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {form.type === 'adjustment_in'
                    ? 'Stock In Adjustment'
                    : 'Stock Out Adjustment'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Record a manual inventory adjustment.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5">

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Product *
                </label>
                <select
                  name="productId"
                  value={form.productId}
                  onChange={handleFormChange}
                  className={inputClass}
                  required
                >
                  <option value="">Select product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (
                      {formatNumber(getCurrentStock(product))}{' '}
                      {product.baseUnit}(s) available)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Adjustment Type *
                </label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleFormChange}
                  className={inputClass}
                >
                  <option value="adjustment_in">Stock In</option>
                  <option value="adjustment_out">Stock Out</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Quantity ({products.find(
                    (product) => product.id === Number(form.productId),
                  )?.baseUnit || 'base units'}) *
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="0.01"
                  step="0.01"
                  value={form.quantity}
                  onChange={handleFormChange}
                  placeholder="Enter quantity"
                  className={inputClass}
                  required
                />
                {form.productId && (
                  <p className="mt-1 text-xs text-slate-500">
                    Current stock:{' '}
                    {formatNumber(
                      getCurrentStock(
                        products.find(
                          (product) =>
                            product.id === Number(form.productId),
                        ),
                      ),
                    )}{' '}
                    base units
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Reference Number
                </label>
                <input
                  name="reference"
                  value={form.reference}
                  onChange={handleFormChange}
                  placeholder="e.g. ADJ-001"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleFormChange}
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows="3"
                  placeholder="Reason for stock adjustment..."
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Save Adjustment
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Product Stock History Modal */}
      {showHistory && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-6 w-full max-w-3xl rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Stock History
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {selectedProduct.name} · {selectedProduct.sku}
                </p>
              </div>

              <button
                onClick={closeHistory}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="mb-5 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-slate-600">
                  Current Available Stock
                </p>
                <h2 className="mt-1 text-2xl font-bold text-blue-700">
                  {formatNumber(
                    getCurrentStock(selectedProduct),
                  )}{' '}
                  {selectedProduct.baseUnit}(s)
                </h2>
                {selectedProduct.baseUnit === 'bottle' && (
                  <p className="mt-1 text-sm text-slate-600">
                    {getStockDisplay(
                      getCurrentStock(selectedProduct),
                      selectedProduct.unitsPerCarton,
                    )}
                  </p>
                )}
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[600px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Movement</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Reference</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {movements
                      .filter(
                        (movement) =>
                          movement.productId === selectedProduct.id,
                      )
                      .map((movement) => {
                        const incoming = [
                          'opening',
                          'purchase',
                          'adjustment_in',
                        ].includes(movement.type)

                        return (
                          <tr key={movement.id}>
                            <td className="px-4 py-3 text-slate-600">
                              {movement.date}
                            </td>

                            <td className="px-4 py-3 text-slate-700">
                              {movementLabels[movement.type]}
                            </td>

                            <td
                              className={`px-4 py-3 font-semibold ${
                                incoming
                                  ? 'text-green-700'
                                  : 'text-red-600'
                              }`}
                            >
                              {incoming ? '+' : '-'}
                              {formatNumber(movement.quantity)}
                            </td>

                            <td className="px-4 py-3 text-slate-600">
                              {movement.reference}
                            </td>
                          </tr>
                        )
                      })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
