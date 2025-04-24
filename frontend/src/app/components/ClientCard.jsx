
import React from 'react'
import { MapPin, Building2, Server, ArrowRight, Globe, Pencil, Trash } from 'lucide-react'
import Link from 'next/link'
import Tooltip from '../components/Tooltip';

export default function ClientCard({ client, isAdmin = false, onDelete }) {
  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 transition hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {client.client_name}
        </h2>

        <div className="flex gap-3 items-center">
          <Link
            href={`/clients/${client.id}`}
            className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline"
          >
            View
            <ArrowRight className="w-4 h-4" />
          </Link>

          {isAdmin==="admin" && (
            <>
              <Tooltip text="Edit client" position="top">
                <Link
                  href={`/clients/${client.id}/edit`}
                  className="text-yellow-600 dark:text-yellow-400 text-sm flex items-center gap-1 hover:underline"
                >
                  
                  <Pencil className="w-4 h-4" />
                </Link>
              </Tooltip>
              <Tooltip text="Delete client" position="top">
                <button
                  onClick={onDelete}
                  className="text-red-600 dark:text-red-400 text-sm flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </Tooltip>
            </>
          )
          }

        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
      <p className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          {client.client_hostname}
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          {client.client_city}, {client.client_country}
        </p>
        <p className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          {client.client_data_center}
        </p>
        <p className="flex items-center gap-2">
          <Server className="w-4 h-4" />
          Routers: {client.client_routers}
        </p>
        
      </div>
    </div>
  )
}
