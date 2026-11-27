
import { useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Tags,
  X,
} from 'lucide-react'

const initialCategories = [
  {
    id: 1,
    name: 'Rum',
    description: 'Rum-based alcoholic beverages.',
    productCount: 12,
    status: 'Active',
  },
  {
    id: 2,
    name: 'Whisky',
    description: 'Whisky and related products.',
    productCount: 18,
    status: 'Active',
  },
  {
    id: 3,
    name: 'Vodka',
    description: 'Vodka-based products.',
    productCount: 8,
    status: 'Active',
  },
  {
    id: 4,
    name: 'Beer',
    description: 'Beer and malt beverages.',
    productCount: 15,
    status: 'Active',
  },
]

const emptyForm = {
  name: '',
  description: '',
}

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const filteredCategories = categories.filter((category) =>
    `${category.name} ${category.description}`
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

  function openEditModal(category) {
    setFormData({
      name: category.name,
      description: category.description,
    })

    setEditingId(category.id)
    setIsModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() === formData.name.trim().toLowerCase() &&
        category.id !== editingId,
    )

    if (duplicate) {
      alert('This category already exists.')
      return
    }

    if (editingId !== null) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingId
            ? { ...category, ...formData, name: formData.name.trim() }
            : category,
        ),
      )
    } else {
      setCategories((prev) => [
        ...prev,
        {
          id: Date.now(),
          name: formData.name.trim(),
          description: formData.description,
          productCount: 0,
          status: 'Active',
        },
      ])
    }

    setIsModalOpen(false)
    setFormData(emptyForm)
    setEditingId(null)
  }

  function handleDelete(id) {
    const category = categories.find((item) => item.id === id)

    if (category.productCount > 0) {
      alert('This category contains products and cannot be deleted yet.')
      return
    }

    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories((prev) => prev.filter((item) => item.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Categories
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Organize and manage your product categories.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3">
              <Tags size={24} className="text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Categories</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {categories.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3">
              <Tags size={24} className="text-emerald-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Active Categories</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {categories.filter((item) => item.status === 'Active').length}
              </h2>
            </div>
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
            placeholder="Search categories..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Category Name</th>
                <th className="px-5 py-4">Description</th>
                <th className="px-5 py-4">Products</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {category.name}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {category.description || '—'}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {category.productCount}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {category.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(category)}
                        title="Edit category"
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(category.id)}
                        title="Delete category"
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCategories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingId !== null ? 'Edit Category' : 'Add New Category'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter category details.
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
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Category Name *
                </label>

                <input
                  required
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter category name"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter category description"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                />
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
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingId !== null ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
