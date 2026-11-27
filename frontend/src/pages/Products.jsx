
import { useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
} from 'lucide-react'

const initialProducts = [
  {
    id: 1,
    name: 'Khukuri Rum',
    sku: 'KHU-001',
    brand: 'Khukuri',
    category: 'Rum',
    baseUnit: 'bottle',
    cartonSize: 12,
    purchasePrice: 1800,
    sellingPrice: 2200,
    stock: 162,
  },
  {
    id: 2,
    name: '8848 Vodka',
    sku: 'VOD-002',
    brand: '8848',
    category: 'Vodka',
    baseUnit: 'bottle',
    cartonSize: 12,
    purchasePrice: 2100,
    sellingPrice: 2500,
    stock: 96,
  },
  {
    id: 3,
    name: 'Signature Whisky',
    sku: 'WHI-003',
    brand: 'Signature',
    category: 'Whisky',
    baseUnit: 'bottle',
    cartonSize: 12,
    purchasePrice: 1600,
    sellingPrice: 1950,
    stock: 48,
  },
  {
    id: 4,
    name: 'Tuborg Beer',
    sku: 'BEER-004',
    brand: 'Tuborg',
    category: 'Beer',
    baseUnit: 'bottle',
    cartonSize: 12,
    purchasePrice: 180,
    sellingPrice: 240,
    stock: 24,
  },
]

const emptyForm = {
  name: '',
  sku: '',
  brand: '',
  category: '',
  baseUnit: 'bottle',
  cartonSize: '12',
  purchasePrice: '',
  sellingPrice: '',
}

export default function Products() {
  const [products, setProducts] = useState(initialProducts)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const filteredProducts = products.filter((product) =>
    `${product.name} ${product.sku} ${product.brand} ${product.category}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  )

  function handleChange(e) {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  function openAddModal() {
    setFormData(emptyForm)
    setEditingId(null)
    setIsModalOpen(true)
  }

  function openEditModal(product) {
    setFormData({
      name: product.name,
      sku: product.sku,
      brand: product.brand,
      category: product.category,
      baseUnit: product.baseUnit,
      cartonSize: String(product.cartonSize),
      purchasePrice: String(product.purchasePrice),
      sellingPrice: String(product.sellingPrice),
    })

    setEditingId(product.id)
    setIsModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()

    const productData = {
      ...formData,
      cartonSize: Number(formData.cartonSize),
      purchasePrice: Number(formData.purchasePrice),
      sellingPrice: Number(formData.sellingPrice),
    }

    if (editingId !== null) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingId
            ? { ...product, ...productData }
            : product,
        ),
      )
    } else {
      const newProduct = {
        ...productData,
        id: Date.now(),
        stock: 0,
      }

      setProducts((prev) => [newProduct, ...prev])
    }

    setIsModalOpen(false)
    setFormData(emptyForm)
    setEditingId(null)
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this product?',
    )

    if (confirmed) {
      setProducts((prev) => prev.filter((product) => product.id !== id))
    }
  }

  function formatCurrency(value) {
    return `Rs. ${Number(value).toLocaleString('en-IN')}`
  }

  return (
    <div className="space-y-6">
      {/* Page heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Products
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage products, prices, categories and inventory units.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Product summary */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-blue-50 p-3">
            <Package size={24} className="text-blue-600" />
          </div>

          <div>
            <p className="text-sm text-slate-500">
              Total Products
            </p>

            <h2 className="text-2xl font-bold text-slate-800">
              {products.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2.5">
          <Search size={19} className="text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product, SKU, brand or category..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Product table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Product</th>
                <th className="px-5 py-4">SKU</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Unit</th>
                <th className="px-5 py-4">Purchase Price</th>
                <th className="px-5 py-4">Selling Price</th>
                <th className="px-5 py-4">Stock</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-slate-100 transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-800">
                      {product.name}
                    </div>

                    <div className="mt-1 text-xs text-slate-500">
                      {product.brand}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {product.sku}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                      {product.category}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {product.baseUnit}
                    <div className="mt-1 text-xs text-slate-400">
                      1 carton = {product.cartonSize} {product.baseUnit}s
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {formatCurrency(product.purchasePrice)}
                  </td>

                  <td className="px-5 py-4 font-medium text-slate-700">
                    {formatCurrency(product.sellingPrice)}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`font-semibold ${
                        product.stock <= 24
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    >
                      {product.stock}
                    </span>

                    <span className="ml-1 text-xs text-slate-500">
                      {product.baseUnit}s
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(product)}
                        title="Edit product"
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        title="Delete product"
                        className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingId !== null ? 'Edit Product' : 'Add New Product'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter product information below.
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Product Name *
                  </label>

                  <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    SKU *
                  </label>

                  <input
                    required
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    placeholder="e.g. KHU-001"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Brand
                  </label>

                  <input
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="Enter brand"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Category *
                  </label>

                  <input
                    required
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Base Unit *
                  </label>

                  <select
                    name="baseUnit"
                    value={formData.baseUnit}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="bottle">Bottle</option>
                    <option value="piece">Piece</option>
                    <option value="packet">Packet</option>
                    <option value="kg">Kilogram (kg)</option>
                    <option value="liter">Liter</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Units per Carton *
                  </label>

                  <input
                    required
                    min="1"
                    type="number"
                    name="cartonSize"
                    value={formData.cartonSize}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Purchase Price (Rs.) *
                  </label>

                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    name="purchasePrice"
                    value={formData.purchasePrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Selling Price (Rs.) *
                  </label>

                  <input
                    required
                    min="0"
                    step="0.01"
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  {editingId !== null ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
