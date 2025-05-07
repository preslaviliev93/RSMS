'use client'

import { useEffect, useState } from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import ClientCard from '../components/ClientCard'
import PaginationControls from '../components/PaginationControls'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import { showDeleteConfirmToast } from '../components/DeleteConfirmationToast'
import AddClientModal from '../components/AddClientModal'
import Modal from '../components/Modal'
import { useRouter } from 'next/navigation'
import { secureFetch } from '../utils/secureFetch'
import toast from 'react-hot-toast'
import ExportCSVButton from '../components/ExportCSVButton'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function ClientsPage() {
  const { user, loadingUser } = useAuthGuard()
  const router = useRouter()

  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const [editingClient, setEditingClient] = useState(null)
  const [editFormData, setEditFormData] = useState({})

  const fetchClients = async () => {
    setLoading(true)
    try {
      const res = await secureFetch({
        url: `${API_URL}/clients/all-clients/`,
        params: { page_size: 9999 },
      })
      setClients(res.results || res)
    } catch (err) {
      console.error('Failed to fetch clients:', err)
      setError('Failed to fetch clients.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (loadingUser) return
    if (!user) {
      router.push('/login')
      return
    }
    fetchClients()
  }, [user])

  const handleDeleteClient = (clientId) => {
    showDeleteConfirmToast({
      itemName: clients.find(c => c.id === clientId)?.client_name || 'Client',
      onConfirm: async () => {
        try {
          await secureFetch({
            url: `${API_URL}/clients/all-clients/${clientId}/`,
            method: 'DELETE',
          })
          toast.success('Client deleted!')
          setClients(prev => prev.filter(c => c.id !== clientId))
        } catch (error) {
          toast.error('Failed to delete client.')
        }
      }
    })
  }

  const openEditModal = (client) => {
    setEditingClient(client)
    setEditFormData(client)
  }

  const closeEditModal = () => {
    setEditingClient(null)
    setEditFormData({})
  }

  const handleEditSave = async () => {
    try {
      await secureFetch({
        url: `${API_URL}/clients/all-clients/${editingClient.id}/`,
        method: 'PUT',
        data: editFormData,
      })
      toast.success('Client updated!')
      fetchClients()
      closeEditModal()
    } catch (error) {
      toast.error('Failed to update client.')
      console.error(error)
    }
  }

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
    return <p className="text-red-500 text-center">{error}</p>
  }

  return (
    <div className="flex flex-col min-h-full gap-4 p-6">
      {/* Search and Add Client button */}
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

  <div className="flex items-center gap-2 shrink-0">
    <ExportCSVButton
      fileNamePrefix="clients"
      className="cursor-pointer"
      fetchFilteredData={async () => {
        // export the filtered in-memory array
        return filteredClients.map((client) => ({
          ID: client.id,
          Name: client.client_name || '',
          Description: client.client_description || '',
          Country: client.client_country || '',
          City: client.client_city || '',
          Hostname: client.client_hostname || '',
          Prefix: client.client_router_prefix || '',
          Address: client.client_address || '',
          Data_Center: client.client_data_center || '',
        }))
      }}
      fetchAllData={async () => {
        try {
          const res = await secureFetch({
            url: `${API_URL}/clients/all-clients/`,
            params: { page_size: 10000 },
          })
          const allClients = res.results || res
          return allClients.map((client) => ({
            ID: client.id,
            Name: client.client_name || '',
            Description: client.client_description || '',
            Country: client.client_country || '',
            City: client.client_city || '',
            Hostname: client.client_hostname || '',
            Prefix: client.client_router_prefix || '',
            Address: client.client_address || '',
            Data_Center: client.client_data_center || '',
          }))
        } catch (err) {
          toast.error('Failed to fetch all clients for export.')
          return []
        }
      }}
    />
    <AddClientModal onSuccess={fetchClients} />
  </div>
</div>



      {/* Clients Count */}
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Showing {paginatedClients.length} / {clients.length} clients
      </p>

      {/* Clients Cards */}
      <div className="flex-grow">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {paginatedClients.length > 0 ? (
            paginatedClients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                isAdmin={user?.role}
                onEdit={() => openEditModal(client)}
                onDelete={() => handleDeleteClient(client.id)}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 col-span-full">
              No clients match your search.
            </p>
          )}
        </div>
      </div>

      {/* Pagination */}
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

      {/* Edit Modal */}
      {editingClient && (
        <Modal isOpen={!!editingClient} onClose={closeEditModal}>
          <h2 className="text-xl font-bold mb-4">Edit Client: {editingClient.client_name}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleEditSave()
            }}
            className="space-y-4"
          >
            {[
              'client_name',
              'client_description',
              'client_country',
              'client_city',
              'client_hostname',
              'client_router_prefix',
              'client_address',
              'client_data_center',
            ].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                  {field.replace('client_', '').replace('_', ' ')}
                </label>
                <input
                  type="text"
                  name={field}
                  value={editFormData[field] || ''}
                  onChange={(e) =>
                    setEditFormData(prev => ({ ...prev, [field]: e.target.value }))
                  }
                  className="w-full px-4 py-2 border rounded-md dark:bg-[#121212] dark:border-gray-700 dark:text-white"
                />
              </div>
            ))}

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={closeEditModal}
                className="px-4 py-2 bg-gray-400 dark:bg-gray-700 text-white rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
