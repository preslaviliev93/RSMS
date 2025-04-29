// /locations/[id]/page.jsx
'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useAuthGuard } from '@/app/hooks/useAuthGuard'
import { Server, Network, Cpu } from 'lucide-react'
import PaginationControls from '@/app/components/PaginationControls'
import FilterResultsSeaching from '@/app/components/FilterResultsSeaching'

export default function LocationDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loadingUser } = useAuthGuard()

  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(6)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchLocationDetails = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/locations/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLocation(res.data)
    } catch (err) {
      toast.error('Failed to fetch location details')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchLocationDetails()
    if (!user && !loadingUser) router.push('/login')
  }, [user, loadingUser])

  if (loadingUser || !user) return null
  if (loading || !location) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 py-10">
        Loading location details...
      </p>
    )
  }

  const filteredLeases = location.leases.filter((lease) =>
    lease.hostname?.toLowerCase().includes(search.toLowerCase()) ||
    lease.mac_address?.toLowerCase().includes(search.toLowerCase()) ||
    lease.ip_address?.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filteredLeases.length / pageSize))
  const paginatedLeases = filteredLeases.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <Server className="w-6 h-6" /> {location.location_name}
      </h1>

      <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
        <p>
          Router Serial:{' '}
          <span
            onClick={() => router.push(`/routers/${location.router_id}`)}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            {location.router_serial}
          </span>
        </p>
        <p>
          Client:{' '}
          <span
            onClick={() => router.push(`/clients/${location.client_id}`)}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            {location.client_name}
          </span>
        </p>
      </div>

      <FilterResultsSeaching
        type="text"
        placeholder="Search by hostname, MAC, or IP..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredLeases.length} results (Page {currentPage} of {totalPages})
      </p>

      {paginatedLeases.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedLeases.map((lease, index) => (
            <div
              key={`${lease.mac_address}-${index}`}
              className="border rounded-xl p-4 bg-white dark:bg-[#1e1e1e] dark:border-gray-700 hover:shadow-md transition"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Cpu className="w-5 h-5" /> Hostname:{' '}
                  <span className="font-semibold">{lease.hostname || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Network className="w-4 h-4" /> MAC: {lease.mac_address}
                </div>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Server className="w-4 h-4" /> IP: {lease.ip_address}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No matching leases found.</p>
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
