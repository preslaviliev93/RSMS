'use client'

import { useState } from 'react'
import { secureFetch } from '@/app/utils/secureFetch'
import { toast } from 'react-hot-toast'

export default function ClientEditForm({ clientId, initialData, onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialData || {})
  const [saving, setSaving] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await secureFetch({
        url: `${process.env.NEXT_PUBLIC_API_URL}/clients/all-clients/${clientId}/`,
        method: 'PUT',
        data: formData,
      })
      toast.success('Client updated successfully!')
      onSuccess()
      onClose()
    } catch (err) {
      toast.error('Failed to update client.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        'client_name',
        'client_description',
        'client_country',
        'client_city',
        'client_hostname',
        'client_router_prefix',
        'client_address',
        'client_data_center',
      ].map((field) => (
        <div key={field}>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
            {field.replace('client_', '').replace('_', ' ')}
          </label>
          <input
            type="text"
            name={field}
            value={formData?.[field] || ''}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md dark:bg-[#121212] dark:border-gray-700 dark:text-white"
          />
        </div>
      ))}

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        disabled={saving}
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
