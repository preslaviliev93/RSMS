'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuthGuard } from '../hooks/useAuthGuard'
import { useRouter } from 'next/navigation'
import PaginationControls from '../components/PaginationControls'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import { Clipboard } from 'lucide-react'
import Tooltip from '../components/Tooltip'
import Link from 'next/link'



export default function AllMachinesPage() {
  const { user, loadingUser } = useAuthGuard()
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const [leases, setLeases] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)

  const fetchLeases = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${API_URL}/routers/all-leases/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page_size: 9999,
        },
      })
      setLeases(res.data.results || res.data)
    } catch (err) {
      toast.error('Failed to fetch machines.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user && !loadingUser) {
      router.push('/login')
    }
    if (user) {
      fetchLeases()
    }
  }, [user, loadingUser])

  // Search filtering (now includes client_name!)
  const filteredLeases = leases.filter(lease =>
    [lease.hostname, lease.mac_address, lease.dhcp_lease_ip_address, lease.client_name]
      .filter(val => typeof val === 'string')
      .some(value => value.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.max(1, Math.ceil(filteredLeases.length / pageSize))
  const paginated = filteredLeases.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Machines</h1>

      <FilterResultsSeaching
        type="text"
        placeholder="Search by hostname, MAC, IP or client..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
      />
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {filteredLeases.length} results out of {leases.length} total machines.
      </p>

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-400">Loading machines...</p>
      ) : (
        <div className="overflow-auto border rounded-lg dark:border-gray-700">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">Hostname</th>
                <th className="px-4 py-2 text-left">MAC Address</th>
                <th className="px-4 py-2 text-left">IP Address</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Router S/N</th>
                <th className="px-4 py-2 text-left">Added At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {paginated.length > 0 ? (
                paginated.map((lease, idx) => (
                  <tr key={idx} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2b2b2b] transition">
                    <td className="px-4 py-2">{lease.hostname}</td>
                    <td className="px-4 py-2 font-mono">{lease.mac_address}
                    
                        <Tooltip text="Copy MAC Address" position="top">
                            <button
                                onClick={() => copyToClipboard(lease.mac_address)}
                                className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                <Clipboard className="w-4 h-4 cursor-pointer" />
                            </button>
                        </Tooltip>
                    </td>
                    
                    <td className="px-4 py-2">{lease.dhcp_lease_ip_address}</td>
                    <td className="px-4 py-2">{lease.client_name || 'Unknown'}</td>
                    <td className="px-4 py-2">
                      <Link href={`/routers/${lease.router_id}`} className="text-blue-500 hover:underline">
                        {lease.router_serial?? 'Unknown'}
                        
                      </Link>
                    </td>
                    {console.log(lease)}
                    
                    <td className="px-4 py-2 text-xs text-gray-500">{new Date(lease.added_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
                    No machines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
