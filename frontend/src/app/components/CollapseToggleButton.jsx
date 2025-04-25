'use client'
import { ListCollapse } from 'lucide-react'

export default function CollapseToggleButton({ collapsed, setCollapsed }) {
  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className={`
        mb-4 flex items-center gap-2 px-3 py-2 rounded-md
        text-sm font-medium transition-all duration-200
        text-gray-700 dark:text-gray-300 
        hover:text-black dark:hover:text-white 
        hover:bg-gray-200 dark:hover:bg-[#2c2c2c]
        mt-5
      `}
      aria-label="Toggle sidebar"
    >
      <ListCollapse
        className={`w-5 h-5 transform transition-transform duration-300 
          ${collapsed ? 'rotate-180' : 'rotate-0'}`}
      />
      {/* Show text only when expanded and on medium+ screens */}
      <span className="hidden md:inline">
        {collapsed ? '' : 'Collapse'}
      </span>
    </button>
  )
}
