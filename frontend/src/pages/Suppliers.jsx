
import { useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Truck,
  X,
  Phone,
  Mail,
} from 'lucide-react'

const initialSuppliers = [
  {
    id: 1,
    companyName: 'ABC Beverage Suppliers',
    contactPerson: 'Ram Sharma',
    phone: '9800000001',
    email: 'abc@example.com',
    address: 'Kathmandu, Nepal',
    panNumber: '123456789',
    status: 'Active',
  },
  {
    id: 2,
    companyName: 'XYZ Distributors',
    contactPerson: 'Hari Thapa',
    phone: '9800000002',
    email: 'xyz@example.com',
    address: 'Pokhara, Nepal',
    panNumber: '987654321',
    status: 'Active',
  },
  {
    id: 3,
    companyName: 'National Beverage Traders',
    contactPerson: 'Sita Gurung',
    phone: '9800000003',
    email: 'national@example.com',
    address: 'Chitwan, Nepal',
    panNumber: '456789123',
    status: 'Active',
  },
]

const emptyForm = {
  companyName: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  panNumber: '',
}

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState(initialSuppliers)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const filteredSuppliers = suppliers.filter((supplier) =>
    `${supplier.companyName} ${supplier.contactPerson} ${supplier.phone} ${supplier.panNumber}`
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

  function openEditModal(supplier) {
    setFormData({
      companyName: supplier.companyName,
      contactPerson: supplier.contactPerson,
      phone: supplier.phone,
      email: supplier.email,
      address: supplier.address,
      panNumber: supplier.panNumber,
    })

    setEditingId(supplier.id)
    setIsModalOpen(true)
  }

  function handleSubmit(e) {
    e.preventDefault()

    const supplierData = {
      ...formData,
      companyName: formData.companyName.trim(),
    }

    if (editingId !== null) {
      setSuppliers((prev) =>
        prev.map((supplier) =>
          supplier.id === editingId
            ? { ...supplier, ...supplierData }
            : supplier,
        ),
      )
    } else {
      setSuppliers((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...supplierData,
          status: 'Active',
        },
      ])
    }

    setIsModalOpen(false)
    setFormData(emptyForm)
    setEditingId(null)
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      setSuppliers((prev) => prev.filter((supplier) => supplier.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Suppliers
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage supplier information and contact details.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Supplier
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-blue-50 p-3">
              <Truck size={24} className="text-blue-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Total Suppliers</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {suppliers.length}
              </h2>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-xl bg-emerald-50 p-3">
              <Truck size={24} className="text-emerald-600" />
            </div>

            <div>
              <p className="text-sm text-slate-500">Active Suppliers</p>
              <h2 className="text-2xl font-bold text-slate-800">
                {suppliers.filter((supplier) => supplier.status === 'Active').length}
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
            placeholder="Search by company, contact, phone or PAN..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </div>

      {/* Suppliers table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4">Company</th>
                <th className="px-5 py-4">Contact Person</th>
                <th className="px-5 py-4">Phone</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">PAN Number</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredSuppliers.map((supplier) => (
                <tr
                  key={supplier.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">
                      {supplier.companyName}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {supplier.address}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {supplier.contactPerson || '—'}
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-slate-400" />
                      {supplier.phone || '—'}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-slate-400" />
                      {supplier.email || '—'}
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {supplier.panNumber || '—'}
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                      {supplier.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(supplier)}
                        title="Edit supplier"
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(supplier.id)}
                        title="Delete supplier"
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredSuppliers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No suppliers found.
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
                  {editingId !== null ? 'Edit Supplier' : 'Add New Supplier'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter supplier details below.
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
                    Company Name *
                  </label>

                  <input
                    required
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Contact Person
                  </label>

                  <input
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleChange}
                    placeholder="Enter contact person"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone Number
                  </label>

                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    PAN Number
                  </label>

                  <input
                    name="panNumber"
                    value={formData.panNumber}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address
                  </label>

                  <input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter address"
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
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingId !== null ? 'Update Supplier' : 'Save Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
