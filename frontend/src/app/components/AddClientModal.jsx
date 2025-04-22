'use client'
import { useState } from 'react'
import { useUser } from '../context/UserContext'
import axios from 'axios'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AddClientModal({ onSuccess }) {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    client_name: '',
    client_description: '',
    client_country: '',
    client_city: '',
    client_hostname: '',
    client_router_prefix: '',
    client_address: '',
    client_data_center: '',
  })
  const [error, setError] = useState(null)

  if (user?.role !== 'admin') return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/clients/all-clients/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      toast.success(`✅ Client "${formData.client_name}" created!`)
      setOpen(false)
      onSuccess?.() // callback to refresh the clients list
      setFormData({
        client_name: '',
        client_description: '',
        client_country: '',
        client_city: '',
        client_hostname: '',
        client_router_prefix: '',
        client_address: '',
        client_data_center: '',
      })
    } catch (err) {
      setError('Failed to create client.')
    }
    setLoading(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        + Add Client
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-[#1c1c1c] p-6 rounded-lg w-full max-w-lg shadow-lg relative">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-red-500">
              <X className="w-5 h-5 cursor-pointer" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Create New Client</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {Object.keys(formData).map((field) => (
                <div key={field}>
                  <input
                    type="text"
                    name={field}
                    placeholder={field.replace('client_', '').replace('_', ' ')}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-[#2c2c2c] border-gray-300 dark:border-[#444] text-gray-800 dark:text-white"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex justify-center gap-2"
              >
                {loading ? (
                  <>
                    <img src="/loading.svg" className="w-4 h-4 animate-spin" alt="Loading" />
                    Saving...
                  </>
                ) : (
                  'Create Client'
                )}
              </button>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </form>
          </div>
        </div>
      )}
    </>
  )
}
