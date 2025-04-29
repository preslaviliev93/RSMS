'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { MapPin, Server } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuthGuard } from '@/app/hooks/useAuthGuard'
import FilterResultsSeaching from '@/app/components/FilterResultsSeaching'
import PaginationControls from '@/app/components/PaginationControls'

export default function ClientLocationsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user, loadingUser } = useAuthGuard()

  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/clients/all-clients/${id}/locations/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setLocations(res.data)
    } catch (err) {
      toast.error('Failed to fetch locations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) fetchLocations()
    if (!user && !loadingUser) router.push('/login')
  }, [user, loadingUser])

  if (loadingUser || !user) return null
  if (loading) return <p className="text-center text-gray-500 dark:text-gray-400">Loading locations...</p>

  // ✅ Local search filtering
  const filteredLocations = locations.filter(location =>
    Object.values(location)
      .filter(value => typeof value === 'string')
      .some(value => value.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.max(1, Math.ceil(filteredLocations.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedLocations = filteredLocations.slice(startIndex, startIndex + pageSize)

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <MapPin className="w-6 h-6" /> Locations for Client
      </h1>

      {/* Search Field */}
      <div className="w-full">
        <FilterResultsSeaching
          type="text"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1) // Reset to page 1 on new search
          }}
        />
      </div>

      {/* Showing results */}
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {paginatedLocations.length} out of {filteredLocations.length} total results
      </p>

      {/* Locations grid */}
      {paginatedLocations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedLocations.map((location) => (
            <div
              key={location.id}
              onClick={() => router.push(`/locations/${location.id}`)}
              className="border rounded-2xl p-4 bg-white dark:bg-[#1e1e1e] dark:border-gray-700 hover:shadow-md hover:cursor-pointer transition space-y-2"
            >
              <div className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
                <MapPin className="w-5 h-5" />
                {location.name}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Server className="w-4 h-4" /> Router: {location.router_serial}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No locations found for this client.</p>
      )}

      {/* Pagination Controls */}
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
