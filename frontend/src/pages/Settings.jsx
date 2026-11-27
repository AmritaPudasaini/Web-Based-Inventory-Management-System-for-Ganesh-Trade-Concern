
import { useState } from 'react'
import {
  Building2,
  Package,
  FileText,
  Bell,
  Save,
  RotateCcw,
  Settings as SettingsIcon,
  CheckCircle2,
} from 'lucide-react'

const initialCompany = {
  companyName: 'Ganesh Trade Concern',
  ownerName: 'Ganesh Pudasaini',
  address: 'Anbukhaireni, Tanahun, Nepal',
  phone: '',
  email: '',
  panNumber: '',
}

const initialInventory = {
  defaultUnit: 'bottle',
  unitsPerCarton: 12,
  lowStockThreshold: 24,
  allowNegativeStock: false,
}

const initialInvoice = {
  prefix: 'INV',
  startingNumber: 1,
  currency: 'NPR',
  showCompanyDetails: true,
  showPanNumber: true,
}

const initialNotifications = {
  lowStock: true,
  outOfStock: true,
  newPurchase: true,
  newSale: true,
}

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100'

const sectionClass =
  'rounded-xl border border-slate-200 bg-white p-5 shadow-sm'

function SectionHeading({ icon: Icon, title, description }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
        <Icon size={21} />
      </div>

      <div>
        <h3 className="font-semibold text-slate-800">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
    </div>
  )
}

