'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import RouterCard from '../../../components/RouterCard'
import PaginationControls from '../../../components/PaginationControls'
import toast from 'react-hot-toast'

export default function ClientRoutersPage() {
  const { id: clientId } = useParams()
  const router = useRouter()
  const { user, loadingUser } = useAuthGuard()

  const [routers, setRouters] = useState([])
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchClientInfo = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/clients/all-clients/${clientId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setClientName(response.data.client_name)
    } catch (err) {
      console.error('Failed to fetch client name.')
    }
  }

  const fetchRouters = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/routers/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          client_id: clientId,
          page_size: 9999,
        },
      })
      setRouters(response.data.results)
    } catch (err) {
      setError('Failed to fetch routers.')
      toast.error('Error fetching routers.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loadingUser && !user) {
      router.push('/login')
    }
    if (user) {
      fetchClientInfo()
      fetchRouters()
    }
  }, [user, loadingUser])

  if(loadingUser || !user) return null
  const totalPages = Math.max(1, Math.ceil(routers.length / pageSize))
  const paginated = routers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Routers for Client: {clientName || 'Loading...'}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading routers...</p>
      ) : paginated.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map(router => (
            <RouterCard key={router.id} router={router} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 dark:text-gray-400">No routers found for this client.</p>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        setPageSize={value => {
          setPageSize(parseInt(value))
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
