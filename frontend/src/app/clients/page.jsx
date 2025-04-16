'use client'
import { useState } from 'react'
import ClientCard from '../components/ClientCard'

const mockClients = [
  {
    id: 1,
    client_name: "ACME Corp",
    client_country: "Germany",
    client_city: "Berlin",
    client_address: "Alexanderplatz 1",
    client_data_center: "DC-Frankfurt",
    client_routers: 4,
  },
  {
    id: 2,
    client_name: "Globex",
    client_country: "USA",
    client_city: "New York",
    client_address: "5th Ave 123",
    client_data_center: "DC-NYC",
    client_routers: 7,
  },
  {
    id: 3,
    client_name: "Soylent",
    client_country: "UK",
    client_city: "London",
    client_address: "Green Street",
    client_data_center: "DC-London",
    client_routers: 2,
  },
  {
    id: 4,
    client_name: "Soylent",
    client_country: "UK",
    client_city: "London",
    client_address: "Green Street",
    client_data_center: "DC-London",
    client_routers: 2,
  },
  {
    id: 5,
    client_name: "Soylent",
    client_country: "UK",
    client_city: "London",
    client_address: "Green Street",
    client_data_center: "DC-London",
    client_routers: 2,
  },
  {
    id: 6,
    client_name: "Soylent",
    client_country: "UK",
    client_city: "London",
    client_address: "Green Street",
    client_data_center: "DC-London",
    client_routers: 2,
  },
  {
    id: 7,
    client_name: "Soylent",
    client_country: "UK",
    client_city: "London",
    client_address: "Green Street",
    client_data_center: "DC-London",
    client_routers: 2,
  },
  {
    id: 8,
    client_name: "Soylent",
    client_country: "UK",
    client_city: "London",
    client_address: "Green Street",
    client_data_center: "DC-London",
    client_routers: 2,
  },
  {
    id: 9,
    client_name: "Soylent",
    client_country: "UK",
    client_city: "London",
    client_address: "Green Street",
    client_data_center: "DC-London",
    client_routers: 2,
  },
  {
    id: 10,
    client_name: "Soylent",
    client_country: "UK",
    client_city: "London",
    client_address: "Green Street",
    client_data_center: "DC-London",
    client_routers: 2,
  }
]

export default function ClientsPage() {
  const [search, setSearch] = useState('')

  const filteredClients = mockClients.filter(client =>
    client.client_name.toLowerCase().includes(search.trim().toLowerCase())
  )
  

  return (
    <div className="space-y-6">
      {/* 🔍 Search Input */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by client name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🧩 Client Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredClients.length > 0 ? (
          filteredClients.map(client => (
            <ClientCard key={client.id} client={client} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full">No clients found.</p>
        )}
      </div>
    </div>
  )
}
