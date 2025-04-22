'use client'

import { useEffect, useState } from 'react'
import { useAuthGuard } from '../hooks/useAuthGuard'
import axios from 'axios'
import ClientCard from '../components/ClientCard'
import PaginationControls from '../components/PaginationControls'
import FilterResultsSeaching from '../components/FilterResultsSeaching'

export default function ClientsPage() {
  const { user, loadingUser } = useAuthGuard()
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState('')

  const filteredClients = clients.filter((client) =>
    JSON.stringify(client).toLowerCase().includes(search.toLowerCase())
  );

  const API_URL = process.env.NEXT_PUBLIC_API_URL

  useEffect(() => {
    if (!user) return;
  
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${API_URL}/clients/all-clients/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setClients(response.data.results);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch clients.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchClients();
  }, [user, API_URL]); // <-- make sure this line is correct
  

  if (loadingUser || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <img src="/loading.svg" className="w-16 h-16 animate-spin" alt="Loading..." />
      </div>
    )
  }

  if (error) {
    return <p className="text-red-500">{error}</p>
  }

  return (
    <div className="flex flex-col min-h-full gap-4">
      <FilterResultsSeaching
        type="text"
        placeholder="Search clients..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
  {/* Scrollable content area */}
  <div className="flex-grow">
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {filteredClients.map((client) =>(
        <ClientCard
          key={client.id}
          client={client}
          />
      ))}
    </div>
  </div>

  {/* Pagination at the bottom */}
  <PaginationControls
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
    pageSize={pageSize}
    setPageSize={setPageSize}
  />
</div>

  )
}
