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
import { secureFetch } from '../utils/secureFetch'
import ExportCSVButton from '../components/ExportCSVButton'


export default function AllMachinesPage() {
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const { user, loadingUser } = useAuthGuard()
  const [leases, setLeases] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(0)
  const [exporting, setExporting] = useState(false)

  const fetchLeases = async (searchTerm = '', page = 1, pageSize = 12) => {
    if (loadingUser) return
    if (!user) {
      router.push('/login')
      return
    }
  
    setLoading(true)
    try {
      const res = await secureFetch({
        url: `${API_URL}/routers/all-leases/`,
        params: {
          search: searchTerm,
          page,
          page_size: pageSize,
        },
      })
  
      if (res.results) {
        setLeases(res.results)
        setTotalCount(res.count || 0)
      } else if (Array.isArray(res)) {
        setLeases(res)
        setTotalCount(res.length)
      } else {
        setLeases([])
        setTotalCount(0)
        toast.error('Unexpected response while fetching machines.')
      }
  
    } catch (error) {
      console.error('Failed to fetch machines:', error)
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
      fetchLeases(search, currentPage, pageSize)
    }
  }, [user, loadingUser, search, currentPage, pageSize])

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  if (loadingUser || !user) return null

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Machines:
              </h1>
              <ExportCSVButton
                fetchData={async () => {
                  try {
                    const res = await secureFetch({
                      url: `${API_URL}/routers/all-leases/`,
                      params: {
                        page_size: 10000, 
                      },
                    });
                
                    const allLeases = res.results || res; 
                
                    return allLeases.map((lease) => ({
                      ID: lease.id,
                      Hostname: lease.hostname,
                      MAC_Address: lease.mac_address,
                      IP_Address: lease.dhcp_lease_ip_address,
                      Client_Name: lease.client_name || 'N/A',
                      Router_Serial: lease.router_serial || 'N/A',
                      Location: lease.location_name || "N/A",
                      Added_At: new Date(lease.added_at).toLocaleString(),
                    }));
                  } catch (error) {
                    toast.error("Failed to fetch all machines for export.");
                    return [];
                  }
                }}
                
                headers={[
                  'ID',
                  'Hostname',
                  'MAC_Address',
                  'IP_Address',
                  'Client_Name',
                  'Router_Serial',
                  'Location',
                  'Added_At'
                ]}
                fileName={`all-machines-export-${new Date().toISOString().split('T')[0]}.csv`}
                buttonText="Export Machines to CSV"
                className="cursor-pointer hover:bg-blue-700"
              />

            </div>
      <FilterResultsSeaching
        type="text"
        placeholder="Search by hostname, MAC, IP or client..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1) // Reset page to 1 when searching
        }}
      />

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Showing {leases.length} of {totalCount} machines (Page {currentPage} of {totalPages})
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
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Added At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {leases.length > 0 ? (
                leases.map((lease, idx) => (
                  <tr key={idx} className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#2b2b2b] transition">
                    <td className="px-4 py-2">{lease.hostname}</td>
                    <td className="px-4 py-2 font-mono">
                      {lease.mac_address}
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
                        {lease.router_serial ?? 'Unknown'}
                      </Link>
                    </td>
                    <td className="px-4 py-2">
                      <Link href={`/locations/${lease.location_id}`} className="text-blue-500 hover:underline">
                        {lease.location_name}
                      </Link>
                    </td>
                    {/* <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-50">{lease.location_name || "Unknown Location"}</td> */}
                    <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-200">{new Date(lease.added_at).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-4 text-center text-gray-500 dark:text-gray-400">
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
