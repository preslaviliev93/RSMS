'use client'
import { useParams } from 'next/navigation'

export default function ClientDetailsPage() {
  const { id } = useParams();

  // You can fetch data from API here with `useEffect` or SWR
  const client = {
    id,
    client_name: "ACME Corp",
    client_country: "Germany",
    client_city: "Berlin",
    client_address: "Alexanderplatz 1",
    client_data_center: "DC-Frankfurt",
    client_routers: 4,
  }

  return (
    <div className="p-6 rounded-xl bg-white dark:bg-[#1c1c1c] shadow border border-gray-200 dark:border-gray-700 space-y-4">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{client.client_name}</h1>

      <div className="text-gray-600 dark:text-gray-300 space-y-2">
        <p><strong>Country:</strong> {client.client_country}</p>
        <p><strong>City:</strong> {client.client_city}</p>
        <p><strong>Address:</strong> {client.client_address}</p>
        <p><strong>Data Center:</strong> {client.client_data_center}</p>
        <p><strong>Routers:</strong> {client.client_routers}</p>
      </div>
    </div>
  )
}
