'use client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  setPageSize,
}) {
  const handlePrev = () => currentPage > 1 && onPageChange(currentPage - 1)
  const handleNext = () => currentPage < totalPages && onPageChange(currentPage + 1)

  const handlePageInput = (e) => {
    const page = parseInt(e.target.value)
    if (page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  return (
    <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <button
          disabled={currentPage === 1}
          onClick={handlePrev}
          className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm text-gray-700 dark:text-gray-300">
          {currentPage} / {totalPages}
        </span>

        <button
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className="px-2 py-1 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <input
          type="number"
          min="1"
          max={totalPages}
          defaultValue={currentPage}
          onBlur={handlePageInput}
          className="w-16 px-2 py-1 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />

        <select
          value={pageSize}
          onChange={(e) => setPageSize(e.target.value)}
          className="px-2 py-1 rounded-md border dark:bg-gray-800 dark:border-gray-600 dark:text-white cursor-pointer"
        >
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="-1">All</option>
        </select>
      </div>
    </div>
  )
}
