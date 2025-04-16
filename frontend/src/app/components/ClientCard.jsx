'use client'
import React from 'react'
import { MapPin, Building2, Server, Router, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function ClientCard({ client }) {
  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col gap-4 transition hover:shadow-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {client.client_name}
        </h2>
        <Link
          href={`/clients/${client.id}`}
          className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1 hover:underline"
        >
          View
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300">
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
