'use client'

import React from 'react'

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1e1e1e] rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-3 right-3 text-red-500 hover:text-red-600 dark:hover:text-red-300"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}
