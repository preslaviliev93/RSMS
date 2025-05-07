'use client'

import React, { useEffect, useState } from 'react'
import RouterCard from '../components/RouterCard'
import { useAuthGuard } from '../hooks/useAuthGuard'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import { useRouter } from 'next/navigation'
import PaginationControls from '../components/PaginationControls'
import { secureFetch } from '../utils/secureFetch'
import toast from 'react-hot-toast'
import ExportCSVButton from '../components/ExportCSVButton'

export default function Routers() {
  const { user, loadingUser } = useAuthGuard()
  const router = useRouter()

  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(0)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchRouters = async (searchTerm = '', page = 1, pageSize = 12) => {
    try {
      setLoading(true)
      const res = await secureFetch({
        url: `${API_URL}/routers/`,
        params: {
          search: searchTerm,
          page,
          page_size: pageSize,
        },
      })
      setRouters(res.results || res)
      setTotalCount(res.count || 0)
    } catch (error) {
      console.error('Failed to fetch routers:', error)
      setError(error?.message || 'An error occurred')
      toast.error('Failed to fetch routers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loadingUser) return
    if (!user) {
      router.replace('/login')
      return
    }

    fetchRouters(search, currentPage, pageSize)
  }, [user, loadingUser, search, currentPage, pageSize])

  if (loadingUser) return null
  if (!user) return null

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Routers</h1>
        <ExportCSVButton
          fileNamePrefix="routers"
          className="cursor-pointer"
          fetchFilteredData={async () => {
            const res = await secureFetch({
              url: `${API_URL}/routers/`,
              params: {
                search,
                page_size: 10000,
              },
            })

            const routersList = res.results || res

            return routersList.map(router => ({
              ID: router.id,
              Serial: router.router_serial || 'N/A',
              Model: router.model || 'N/A',
              Client: router.client_name || 'N/A',
              Status: router.status || 'Unknown',
              Location: router.location_name || 'Unknown Location',
              Last_Seen: router.last_seen ? new Date(router.last_seen).toLocaleString() : 'Never',
            }))
          }}
          fetchAllData={async () => {
            const res = await secureFetch({
              url: `${API_URL}/routers/`,
              params: { page_size: 10000 },
            })

            const routersList = res.results || res

            return routersList.map(router => ({
              ID: router.id,
              Serial: router.router_serial || 'N/A',
              Model: router.model || 'N/A',
              Client: router.client_name || 'N/A',
              Status: router.status || 'Unknown',
              Location: router.location_name || 'Unknown Location',
              Last_Seen: router.last_seen ? new Date(router.last_seen).toLocaleString() : 'Never',
            }))
          }}
        />
      </div>

      <FilterResultsSeaching
        type="text"
        placeholder="Search routers..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
      />

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading routers...</p>
      ) : (
        <>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Showing {routers.length} of {totalCount} (Page {currentPage} of {totalPages})
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routers.length > 0 ? (
              routers.map((router) => (
                <RouterCard key={router.id} router={router} />
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400">No routers found.</p>
            )}
          </div>
        </>
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
