
import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ShoppingCart,
  X,
  Package,
  CalendarDays,
  FileText,
  Trash,
} from 'lucide-react'

const initialSuppliers = [
  { id: 1, companyName: 'ABC Beverage Suppliers' },
  { id: 2, companyName: 'XYZ Distributors' },
  { id: 3, companyName: 'National Beverage Traders' },
]

const initialProducts = [
  {
    id: 1,
    name: 'Khukuri Rum',
    sku: 'RUM-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    purchasePrice: 1200,
  },
  {
    id: 2,
    name: '8848 Vodka',
    sku: 'VOD-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    purchasePrice: 1500,
  },
  {
    id: 3,
    name: 'Signature Whisky',
    sku: 'WHI-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    purchasePrice: 1800,
  },
  {
    id: 4,
    name: 'Tuborg Beer',
    sku: 'BEER-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    purchasePrice: 250,
  },
]

const emptyItem = {
  productId: '',
  quantity: '',
  purchaseUnit: 'carton',
  unitPrice: '',
}

const emptyForm = {
  invoiceNumber: '',
  supplierId: '',
  purchaseDate: new Date().toISOString().split('T')[0],
  notes: '',
  items: [{ ...emptyItem }],
}

const formatCurrency = (amount) =>
  `Rs. ${Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

const getItemDetails = (item, products) => {
  const product = products.find(
    (product) => product.id === Number(item.productId),
  )

  if (!product || !item.quantity || Number(item.quantity) <= 0) {
    return {
      product: product || null,
      baseQuantity: 0,
      total: 0,
      conversionFactor: 0,
    }
  }

  const conversionFactor =
    item.purchaseUnit === 'carton' &&
    product.baseUnit === 'bottle'
      ? Number(product.unitsPerCarton)
      : 1

  const baseQuantity =
    Number(item.quantity) * conversionFactor

  const total = baseQuantity * Number(item.unitPrice || 0)

  return {
    product,
    baseQuantity,
    total,
    conversionFactor,
  }
}

export default function Purchases() {
  const [purchases, setPurchases] = useState([
    {
      id: 1,
      invoiceNumber: 'PUR-001',
      supplierId: 1,
      purchaseDate: '2026-11-20',
      status: 'completed',
      total: 144000,
      items: [
        {
          productId: 1,
          quantity: 10,
          purchaseUnit: 'carton',
          unitPrice: 1200,
        },
      ],
      notes: 'Initial stock purchase',
    },
    {
      id: 2,
      invoiceNumber: 'PUR-002',
      supplierId: 2,
      purchaseDate: '2026-11-22',
      status: 'draft',
      total: 18000,
      items: [
        {
          productId: 2,
          quantity: 12,
          purchaseUnit: 'bottle',
          unitPrice: 1500,
        },
      ],
      notes: '',
    },
  ])

  const [suppliers] = useState(initialSuppliers)
  const [products] = useState(initialProducts)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const [editingPurchase, setEditingPurchase] = useState(null)
  const [selectedPurchase, setSelectedPurchase] = useState(null)

  const [form, setForm] = useState(emptyForm)

  const filteredPurchases = useMemo(() => {
    return purchases.filter((purchase) => {
      const supplier = suppliers.find(
        (item) => item.id === purchase.supplierId,
      )

      const matchesSearch =
        purchase.invoiceNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (supplier?.companyName || '')
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'all' ||
        purchase.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [purchases, suppliers, search, statusFilter])

  const completedPurchases = purchases.filter(
    (purchase) => purchase.status === 'completed',
  )

  const totalPurchaseValue = completedPurchases.reduce(
    (sum, purchase) => sum + purchase.total,
    0,
  )

  const draftCount = purchases.filter(
    (purchase) => purchase.status === 'draft',
  ).length

  const calculateTotal = (items) =>
    items.reduce(
      (sum, item) =>
        sum + getItemDetails(item, products).total,
      0,
    )

  const openAddModal = () => {
    setEditingPurchase(null)

    setForm({
      ...emptyForm,
      invoiceNumber: `PUR-${String(
        Date.now(),
      ).slice(-6)}`,
      purchaseDate: new Date().toISOString().split('T')[0],
      items: [{ ...emptyItem }],
    })

    setShowModal(true)
  }

  const openEditModal = (purchase) => {
    if (purchase.status !== 'draft') {
      alert('Only draft purchases can be edited.')
      return
    }

    setEditingPurchase(purchase)

    setForm({
      invoiceNumber: purchase.invoiceNumber,
      supplierId: String(purchase.supplierId),
      purchaseDate: purchase.purchaseDate,
      notes: purchase.notes || '',
      items: purchase.items.map((item) => ({
        ...item,
        productId: String(item.productId),
        quantity: String(item.quantity),
        unitPrice: String(item.unitPrice),
      })),
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

  const handleItemChange = (index, field, value) => {
    setForm((previous) => {
      const updatedItems = [...previous.items]

      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      }

      if (field === 'productId') {
        const product = products.find(
          (item) => item.id === Number(value),
        )

        updatedItems[index].unitPrice = product
          ? String(product.purchasePrice)
          : ''
      }

      return {
        ...previous,
        items: updatedItems,
      }
    })
  }

  const addItem = () => {
    setForm((previous) => ({
      ...previous,
      items: [...previous.items, { ...emptyItem }],
    }))
  }

  const removeItem = (index) => {
    setForm((previous) => ({
      ...previous,
      items: previous.items.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!form.supplierId) {
      alert('Please select a supplier.')
      return
    }

    if (form.items.length === 0) {
      alert('Please add at least one purchase item.')
      return
    }

    const invalidItem = form.items.some((item) => {
      const product = products.find(
        (product) => product.id === Number(item.productId),
      )

      return (
        !product ||
        !item.quantity ||
        Number(item.quantity) <= 0 ||
        item.unitPrice === '' ||
        Number(item.unitPrice) < 0 ||
        (item.purchaseUnit === 'carton' &&
          product.baseUnit !== 'bottle')
      )
    })

    if (invalidItem) {
      alert('Please check all product, quantity, unit and price fields.')
      return
    }

    const duplicateInvoice = purchases.some(
      (purchase) =>
        purchase.invoiceNumber.toLowerCase() ===
          form.invoiceNumber.trim().toLowerCase() &&
        purchase.id !== editingPurchase?.id,
    )

    if (duplicateInvoice) {
      alert('This invoice number already exists.')
      return
    }

    const purchaseData = {
      invoiceNumber: form.invoiceNumber.trim(),
      supplierId: Number(form.supplierId),
      purchaseDate: form.purchaseDate,
      notes: form.notes.trim(),
      status: 'draft',
      items: form.items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        purchaseUnit: item.purchaseUnit,
        unitPrice: Number(item.unitPrice),
      })),
      total: calculateTotal(form.items),
    }

    if (editingPurchase) {
      setPurchases((previous) =>
        previous.map((purchase) =>
          purchase.id === editingPurchase.id
            ? { ...purchaseData, id: purchase.id }
            : purchase,
        ),
      )
    } else {
      setPurchases((previous) => [
        ...previous,
        {
          ...purchaseData,
          id: Date.now(),
        },
      ])
    }

    setShowModal(false)
    setEditingPurchase(null)
    setForm(emptyForm)
  }

  const completePurchase = (purchase) => {
    if (purchase.status !== 'draft') return

    const confirmed = window.confirm(
      `Complete purchase ${purchase.invoiceNumber}? This will mark the purchase as completed.`,
    )

    if (!confirmed) return

    setPurchases((previous) =>
      previous.map((item) =>
        item.id === purchase.id
          ? { ...item, status: 'completed' }
          : item,
      ),
    )
  }

  const cancelPurchase = (purchase) => {
    if (purchase.status !== 'draft') {
      alert('Only draft purchases can be cancelled.')
      return
    }

    const confirmed = window.confirm(
      `Cancel purchase ${purchase.invoiceNumber}?`,
    )

    if (!confirmed) return

    setPurchases((previous) =>
      previous.map((item) =>
        item.id === purchase.id
          ? { ...item, status: 'cancelled' }
          : item,
      ),
    )
  }

  const deletePurchase = (purchase) => {
    if (purchase.status !== 'draft') {
      alert('Only draft purchases can be deleted.')
      return
    }

    const confirmed = window.confirm(
      `Delete purchase ${purchase.invoiceNumber}?`,
    )

    if (!confirmed) return

    setPurchases((previous) =>
      previous.filter((item) => item.id !== purchase.id),
    )
  }

  const openDetails = (purchase) => {
    setSelectedPurchase(purchase)
    setShowDetails(true)
  }

  const getSupplierName = (supplierId) =>
    suppliers.find((supplier) => supplier.id === supplierId)
      ?.companyName || 'Unknown supplier'

  const getStatusClass = (status) => {
    const classes = {
      completed: 'bg-green-50 text-green-700',
      draft: 'bg-amber-50 text-amber-700',
      cancelled: 'bg-red-50 text-red-700',
    }

    return classes[status] || 'bg-slate-100 text-slate-600'
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="space-y-6">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Total Purchases
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {purchases.length}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <ShoppingCart size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Completed Purchase Value
              </p>
              <h2 className="mt-2 text-xl font-bold text-slate-800">
                {formatCurrency(totalPurchaseValue)}
              </h2>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <Package size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Draft Purchases
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {draftCount}
              </h2>
            </div>
            <div className="rounded-lg bg-amber-50 p-3 text-amber-600">
              <FileText size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Purchase List */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Purchase Records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage supplier invoices and incoming stock.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            New Purchase
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row">
          <div className="relative max-w-md flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search invoice or supplier..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Invoice</th>
                <th className="px-5 py-4 font-semibold">Supplier</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Items</th>
                <th className="px-5 py-4 font-semibold">Total Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {purchase.invoiceNumber}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {getSupplierName(purchase.supplierId)}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {purchase.purchaseDate}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {purchase.items.length} products
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {formatCurrency(purchase.total)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                        purchase.status,
                      )}`}
                    >
                      {purchase.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openDetails(purchase)}
                        title="View purchase"
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Eye size={17} />
                      </button>

                      {purchase.status === 'draft' && (
                        <>
                          <button
                            onClick={() => openEditModal(purchase)}
                            title="Edit purchase"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => completePurchase(purchase)}
                            title="Complete purchase"
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                          >
                            <ShoppingCart size={17} />
                          </button>

                          <button
                            onClick={() => cancelPurchase(purchase)}
                            title="Cancel purchase"
                            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                          >
                            <X size={17} />
                          </button>

                          <button
                            onClick={() => deletePurchase(purchase)}
                            title="Delete purchase"
                            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPurchases.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No purchase records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
          Showing {filteredPurchases.length} of {purchases.length} purchases
        </div>
      </div>

      {/* New / Edit Purchase Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-6 w-full max-w-5xl rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingPurchase ? 'Edit Purchase' : 'Create Purchase'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter invoice details and add purchased products.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 p-5">

              {/* Invoice Information */}
              <div>
                <h3 className="mb-4 font-semibold text-slate-800">
                  Invoice Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Invoice Number *
                    </label>
                    <input
                      name="invoiceNumber"
                      value={form.invoiceNumber}
                      onChange={handleFormChange}
                      className={inputClass}
                      placeholder="PUR-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Supplier *
                    </label>
                    <select
                      name="supplierId"
                      value={form.supplierId}
                      onChange={handleFormChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((supplier) => (
                        <option
                          key={supplier.id}
                          value={supplier.id}
                        >
                          {supplier.companyName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Purchase Date *
                    </label>
                    <input
                      type="date"
                      name="purchaseDate"
                      value={form.purchaseDate}
                      onChange={handleFormChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Product Items */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    Purchase Items
                  </h3>

                  <button
                    type="button"
                    onClick={addItem}
                    className="flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
                  >
                    <Plus size={16} />
                    Add Product
                  </button>
                </div>

                <div className="space-y-4">
                  {form.items.map((item, index) => {
                    const details = getItemDetails(item, products)

                    return (
                      <div
                        key={index}
                        className="rounded-xl border border-slate-200 p-4"
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <p className="text-sm font-semibold text-slate-700">
                            Product {index + 1}
                          </p>

                          {form.items.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeItem(index)}
                              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                            >
                              <Trash size={14} />
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">

                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                              Product *
                            </label>

                            <select
                              value={item.productId}
                              onChange={(event) =>
                                handleItemChange(
                                  index,
                                  'productId',
                                  event.target.value,
                                )
                              }
                              className={inputClass}
                              required
                            >
                              <option value="">Select product</option>
                              {products.map((product) => (
                                <option
                                  key={product.id}
                                  value={product.id}
                                >
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                              Purchase Unit *
                            </label>

                            <select
                              value={item.purchaseUnit}
                              onChange={(event) =>
                                handleItemChange(
                                  index,
                                  'purchaseUnit',
                                  event.target.value,
                                )
                              }
                              className={inputClass}
                              required
                            >
                              <option value="carton">Carton</option>
                              <option value="bottle">Bottle</option>
                            </select>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                              Quantity *
                            </label>

                            <input
                              type="number"
                              min="0.01"
                              step="0.01"
                              value={item.quantity}
                              onChange={(event) =>
                                handleItemChange(
                                  index,
                                  'quantity',
                                  event.target.value,
                                )
                              }
                              className={inputClass}
                              placeholder="Enter quantity"
                              required
                            />
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                              Price per {item.purchaseUnit} *
                            </label>

                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(event) =>
                                handleItemChange(
                                  index,
                                  'unitPrice',
                                  event.target.value,
                                )
                              }
                              className={inputClass}
                              placeholder="Enter price"
                              required
                            />
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 rounded-lg bg-slate-50 p-3 sm:grid-cols-3">
                          <div>
                            <p className="text-xs text-slate-500">
                              Conversion Factor
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                              {details.conversionFactor || '—'}
                              {details.product
                                ? ` ${details.product.baseUnit}(s) per ${item.purchaseUnit}`
                                : ''}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Total Base Quantity
                            </p>
                            <p className="mt-1 font-semibold text-slate-800">
                              {details.baseQuantity}
                              {details.product
                                ? ` ${details.product.baseUnit}(s)`
                                : ''}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-slate-500">
                              Item Subtotal
                            </p>
                            <p className="mt-1 font-bold text-blue-600">
                              {formatCurrency(details.total)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleFormChange}
                  rows="3"
                  className={inputClass}
                  placeholder="Additional purchase information..."
                />
              </div>

              {/* Grand Total */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm rounded-xl bg-blue-50 p-5">
                  <p className="text-sm text-slate-600">
                    Purchase Grand Total
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-blue-700">
                    {formatCurrency(calculateTotal(form.items))}
                  </h2>
                </div>
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
                  {editingPurchase ? 'Update Purchase' : 'Save as Draft'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Purchase Details Modal */}
      {showDetails && selectedPurchase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-6 w-full max-w-3xl rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Purchase Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Invoice: {selectedPurchase.invoiceNumber}
                </p>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Supplier</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {getSupplierName(selectedPurchase.supplierId)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Purchase Date</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {selectedPurchase.purchaseDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                      selectedPurchase.status,
                    )}`}
                  >
                    {selectedPurchase.status}
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full min-w-[550px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">Quantity</th>
                      <th className="px-4 py-3">Base Quantity</th>
                      <th className="px-4 py-3">Subtotal</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {selectedPurchase.items.map((item, index) => {
                      const details = getItemDetails(item, products)

                      return (
                        <tr key={index}>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {details.product?.name || 'Unknown product'}
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {item.quantity} {item.purchaseUnit}
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {details.baseQuantity}{' '}
                            {details.product?.baseUnit}
                          </td>

                          <td className="px-4 py-3 font-medium text-slate-800">
                            {formatCurrency(details.total)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {selectedPurchase.notes && (
                <div>
                  <p className="text-xs text-slate-500">Notes</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selectedPurchase.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm text-slate-500">
                    Grand Total
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-blue-700">
                    {formatCurrency(selectedPurchase.total)}
                  </h2>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
