'use client'

import React, { useEffect, useState } from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import axios from 'axios'
import PaginationControls from '../components/PaginationControls'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import { useRouter } from 'next/navigation'
import ToastMessage from '../components/ToastMessage'
import toast from 'react-hot-toast'
import { secureFetch } from '../utils/secureFetch'
const LOG_TYPES = ['All', 'Login', 'Logout', 'add', 'edit', 'delete']

export default function Logs() {
  const { user, loadingUser } = useAuthGuard()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [search, setSearch] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [selectedLogType, setSelectedLogType] = useState('All')
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  
  useEffect(() => {
    if (!user || loadingUser) return

    const userRole = JSON.parse(localStorage.getItem('userData') || '{}').role || ''
    if (userRole !== 'admin') {
      setShowToast(true)
      setTimeout(() => router.push('/home'), 2000)
      return
    }

    const fetchLogs = async () => {
      setLoading(true)
      try {
        const res = await secureFetch({ url: `${API_URL}/logs/` })
    
        if (Array.isArray(res)) {
          setLogs(res)
        } else if (res.results) {
          setLogs(res.results)
        } else {
          setLogs([])
          toast.error('Unexpected response from logs API.')
        }
    
      } catch (err) {
        console.error('Fetch logs error:', err)
        toast.error('Failed to fetch logs.')
        setError('Failed to fetch logs.')
      } finally {
        setLoading(false)
      }
    }
    
    

    fetchLogs()
  }, [user, loadingUser])

  if (showToast) {
    return <ToastMessage type="warn" message="You are not authorized to view this page." />
  }

  if (loadingUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src="/loading.svg" className="w-8 h-8 animate-spin" alt="Loading..." />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500 p-4">{error}</p>
  }

  const filteredLogs = logs.filter((log) => {
    const matchesType = selectedLogType === 'All' || log.log_type === selectedLogType
    const matchesSearch = Object.values(log).some((val) => {
      if (typeof val === 'string') return val.toLowerCase().includes(search.toLowerCase())
      if (typeof val === 'object' && val !== null) {
        return Object.values(val).some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(search.toLowerCase())
        )
      }
      return false
    })
    return matchesType && matchesSearch
  })

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize)

  return (
    <div className="flex flex-col min-h-full gap-4 px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Logs</h1>

      <div className="flex gap-4">
        <FilterResultsSeaching
          type="text"
          placeholder="Search logs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
        />

        <select
          className="border rounded-lg px-3 py-2 bg-white dark:bg-[#1c1c1c] dark:text-gray-200"
          value={selectedLogType}
          onChange={(e) => {
            setSelectedLogType(e.target.value)
            setCurrentPage(1)
          }}
        >
          {LOG_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300">
        Showing {paginatedLogs.length} / {filteredLogs.length} logs
      </p>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-[#2c2c2c]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Client</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Message</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#1c1c1c] divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                <td className="px-4 py-2 text-sm font-medium">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                      ${log.log_type === 'add' ? 'bg-green-100 text-green-800' :
                      log.log_type === 'edit' ? 'bg-yellow-100 text-yellow-800' :
                      log.log_type === 'delete' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}`}
                  >
                    {log.log_type}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm">
                  {log.client?.client_name || '—'}
                </td>
                <td className="px-4 py-2 text-sm">
                  {log.username || log.user?.username || '—'}
                  {/* {console.log('Logs:', JSON.stringify(logs, null, 2))} */}
                </td>
                <td className="px-4 py-2 text-sm">
                  {log.action || log.message || '—'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-500">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
