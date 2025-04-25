'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import axios from 'axios'

export default function EditClientPage() {
  const { user, loadingUser } = useAuthGuard()
  const router = useRouter()
  const { id } = useParams()
  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (loadingUser) return; 
  if (!user) {
    router.replace('/login')
    return
  }

  if (user.role !== 'admin') {
    router.replace('/clients')
    return
  }

    const fetchClient = async () => {
      try {
        user
        const token = localStorage.getItem('accessToken')
        const response = await axios.get(`${API_URL}/clients/all-clients/${id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        setFormData(response.data)
      } catch (err) {
        setError('Failed to load client.')
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [user, loadingUser, id, API_URL, router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('accessToken')
      await axios.put(`${API_URL}/clients/all-clients/${id}/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      router.push('/clients')
    } catch (err) {
      setError('Failed to update client.')
    }
  }

  const handleDelete = async () => {
    
  }

  if (loadingUser || loading) {
    return <div className="p-4">Loading...</div>
  }

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>
  }
  if (!user || loadingUser) return

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-[#1c1c1c] rounded-xl shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Edit Client</h1>

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
        >
          Save Changes
        </button>
      </form>
    </div>
  )
}
