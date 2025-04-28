'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import toast from 'react-hot-toast'
import PaginationControls from '@/app/components/PaginationControls'
import { saveAs } from 'file-saver'

export default function ClientMachinesPage() {
  const { id: clientId } = useParams()
  const router = useRouter()
  const { user, loadingUser } = useAuthGuard()

  const [leases, setLeases] = useState([])
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [exporting, setExporting] = useState(false)
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchClientName = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/clients/all-clients/${clientId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setClientName(res.data.client_name)
    } catch (err) {
      console.error('Failed to fetch client name')
    }
  }

  const fetchLeases = async (page = 1, pageSize = 12) => {
    if (!clientId) return
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/routers/client-leases/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          client_id: clientId,
          page,
          page_size: pageSize,
        },
      })
      setLeases(res.data.results || res.data)
      setTotalCount(res.data.count)
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
      fetchLeases(currentPage, pageSize)
    }
  }, [user, loadingUser, currentPage, pageSize])

  if (loadingUser || !user) return null

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  const exportToCSV = async () => {
    setExporting(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/routers/client-leases/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          client_id: clientId,
          page_size: 10000,
        },
      })
  
      const allLeases = res.data.results || res.data
  
      const csvRows = [
        ['Hostname', 'MAC Address', 'IP Address', 'Router Serial', 'Added At'],
        ...allLeases.map(lease => [
          lease.hostname,
          lease.mac_address,
          lease.internal_ip || lease.dhcp_lease_ip_address,
          lease.router_serial,
          new Date(lease.added_at).toLocaleString()
        ])
      ]
  
      const csvContent = csvRows.map(row => row.map(String).map(value => `"${value}"`).join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      
      const today = new Date().toISOString().split('T')[0]
      const fileName = `machines-${clientName || clientId}-${today}.csv`
      
      saveAs(blob, fileName)
      toast.success('Export successful!')
    } catch (error) {
      toast.error('Failed to export all machines.')
    } finally {
      setExporting(false)
    }
  }
  
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Machines for Client: {clientName || 'Loading...'}
        </h1>
        <button
          onClick={exportToCSV}
          className="px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow cursor-pointer"
        >
          {exporting ? 'Exporting...' : 'Export to CSV'}
        </button>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {leases.length} of {totalCount} machines (Page {currentPage} of {totalPages})
      </p>

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
                <th className="px-6 py-3 text-left">Router S/N</th>
                <th className="px-6 py-3 text-left">Added At</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1c1c1c] text-gray-800 dark:text-gray-100">
              {leases.map((lease, index) => (
                <tr key={index} className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition">
                  <td className="px-6 py-3">{lease.hostname}</td>
                  <td className="px-6 py-3 font-mono">{lease.mac_address}</td>
                  <td className="px-6 py-3">{lease.internal_ip || lease.dhcp_lease_ip_address}</td>
                  <td className="px-6 py-3">{lease.router_serial}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{new Date(lease.added_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No machines found for this client.</p>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        setPageSize={(value) => {
          setPageSize(parseInt(value))
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
