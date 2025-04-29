'use client'

import React, { useState } from 'react'
import { saveAs } from 'file-saver'
import toast from 'react-hot-toast'

export default function ExportCSVButton({
  fetchData,      // <-- function you pass
  headers, 
  fileName = 'export.csv', 
  buttonText = 'Export to CSV', 
  className = '',
}) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      const data = await fetchData()

      if (!data || data.length === 0) {
        toast.error('No data to export.')
        return
      }

      const csvRows = [
        headers,
        ...data.map(row => headers.map(header => `"${row[header] || ''}"`))
      ]

      const csvContent = csvRows.map(row => row.join(',')).join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

      saveAs(blob, fileName)
      toast.success('Export successful!')
    } catch (error) {
      console.error(error)
      toast.error('Failed to export CSV.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`px-4 py-2 text-sm rounded-lg shadow bg-blue-500 hover:bg-blue-600 text-white ${className}`}
    >
      {loading ? 'Exporting...' : buttonText}
    </button>
  )
}
