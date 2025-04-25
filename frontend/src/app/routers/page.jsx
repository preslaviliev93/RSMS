'use client'
import React, { useEffect, useState } from 'react'
import RouterCard from '../components/RouterCard'
import { useAuthGuard } from '../hooks/useAuthGuard'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import PaginationControls from '../components/PaginationControls'

import axios from 'axios'
import { Activity } from 'lucide-react'

export default function Routers() {
  const { user, loadingUser } = useAuthGuard()
  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  if (loadingUser || !user) {
    return null;
  }

  useEffect(() => {
    if (loadingUser) return;
    if (!user) {
      router.replace('/login')
    }
    fetchRouters(search)
  }, [user, loadingUser, search])

  const fetchRouters = async (searchTerm = '') => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/routers/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page_size: 9999,
          search: searchTerm,
        },
      })
      setRouters(response.data.results)
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred')
      toast.error('Failed to fetch routers.')
    } finally {
      setLoading(false)
    }
  }

  const filteredRouters = routers.filter(router =>
    Object.values(router)
      .filter(value => typeof value === 'string')
      .some(value => value.toLowerCase().includes(search.toLowerCase()))
  )
  
  const totalPages = Math.max(1, Math.ceil(filteredRouters.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedRouters = filteredRouters.slice(startIndex, startIndex + pageSize)
  
 
  if (loadingUser) {
    return null
  }
  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Routers</h1>
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
          Showing {filteredRouters.length} of {routers.length} routers
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routers.length > 0 ? (
            paginatedRouters.map((router) => (
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
