'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthGuard } from '../../../hooks/useAuthGuard'
import RouterCard from '../../../components/RouterCard'
import PaginationControls from '../../../components/PaginationControls'
import { secureFetch } from '@/app/utils/secureFetch'
import toast from 'react-hot-toast'
import ExportCSVButton from '@/app/components/ExportCSVButton'



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
      const res = await secureFetch({
        url: `${API_URL}/clients/all-clients/${clientId}/`,
      })
      setClientName(res.client_name)
    } catch (error) {
      console.error('Failed to fetch client name:', error)
    }
  }

  const fetchRouters = async () => {
    setLoading(true)
    try {
      const res = await secureFetch({
        url: `${API_URL}/routers/`,
        params: {
          client_id: clientId,
          page_size: 9999, // no pagination
        },
      })
      setRouters(res.results || res)
    } catch (error) {
      console.error('Failed to fetch routers:', error)
      setError('Failed to fetch routers.')
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

  if (loadingUser || !user) return null

  const totalPages = Math.max(1, Math.ceil(routers.length / pageSize))
  const paginated = routers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Routers for Client: {clientName || 'Loading...'}
        </h1>
        <ExportCSVButton
            fetchData={() => Promise.resolve(
              routers.map(router => ({
                "ID": router.id,
                "Identity": router.router_identity,
                "Serial": router.router_serial,
                "Location": router.location_name || "N/A",
              }))
            )}
            headers={['ID', 'Identity', 'Serial', "Location"]}
            fileName={`Routers-${clientId}-${new Date().toISOString().split('T')[0]}.csv`}
            buttonText="Export Routers to CSV"
            className="cursor-pointer hover:bg-blue-700"
          />
      </div>

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
        setPageSize={(value) => {
          setPageSize(parseInt(value))
          setCurrentPage(1)
        }}
      />
    </div>
  )
}
