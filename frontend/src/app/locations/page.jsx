'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Edit, Trash2, MapPin, Server, Users } from 'lucide-react'
import PaginationControls from '@/app/components/PaginationControls'
import { useAuthGuard } from '@/app/hooks/useAuthGuard'
import { showDeleteConfirmToast } from '@/app/components/DeleteConfirmationToast'
import { useRouter } from 'next/navigation'
import Modal from '@/app/components/Modal'
import FilterResultsSeaching from '../components/FilterResultsSeaching'

export default function LocationsPage() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [editingLocation, setEditingLocation] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { user, loadingUser } = useAuthGuard()
  const router = useRouter()

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchLocations = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/locations/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          search,
          page: currentPage,
          page_size: pageSize,
        },
      })
      setLocations(res.data.results)
      setTotalCount(res.data.count)
    } catch (err) {
      toast.error('Failed to fetch locations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [search, currentPage, pageSize])

  const handleDelete = (locationId, locationName) => {
    showDeleteConfirmToast({
      itemName: locationName,
      onConfirm: async () => {
        try {
          const token = localStorage.getItem('accessToken')
          await axios.delete(`${API_URL}/locations/${locationId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          toast.success('Location deleted!')
          fetchLocations()
        } catch (err) {
          toast.error('Failed to delete location.')
        }
      }
    })
  }

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.patch(`${API_URL}/locations/${editingLocation.id}/`, {
        location_name: editingLocation.location_name,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Location updated!')
      fetchLocations()
      setIsModalOpen(false)
    } catch (err) {
      toast.error('Failed to update location.')
    }
  }

  if (loadingUser) return null
  if (!loadingUser && !user) {
    router.push('/login')
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
        <MapPin className="w-6 h-6" /> Locations
      </h1>

      <FilterResultsSeaching
        type="text"
        placeholder="Search locations, clients, routers..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {totalCount} results (Page {currentPage} of {totalPages})
      </p>

      {locations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((location) => (
            <div key={location.id} className="border rounded-2xl p-6 shadow-md hover:shadow-lg transition bg-white dark:bg-[#1e1e1e] dark:border-gray-700 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-lg font-bold text-gray-800 dark:text-white">
                  <MapPin className="w-5 h-5" />
                  {location.name}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" /> Client:
                  <span className="font-medium text-gray-700 dark:text-gray-300">{location.client_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Server className="w-4 h-4" /> Router:
                  <span className="font-medium text-gray-700 dark:text-gray-300">{location.router_serial}</span>
                </div>
              </div>
              {user?.role === 'admin' && (
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => { setEditingLocation(location); setIsModalOpen(true) }}
                    className="cursor-pointer p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(location.id, location.location_name)}
                    className="cursor-pointer p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button
                onClick={() => router.push(`/locations/${location.id}`)}
                className="cursor-pointer w-full mt-4 py-2 text-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 font-semibold transition"
              >
                View DHCP Leases →
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">No locations found.</p>
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

      {isModalOpen && editingLocation && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <h2 className="text-lg font-bold mb-4">Edit Location</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300">Location Name</label>
              <input
                type="text"
                className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600"
                value={editingLocation?.location_name ?? ''}
                onChange={(e) => setEditingLocation({ ...editingLocation, location_name: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer px-4 py-2 text-sm rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                className="cursor-pointer px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}