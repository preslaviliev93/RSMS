'use client'

import React, { useEffect, useState } from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import axios from 'axios'
import PaginationControls from '../components/PaginationControls'
import FilterResultsSeaching from '../components/FilterResultsSeaching'
import { useRouter } from 'next/navigation'
import ToastMessage from '../components/ToastMessage'

export default function Logs() {
  const { user, loadingUser } = useAuthGuard()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [search, setSearch] = useState('')
  const [showToast, setShowToast] = useState(false)
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
        const token = localStorage.getItem('accessToken')
        const res = await axios.get(`${API_URL}/clients/logs/`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        setLogs(res.data.results || res.data)
      } catch (err) {
        setError('Failed to fetch logs')
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
    return Object.values(log).some((val) => {
      if (typeof val === 'string') return val.toLowerCase().includes(search.toLowerCase())
      if (typeof val === 'object' && val !== null) {
        return Object.values(val).some(
          (v) => typeof v === 'string' && v.toLowerCase().includes(search.toLowerCase())
        )
      }
      return false
    })
  })

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / pageSize))
  const startIndex = (currentPage - 1) * pageSize
  const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize)

  return (
    <div className="flex flex-col min-h-full gap-4 px-6 py-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Client Logs</h1>
      <FilterResultsSeaching
        type="text"
        placeholder="Search logs..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setCurrentPage(1)
        }}
      />
      <p className="text-sm text-gray-600 dark:text-gray-300">
        Showing {paginatedLogs.length} / {logs.length} logs
      </p>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-[#2c2c2c]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Type</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Client</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">User</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Message</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-[#1c1c1c] divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedLogs.map((log) => (
              <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                <td className="px-4 py-2 text-sm font-medium">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium
                      ${log.log_type === 'add' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      log.log_type === 'edit' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      log.log_type === 'delete' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-300'}`}
                  >
                    {log.log_type}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{log.client?.client_name || '—'}</td>
                <td className="px-4 py-2 text-sm text-gray-800 dark:text-gray-100">{log.user?.username || '—'}</td>
                <td className="px-4 py-2 text-sm text-gray-600 dark:text-gray-300">{log.action}</td>
                <td className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
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
