
import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ShoppingBag,
  Package,
  FileText,
  X,
  Trash,
} from 'lucide-react'

const initialCustomers = [
  { id: 1, shopName: 'New Sunrise Store' },
  { id: 2, shopName: 'Himalayan Mart' },
  { id: 3, shopName: 'City Corner Shop' },
]

const initialProducts = [
  {
    id: 1,
    name: 'Khukuri Rum',
    sku: 'RUM-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    sellingPrice: 1500,
    availableStock: 162,
  },
  {
    id: 2,
    name: '8848 Vodka',
    sku: 'VOD-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    sellingPrice: 1800,
    availableStock: 120,
  },
  {
    id: 3,
    name: 'Signature Whisky',
    sku: 'WHI-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    sellingPrice: 2200,
    availableStock: 96,
  },
  {
    id: 4,
    name: 'Tuborg Beer',
    sku: 'BEER-001',
    baseUnit: 'bottle',
    unitsPerCarton: 12,
    sellingPrice: 350,
    availableStock: 240,
  },
]

const emptyItem = {
  productId: '',
  quantity: '',
  saleUnit: 'carton',
  unitPrice: '',
}

const emptyForm = {
  invoiceNumber: '',
  customerId: '',
  saleDate: new Date().toISOString().split('T')[0],
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
      conversionFactor: 0,
      total: 0,
    }
  }

  const conversionFactor =
    item.saleUnit === 'carton' && product.baseUnit === 'bottle'
      ? Number(product.unitsPerCarton)
      : 1

  const baseQuantity = Number(item.quantity) * conversionFactor
  const total = baseQuantity * Number(item.unitPrice || 0)

  return {
    product,
    baseQuantity,
    conversionFactor,
    total,
  }
}

