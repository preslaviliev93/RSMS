'use client'

import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'
import { ChevronDown } from 'lucide-react'

export default function ExportCSVButton({
  fetchFilteredData,    // (required) function that returns filtered data
  fetchAllData,         // (required) function that returns all data
  fileNamePrefix = 'export', // optional
  className = '',
}) {
  const [loading, setLoading] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const exportToCSV = async (fetchFn, label) => {
    setLoading(true)
    try {
      const data = await fetchFn()

      if (!data || data.length === 0) {
        toast.error('No data to export.')
        return
      }

      const headers = Object.keys(data[0])
      const csvRows = [
        headers,
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`))
      ]

      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const fileName = `${fileNamePrefix}-${label}-${new Date().toISOString().split('T')[0]}.csv`

      saveAs(blob, fileName)
      toast.success(`Exported ${label} data successfully!`)
    } catch (error) {
      console.error(error)
      toast.error(`Failed to export ${label} data.`)
    } finally {
      setLoading(false)
      setMenuOpen(false)
    }
  }

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setMenuOpen(prev => !prev)}
        className={`px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow flex items-center gap-2 ${className}`}
        disabled={loading}
      >
        {loading ? 'Exporting...' : 'Export to CSV'} <ChevronDown size={16} />
      </button>

      {menuOpen && (
        <div className="absolute z-10 mt-2 w-52 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
          <button
            onClick={() => exportToCSV(fetchFilteredData, 'filtered')}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Export Filtered Results
          </button>
          <button
            onClick={() => exportToCSV(fetchAllData, 'all')}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
          >
            Export All Results
          </button>
        </div>
      )}
    </div>
  )
}
