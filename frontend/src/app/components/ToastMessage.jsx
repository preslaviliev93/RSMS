'use client'
import { XCircle, CheckCircle, AlertTriangle } from 'lucide-react'

export default function ToastMessage({ type = 'info', message }) {
  const colors = {
    success: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-300',
    error: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-300',
    warn: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-300',
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warn: <AlertTriangle className="w-5 h-5" />,
    info: <CheckCircle className="w-5 h-5" />,
  }

  return (
    <div className={`flex items-center gap-3 p-4 border rounded-md shadow-sm ${colors[type]} transition`}>
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}
