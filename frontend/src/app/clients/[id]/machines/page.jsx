'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import toast from 'react-hot-toast'

export default function ClientMachinesPage() {
  const { id: clientId } = useParams()
  const router = useRouter()
  const { user, loadingUser } = useAuthGuard()

  const [leases, setLeases] = useState([])
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(true)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchClientName = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/clients/all-clients/${clientId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setClientName(res.data.client_name)
    } catch (err) {
      console.error('Failed to fetch client name')
    }
  }

  const fetchLeases = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/routers/client-leases/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          client_id: clientId,
        },
      })
      setLeases(res.data.results || res.data) // if paginated, use .results
    } catch (err) {
      toast.error('Failed to fetch DHCP leases')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user && !loadingUser) {
      router.push('/login')
    }
    if (user) {
      fetchClientName()
      fetchLeases()
    }
  }, [user, loadingUser])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Machines for Client: {clientName || 'Loading...'}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading machines...</p>
      ) : leases.length > 0 ? (
        <div className="overflow-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-3 text-left">Hostname</th>
                <th className="px-6 py-3 text-left">MAC Address</th>
                <th className="px-6 py-3 text-left">Internal IP</th>
                <th className="px-6 py-3 text-left">Added At</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1c1c1c] text-gray-800 dark:text-gray-100">
              {leases.map((lease, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition">
                  <td className="px-6 py-3">{lease.hostname}</td>
                  <td className="px-6 py-3 font-mono">{lease.mac_address}</td>
                  <td className="px-6 py-3">{lease.internal_ip || lease.dhcp_lease_ip_address}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">
                    {new Date(lease.added_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No machines found for this client.</p>
      )}
    </div>
  )
}
