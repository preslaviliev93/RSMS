'use client'
import React, { useEffect, useState } from 'react'
import RouterCard from '../components/RouterCard'
import { useAuthGuard } from '../hooks/useAuthGuard'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import axios from 'axios'

export default function Routers() {
  const { user, loadingUser } = useAuthGuard()
  const [routers, setRouters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

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

  useEffect(() => {
    if (!user && !loadingUser) {
      router.push('/login')
    }
    if (user) {
      fetchRouters(search)
    }
  }, [user, loadingUser])

  useEffect(() => {
    fetchRouters(search)
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Routers</h1>
      </div>

      <FilterResultsSeaching
        type="text"
        placeholder="Search routers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading routers...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routers.length > 0 ? (
            routers.map((router) => (
              <RouterCard key={router.id} router={router} />
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No routers found.</p>
          )}
        </div>
      )}
    </div>
  )
}