function Field({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-sm font-medium text-slate-700"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder || label}
        className={inputClass}
      />
    </div>
  )
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const [company, setCompany] = useState(initialCompany)
  const [inventory, setInventory] = useState(initialInventory)
  const [invoice, setInvoice] = useState(initialInvoice)
  const [notifications, setNotifications] = useState(initialNotifications)

  const [saved, setSaved] = useState(false)

  const updateCompany = (event) => {
    const { name, value } = event.target
    setCompany((previous) => ({ ...previous, [name]: value }))
    setSaved(false)
  }

  const updateInventory = (event) => {
    const { name, value, type, checked } = event.target

    setInventory((previous) => ({
      ...previous,
      [name]: type === 'checkbox'
        ? checked
        : type === 'number'
          ? Number(value)
          : value,
    }))

    setSaved(false)
  }

  const updateInvoice = (event) => {
    const { name, value, type, checked } = event.target

    setInvoice((previous) => ({
      ...previous,
      [name]: type === 'checkbox'
        ? checked
        : type === 'number'
          ? Number(value)
          : value,
    }))

    setSaved(false)
  }

  const updateNotification = (name, value) => {
    setNotifications((previous) => ({
      ...previous,
      [name]: value,
    }))
    setSaved(false)
  }

  const handleSave = (event) => {
    event.preventDefault()

    if (inventory.unitsPerCarton <= 0) {
      alert('Units per carton must be greater than zero.')
      return
    }

    if (inventory.lowStockThreshold < 0) {
      alert('Low stock threshold cannot be negative.')
      return
    }

    if (invoice.startingNumber < 1) {
      alert('Starting invoice number must be at least 1.')
      return
    }

    setSaved(true)
  }

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset all settings to their original demonstration values?',
    )

    if (!confirmed) return

    setCompany(initialCompany)
    setInventory(initialInventory)
    setInvoice(initialInvoice)
    setNotifications(initialNotifications)
    setSaved(false)
  }

  return (
    <div className="space-y-6">

      {/* Page Introduction */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">
          System Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage company details, inventory preferences, invoices, and notifications.
        </p>
      </div>

      {/* Save Status */}
      {saved && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
          <CheckCircle2 size={18} />
          Settings saved in the current session.
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">

        {/* Company Information */}
        <section className={sectionClass}>
          <SectionHeading
            icon={Building2}
            title="Company Information"
            description="Basic business information used throughout the system."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Company Name"
              name="companyName"
              value={company.companyName}
              onChange={updateCompany}
            />

            <Field
              label="Owner Name"
              name="ownerName"
              value={company.ownerName}
              onChange={updateCompany}
            />

            <Field
              label="Phone Number"
              name="phone"
              value={company.phone}
              onChange={updateCompany}
              placeholder="Enter company phone number"
            />

            <Field
              label="Email Address"
              name="email"
              type="email"
              value={company.email}
              onChange={updateCompany}
              placeholder="Enter company email"
            />

            <Field
              label="PAN Number"
              name="panNumber"
              value={company.panNumber}
              onChange={updateCompany}
              placeholder="Enter PAN number"
            />

            <div>
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Business Address
              </label>

              <input
                id="address"
                name="address"
                value={company.address}
                onChange={updateCompany}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Inventory Settings */}
        <section className={sectionClass}>
          <SectionHeading
            icon={Package}
            title="Inventory Settings"
            description="Configure stock units and low-stock warning preferences."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <div>
              <label
                htmlFor="defaultUnit"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Default Base Unit
              </label>

              <select
                id="defaultUnit"
                name="defaultUnit"
                value={inventory.defaultUnit}
                onChange={updateInventory}
                className={inputClass}
              >
                <option value="bottle">Bottle</option>
                <option value="piece">Piece</option>
                <option value="packet">Packet</option>
                <option value="kg">Kilogram</option>
                <option value="liter">Liter</option>
              </select>
            </div>

            <Field
              label="Units Per Carton"
              name="unitsPerCarton"
              type="number"
              value={inventory.unitsPerCarton}
              onChange={updateInventory}
            />

            <Field
              label="Low Stock Threshold (Base Units)"
              name="lowStockThreshold"
              type="number"
              value={inventory.lowStockThreshold}
              onChange={updateInventory}
            />

          </div>

          <div className="mt-5">
            <Toggle
              label="Allow Negative Stock"
              description="Allow sales to be completed even when stock is insufficient."
              checked={inventory.allowNegativeStock}
              onChange={(value) => {
                setInventory((previous) => ({
                  ...previous,
                  allowNegativeStock: value,
                }))
                setSaved(false)
              }}
            />
          </div>

          <p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-800">
            Carton conversion is configured per product in the Products module.
            The units-per-carton value here is a default preference, not a
            replacement for each product's saved conversion factor.
          </p>
        </section>

        {/* Invoice Settings */}
        <section className={sectionClass}>
          <SectionHeading
            icon={FileText}
            title="Invoice Settings"
            description="Configure invoice numbering and displayed business information."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

            <Field
              label="Invoice Prefix"
              name="prefix"
              value={invoice.prefix}
              onChange={updateInvoice}
              placeholder="e.g. INV"
            />

            <Field
              label="Starting Invoice Number"
              name="startingNumber"
              type="number"
              value={invoice.startingNumber}
              onChange={updateInvoice}
            />

            <div>
              <label
                htmlFor="currency"
                className="mb-1.5 block text-sm font-medium text-slate-700"
              >
                Currency
              </label>

              <select
                id="currency"
                name="currency"
                value={invoice.currency}
                onChange={updateInvoice}
                className={inputClass}
              >
                <option value="NPR">Nepalese Rupee (NPR)</option>
                <option value="INR">Indian Rupee (INR)</option>
                <option value="USD">US Dollar (USD)</option>
              </select>
            </div>

          </div>

          <div className="mt-5">
            <Toggle
              label="Show Company Details on Invoices"
              description="Display the company name and address on printed invoices."
              checked={invoice.showCompanyDetails}
              onChange={(value) => {
                setInvoice((previous) => ({
                  ...previous,
                  showCompanyDetails: value,
                }))
                setSaved(false)
              }}
            />

            <Toggle
              label="Show PAN Number on Invoices"
              description="Display the company's PAN number on invoices."
              checked={invoice.showPanNumber}
              onChange={(value) => {
                setInvoice((previous) => ({
                  ...previous,
                  showPanNumber: value,
                }))
                setSaved(false)
              }}
            />
          </div>
        </section>

        {/* Notification Settings */}
        <section className={sectionClass}>
          <SectionHeading
            icon={Bell}
            title="Notification Preferences"
            description="Choose which system events should trigger notifications."
          />

          <Toggle
            label="Low Stock Alerts"
            description="Notify when a product reaches its minimum stock level."
            checked={notifications.lowStock}
            onChange={(value) => updateNotification('lowStock', value)}
          />

          <Toggle
            label="Out of Stock Alerts"
            description="Notify when a product's available quantity reaches zero."
            checked={notifications.outOfStock}
            onChange={(value) => updateNotification('outOfStock', value)}
          />

          <Toggle
            label="New Purchase Notifications"
            description="Notify when a purchase is recorded."
            checked={notifications.newPurchase}
            onChange={(value) => updateNotification('newPurchase', value)}
          />

          <Toggle
            label="New Sales Notifications"
            description="Notify when a sale is recorded."
            checked={notifications.newSale}
            onChange={(value) => updateNotification('newSale', value)}
          />
        </section>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={17} />
            Reset Settings
          </button>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Save size={17} />
            Save Settings
          </button>
        </div>

      </form>

      {/* System Information */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center gap-3">
          <SettingsIcon size={20} className="text-slate-500" />
          <h3 className="font-semibold text-slate-800">
            System Information
          </h3>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-slate-500">Application</p>
            <p className="mt-1 font-medium text-slate-800">
              Ganesh Trade Concern IMS
            </p>
          </div>

          <div>
            <p className="text-slate-500">Version</p>
            <p className="mt-1 font-medium text-slate-800">
              1.0.0
            </p>
          </div>

          <div>
            <p className="text-slate-500">Frontend</p>
            <p className="mt-1 font-medium text-slate-800">
              React + Vite
            </p>
          </div>

          <div>
            <p className="text-slate-500">Backend</p>
            <p className="mt-1 font-medium text-slate-800">
              Django REST Framework
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}