export default function Sales() {
  const [sales, setSales] = useState([
    {
      id: 1,
      invoiceNumber: 'SAL-001',
      customerId: 1,
      saleDate: '2026-11-20',
      status: 'completed',
      total: 36000,
      notes: 'Regular shop order',
      items: [
        {
          productId: 1,
          quantity: 2,
          saleUnit: 'carton',
          unitPrice: 1500,
        },
      ],
    },
    {
      id: 2,
      invoiceNumber: 'SAL-002',
      customerId: 2,
      saleDate: '2026-11-22',
      status: 'draft',
      total: 18000,
      notes: '',
      items: [
        {
          productId: 2,
          quantity: 10,
          saleUnit: 'bottle',
          unitPrice: 1800,
        },
      ],
    },
  ])

  const [customers] = useState(initialCustomers)
  const [products] = useState(initialProducts)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const [editingSale, setEditingSale] = useState(null)
  const [selectedSale, setSelectedSale] = useState(null)

  const [form, setForm] = useState(emptyForm)

  const filteredSales = useMemo(() => {
    return sales.filter((sale) => {
      const customer = customers.find(
        (item) => item.id === sale.customerId,
      )

      const query = search.toLowerCase()

      const matchesSearch =
        sale.invoiceNumber.toLowerCase().includes(query) ||
        (customer?.shopName || '').toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' || sale.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [sales, customers, search, statusFilter])

  const completedSales = sales.filter(
    (sale) => sale.status === 'completed',
  )

  const totalSalesValue = completedSales.reduce(
    (sum, sale) => sum + sale.total,
    0,
  )

  const draftCount = sales.filter(
    (sale) => sale.status === 'draft',
  ).length

  const calculateTotal = (items) =>
    items.reduce(
      (sum, item) => sum + getItemDetails(item, products).total,
      0,
    )

  const openAddModal = () => {
    setEditingSale(null)

    setForm({
      ...emptyForm,
      invoiceNumber: `SAL-${String(Date.now()).slice(-6)}`,
      saleDate: new Date().toISOString().split('T')[0],
      items: [{ ...emptyItem }],
    })

    setShowModal(true)
  }

  const openEditModal = (sale) => {
    if (sale.status !== 'draft') {
      alert('Only draft sales can be edited.')
      return
    }

    setEditingSale(sale)

    setForm({
      invoiceNumber: sale.invoiceNumber,
      customerId: String(sale.customerId),
      saleDate: sale.saleDate,
      notes: sale.notes || '',
      items: sale.items.map((item) => ({
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
          ? String(product.sellingPrice)
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

    if (!form.customerId) {
      alert('Please select a customer.')
      return
    }

    if (form.items.length === 0) {
      alert('Please add at least one product.')
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
        (item.saleUnit === 'carton' && product.baseUnit !== 'bottle')
      )
    })

    if (invalidItem) {
      alert('Please check all product, quantity, unit and price fields.')
      return
    }

    const duplicateInvoice = sales.some(
      (sale) =>
        sale.invoiceNumber.toLowerCase() ===
          form.invoiceNumber.trim().toLowerCase() &&
        sale.id !== editingSale?.id,
    )

    if (duplicateInvoice) {
      alert('This invoice number already exists.')
      return
    }

    const insufficientStock = form.items.some((item) => {
      const details = getItemDetails(item, products)
      return details.baseQuantity > details.product.availableStock
    })

    if (insufficientStock) {
      alert('Requested quantity exceeds the available sample stock.')
      return
    }

    const saleData = {
      invoiceNumber: form.invoiceNumber.trim(),
      customerId: Number(form.customerId),
      saleDate: form.saleDate,
      notes: form.notes.trim(),
      status: 'draft',
      items: form.items.map((item) => ({
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        saleUnit: item.saleUnit,
        unitPrice: Number(item.unitPrice),
      })),
      total: calculateTotal(form.items),
    }

    if (editingSale) {
      setSales((previous) =>
        previous.map((sale) =>
          sale.id === editingSale.id
            ? { ...saleData, id: sale.id }
            : sale,
        ),
      )
    } else {
      setSales((previous) => [
        ...previous,
        {
          ...saleData,
          id: Date.now(),
        },
      ])
    }

    setShowModal(false)
    setEditingSale(null)
    setForm(emptyForm)
  }

  const completeSale = (sale) => {
    if (sale.status !== 'draft') return

    const confirmed = window.confirm(
      `Complete sale ${sale.invoiceNumber}? This will mark the sale as completed.`,
    )

    if (!confirmed) return

    setSales((previous) =>
      previous.map((item) =>
        item.id === sale.id
          ? { ...item, status: 'completed' }
          : item,
      ),
    )
  }

  const cancelSale = (sale) => {
    if (sale.status !== 'draft') {
      alert('Only draft sales can be cancelled.')
      return
    }

    const confirmed = window.confirm(
      `Cancel sale ${sale.invoiceNumber}?`,
    )

    if (!confirmed) return

    setSales((previous) =>
      previous.map((item) =>
        item.id === sale.id
          ? { ...item, status: 'cancelled' }
          : item,
      ),
    )
  }

  const deleteSale = (sale) => {
    if (sale.status !== 'draft') {
      alert('Only draft sales can be deleted.')
      return
    }

    const confirmed = window.confirm(
      `Delete sale ${sale.invoiceNumber}?`,
    )

    if (!confirmed) return

    setSales((previous) =>
      previous.filter((item) => item.id !== sale.id),
    )
  }

  const openDetails = (sale) => {
    setSelectedSale(sale)
    setShowDetails(true)
  }

  const getCustomerName = (customerId) =>
    customers.find((customer) => customer.id === customerId)
      ?.shopName || 'Unknown customer'

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
              <p className="text-sm text-slate-500">Total Sales</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {sales.length}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <ShoppingBag size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Completed Sales Value</p>
              <h2 className="mt-2 text-xl font-bold text-slate-800">
                {formatCurrency(totalSalesValue)}
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
              <p className="text-sm text-slate-500">Draft Sales</p>
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

      {/* Sales Records */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Sales Records
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage customer invoices and outgoing products.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            New Sale
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
              placeholder="Search invoice or customer..."
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
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Date</th>
                <th className="px-5 py-4 font-semibold">Items</th>
                <th className="px-5 py-4 font-semibold">Total Amount</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {sale.invoiceNumber}
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {getCustomerName(sale.customerId)}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {sale.saleDate}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {sale.items.length} products
                  </td>

                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {formatCurrency(sale.total)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                        sale.status,
                      )}`}
                    >
                      {sale.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => openDetails(sale)}
                        title="View sale"
                        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
                      >
                        <Eye size={17} />
                      </button>

                      {sale.status === 'draft' && (
                        <>
                          <button
                            onClick={() => openEditModal(sale)}
                            title="Edit sale"
                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => completeSale(sale)}
                            title="Complete sale"
                            className="rounded-lg p-2 text-green-600 hover:bg-green-50"
                          >
                            <ShoppingBag size={17} />
                          </button>

                          <button
                            onClick={() => cancelSale(sale)}
                            title="Cancel sale"
                            className="rounded-lg p-2 text-amber-600 hover:bg-amber-50"
                          >
                            <X size={17} />
                          </button>

                          <button
                            onClick={() => deleteSale(sale)}
                            title="Delete sale"
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

              {filteredSales.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No sales records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
          Showing {filteredSales.length} of {sales.length} sales
        </div>
      </div>

      {/* Add / Edit Sale Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-6 w-full max-w-5xl rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingSale ? 'Edit Sale' : 'Create Sales Invoice'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter customer details and add sold products.
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
                      placeholder="SAL-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Customer / Shop *
                    </label>
                    <select
                      name="customerId"
                      value={form.customerId}
                      onChange={handleFormChange}
                      className={inputClass}
                      required
                    >
                      <option value="">Select customer</option>
                      {customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.shopName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Sale Date *
                    </label>
                    <input
                      type="date"
                      name="saleDate"
                      value={form.saleDate}
                      onChange={handleFormChange}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sale Items */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-slate-800">
                    Sale Items
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
                              className="flex items-center gap-1 text-xs text-red-600"
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
                                <option key={product.id} value={product.id}>
                                  {product.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">
                              Sale Unit *
                            </label>
                            <select
                              value={item.saleUnit}
                              onChange={(event) =>
                                handleItemChange(
                                  index,
                                  'saleUnit',
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
                              Price per {item.saleUnit} *
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
                              placeholder="Enter selling price"
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
                                ? ` ${details.product.baseUnit}(s) per ${item.saleUnit}`
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
                  placeholder="Additional sales information..."
                />
              </div>

              {/* Grand Total */}
              <div className="flex justify-end">
                <div className="w-full max-w-sm rounded-xl bg-blue-50 p-5">
                  <p className="text-sm text-slate-600">
                    Sales Grand Total
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
                  {editingSale ? 'Update Sale' : 'Save as Draft'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Sale Details Modal */}
      {showDetails && selectedSale && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-6 w-full max-w-3xl rounded-xl bg-white shadow-xl">

            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Sale Details
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Invoice: {selectedSale.invoiceNumber}
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
                  <p className="text-xs text-slate-500">Customer</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {getCustomerName(selectedSale.customerId)}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Sale Date</p>
                  <p className="mt-1 font-medium text-slate-800">
                    {selectedSale.saleDate}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Status</p>
                  <span
                    className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusClass(
                      selectedSale.status,
                    )}`}
                  >
                    {selectedSale.status}
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
                    {selectedSale.items.map((item, index) => {
                      const details = getItemDetails(item, products)

                      return (
                        <tr key={index}>
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {details.product?.name || 'Unknown product'}
                          </td>

                          <td className="px-4 py-3 text-slate-600">
                            {item.quantity} {item.saleUnit}
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

              {selectedSale.notes && (
                <div>
                  <p className="text-xs text-slate-500">Notes</p>
                  <p className="mt-1 text-sm text-slate-700">
                    {selectedSale.notes}
                  </p>
                </div>
              )}

              <div className="flex justify-end border-t border-slate-100 pt-4">
                <div>
                  <p className="text-sm text-slate-500">Grand Total</p>
                  <h2 className="mt-1 text-2xl font-bold text-blue-700">
                    {formatCurrency(selectedSale.total)}
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
