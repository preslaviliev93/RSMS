'use client'

import { toast } from 'react-hot-toast'

export function showDeleteConfirmToast({ itemName, onConfirm }) {
  toast.custom((t) => (
    <div className="bg-white dark:bg-[#1c1c1c] text-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-64 space-y-2">
      <p className="text-gray-800 dark:text-gray-100">
        Delete <strong>{itemName}</strong>?
      </p>
      <div className="flex justify-end gap-2">
        <button
          onClick={() => toast.dismiss(t.id)}
          className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition text-xs"
        >
          Cancel
        </button>
        <button
          onClick={async () => {
            toast.dismiss(t.id)
            await onConfirm()
          }}
          className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition text-xs"
        >
          Confirm
        </button>
      </div>
    </div>
  ))
}
