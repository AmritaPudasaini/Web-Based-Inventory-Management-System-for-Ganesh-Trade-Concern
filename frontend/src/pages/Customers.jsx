
import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  UserCheck,
  X,
  Store,
  Phone,
  Mail,
  MapPin,
} from 'lucide-react'

const initialCustomers = [
  {
    id: 1,
    shopName: 'New Sunrise Store',
    contactPerson: 'Ram Bahadur',
    phone: '9841000001',
    email: 'sunrise@example.com',
    address: 'Anbukhaireni, Tanahun',
    panNumber: '123456789',
    isActive: true,
  },
  {
    id: 2,
    shopName: 'Himalayan Mart',
    contactPerson: 'Sita Gurung',
    phone: '9841000002',
    email: 'himalayan@example.com',
    address: 'Dumre, Tanahun',
    panNumber: '234567891',
    isActive: true,
  },
  {
    id: 3,
    shopName: 'City Corner Shop',
    contactPerson: 'Hari Shrestha',
    phone: '9841000003',
    email: 'citycorner@example.com',
    address: 'Damauli, Tanahun',
    panNumber: '345678912',
    isActive: false,
  },
]

const emptyForm = {
  shopName: '',
  contactPerson: '',
  phone: '',
  email: '',
  address: '',
  panNumber: '',
  isActive: true,
}

export default function Customers() {
  const [customers, setCustomers] = useState(initialCustomers)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const filteredCustomers = useMemo(() => {
    const query = search.toLowerCase()

    return customers.filter((customer) =>
      [
        customer.shopName,
        customer.contactPerson,
        customer.phone,
        customer.panNumber,
        customer.address,
      ].some((value) => value.toLowerCase().includes(query)),
    )
  }, [customers, search])

  const activeCount = customers.filter(
    (customer) => customer.isActive,
  ).length

  const openAddModal = () => {
    setEditingCustomer(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEditModal = (customer) => {
    setEditingCustomer(customer)
    setForm({
      shopName: customer.shopName,
      contactPerson: customer.contactPerson,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      panNumber: customer.panNumber,
      isActive: customer.isActive,
    })
    setShowModal(true)
  }

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const customerData = {
      ...form,
      shopName: form.shopName.trim(),
      contactPerson: form.contactPerson.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      panNumber: form.panNumber.trim(),
    }

    const duplicate = customers.some(
      (customer) =>
        customer.shopName.toLowerCase() ===
          customerData.shopName.toLowerCase() &&
        customer.id !== editingCustomer?.id,
    )

    if (duplicate) {
      alert('A customer with this shop name already exists.')
      return
    }

    if (editingCustomer) {
      setCustomers((previous) =>
        previous.map((customer) =>
          customer.id === editingCustomer.id
            ? { ...customerData, id: customer.id }
            : customer,
        ),
      )
    } else {
      setCustomers((previous) => [
        ...previous,
        {
          ...customerData,
          id: Date.now(),
        },
      ])
    }

    setShowModal(false)
    setForm(emptyForm)
    setEditingCustomer(null)
  }

  const handleDelete = (customer) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${customer.shopName}?`,
    )

    if (confirmed) {
      setCustomers((previous) =>
        previous.filter((item) => item.id !== customer.id),
      )
    }
  }

  const inputClass =
    'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Customers</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {customers.length}
              </h2>
            </div>
            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Users size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Active Customers</p>
              <h2 className="mt-2 text-2xl font-bold text-slate-800">
                {activeCount}
              </h2>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <UserCheck size={23} />
            </div>
          </div>
        </div>
      </div>

      {/* Customer Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              Customer List
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage your retail shops and customers.
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Customer
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-slate-100 p-5">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by shop, contact, phone or PAN..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer / Shop</th>
                <th className="px-5 py-4 font-semibold">Contact Person</th>
                <th className="px-5 py-4 font-semibold">Contact Details</th>
                <th className="px-5 py-4 font-semibold">PAN Number</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <Store size={19} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">
                          {customer.shopName}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {customer.address}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-700">
                    {customer.contactPerson}
                  </td>

                  <td className="px-5 py-4">
                    <div className="space-y-1.5">
                      <p className="flex items-center gap-2 text-slate-700">
                        <Phone size={14} className="text-slate-400" />
                        {customer.phone}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-slate-500">
                        <Mail size={14} />
                        {customer.email || 'Not provided'}
                      </p>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-slate-600">
                    {customer.panNumber || '—'}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        customer.isActive
                          ? 'bg-green-50 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {customer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(customer)}
                        title="Edit customer"
                        className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                      >
                        <Pencil size={17} />
                      </button>

                      <button
                        onClick={() => handleDelete(customer)}
                        title="Delete customer"
                        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredCustomers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-slate-500"
                  >
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-5 py-3 text-sm text-slate-500">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-900/50 p-4">
          <div className="my-auto w-full max-w-2xl rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 p-5">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Enter the customer and shop details.
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Shop / Customer Name *
                  </label>
                  <input
                    name="shopName"
                    value={form.shopName}
                    onChange={handleChange}
                    placeholder="Enter shop name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Contact Person *
                  </label>
                  <input
                    name="contactPerson"
                    value={form.contactPerson}
                    onChange={handleChange}
                    placeholder="Enter contact person"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    PAN Number
                  </label>
                  <input
                    name="panNumber"
                    value={form.panNumber}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Address *
                  </label>
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded"
                />
                Active customer
              </label>

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
                  {editingCustomer ? 'Update Customer' : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
