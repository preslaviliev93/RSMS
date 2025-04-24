'use client'

import { useEffect, useState } from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import axios from 'axios'
import ClientCard from '../components/ClientCard'
import PaginationControls from '../components/PaginationControls'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import toast from 'react-hot-toast'
import { showDeleteConfirmToast } from '../components/DeleteConfirmationToast'
import AddClientModal from '../components/AddClientModal'
import { useRouter } from 'next/navigation'

export default function ClientsPage() {
  const { user, loadingUser } = useAuthGuard()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  

  const handleDelete = (client) => {
    showDeleteConfirmToast({
      itemName: client.client_name,
      onConfirm: async () => {
        const token = localStorage.getItem('accessToken')
        await toast.promise(
          axios.delete(`${API_URL}/clients/all-clients/${client.id}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          {
            loading: 'Deleting...',
            success: () => {
              setClients(prev => prev.filter(c => c.id !== client.id))
              return 'Client deleted!'
            },
            error: 'Failed to delete client.',
          }
        )
      }
    })
  }
  

  const fetchClients = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const response = await axios.get(`${API_URL}/clients/all-clients/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page_size: 9999,
        },
      })
  
      setClients(response.data.results)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch clients.')
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    if (!user){
      router.push('/login')
    };
    const userRole = JSON.parse(localStorage.getItem('userData') || '{}').role || ''
    setRole(userRole)
    console.log(`User role: ${userRole}`)
    fetchClients()
  }, [user, API_URL])

 
  const filteredClients = clients.filter(client =>
    Object.values(client)
      .filter(value => typeof value === 'string')
      .some(value => value.toLowerCase().includes(search.toLowerCase()))
  )
  
  

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedClients = filteredClients.slice(startIndex, startIndex + pageSize)

  if (loadingUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src="/loading.svg" className="w-16 h-16 animate-spin" alt="Loading..." />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="flex flex-col min-h-full gap-4">
      <div className="flex items-center justify-between gap-4 w-full">
  <div className="w-full">
    <FilterResultsSeaching
      type="text"
      placeholder="Search clients..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value)
        setCurrentPage(1)
      }}
    />
  </div>

  <div className="shrink-0">
    <AddClientModal onSuccess={fetchClients} />
  </div>
</div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Showing {paginatedClients.length} / {clients.length} 
      </p>
      
      
      


      <div className="flex-grow">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedClients.length > 0 ? (
            paginatedClients.map((client) => (
              <ClientCard key={client.id} client={client} isAdmin={role} onDelete={() => handleDelete(client)}/>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">
              No clients match your search.
            </p>
          )}
        </div>
      </div>
     

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
