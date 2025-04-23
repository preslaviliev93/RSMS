'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import axios from 'axios'
import {
  MapPin,
  Building2,
  Server,
  Info,
  Globe,
  ShieldCheck,
  Clock
} from 'lucide-react'
import { formatDateForUI } from '../../utils/formatDate'

export default function ClientDetailsPage() {
  const { id } = useParams()
  const { user, loadingUser } = useAuthGuard()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!user || !id) return

    const fetchClient = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        const response = await axios.get(`${API_URL}/clients/all-clients/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        })
        setClient(response.data)
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch client.')
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [id, user])

  if (loadingUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src="/loading.svg" className="w-16 h-16 animate-spin" alt="Loading..." />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>
  }

  if (!client) {
    return <p className="text-gray-500 text-center mt-10">Client not found.</p>
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-[#1c1c1c] rounded-xl shadow-md space-y-6 border border-gray-300 dark:border-gray-700">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{client.client_name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
        <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {client.client_city}, {client.client_country}</p>
        <p className="flex items-center gap-2"><Building2 className="w-4 h-4" /> {client.client_data_center}</p>
        <p className="flex items-center gap-2"><Globe className="w-4 h-4" /> Hostname: {client.client_hostname}</p>
        <p className="flex items-center gap-2"><Server className="w-4 h-4" /> Router Prefix: {client.client_router_prefix}</p>
        <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> Date added: {formatDateForUI(client.client_added)}</p>
        <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> ID: {client.id}</p>
      </div>

      {client.client_description && (
        <div className="pt-4 text-gray-800 dark:text-gray-200">
          <h2 className="font-semibold flex items-center gap-2 text-lg">
            <Info className="w-5 h-5" /> Description
          </h2>
          <p className="mt-2 text-sm">{client.client_description}</p>
        </div>
      )}
    </div>
  )
}
