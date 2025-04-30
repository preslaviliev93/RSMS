'use client'

import React, { useEffect, useState } from 'react';
import { secureFetch } from '../utils/secureFetch';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PaginationControls from '../components/PaginationControls';
import FilterResultsSeaching from '../components/FilterResultsSeaching';

export default function MovementsPage() {
  const { user, loadingUser } = useAuthGuard();
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [totalCount, setTotalCount] = useState(0);

  const fetchMovements = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await secureFetch({
        url: `${API_URL}/movements/`,
        params: {
          search,
          page: currentPage,
          page_size: pageSize,
        },
      });
      if (res.results) {
        setMovements(res.results);
        setTotalCount(res.count);
      } else {
        setMovements(res);
        setTotalCount(res.length);
      }
    } catch (error) {
      console.error('Failed to fetch movements', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loadingUser && user) {
      fetchMovements();
    }
  }, [user, loadingUser, search, currentPage, pageSize]);

  if (!user || loadingUser) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Machine Movement History (In development)</h1>

      <FilterResultsSeaching
        type="text"
        placeholder="Search by MAC, hostname, or location..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <p className="text-center text-gray-500 dark:text-gray-300">Loading movements...</p>
      ) : (
        <div className="overflow-auto border rounded-lg dark:border-gray-700">
          <table className="min-w-full text-sm table-auto">
            <thead className="bg-gray-100 dark:bg-[#1e1e1e] text-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left">MAC Address</th>
                <th className="px-4 py-2 text-left">Hostname</th>
                <th className="px-4 py-2 text-left">From Location</th>
                <th className="px-4 py-2 text-left">To Location</th>
                <th className="px-4 py-2 text-left">From Router</th>
                <th className="px-4 py-2 text-left">To Router</th>
                <th className="px-4 py-2 text-left">From Client</th>
                <th className="px-4 py-2 text-left">To Client</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Moved At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {movements.map((m, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                  <td className="px-4 py-2 font-mono">{m.mac_address}</td>
                  <td className="px-4 py-2">{m.hostname || 'N/A'}</td>
                  <td className="px-4 py-2">{m.from_location || 'N/A'}</td>
                  <td className="px-4 py-2">{m.to_location || 'N/A'}</td>
                  <td className="px-4 py-2">{m.from_router?.router_serial || 'N/A'}</td>
                  <td className="px-4 py-2">{m.to_router?.router_serial || 'N/A'}</td>
                  <td className="px-4 py-2">{m.from_client?.client_name || 'N/A'}</td>
                  <td className="px-4 py-2">{m.to_client?.client_name || 'N/A'}</td>
                  <td className="px-4 py-2 text-xs text-blue-600 dark:text-blue-400">{m.movement_type}</td>
                  <td className="px-4 py-2 text-xs text-gray-500">{new Date(m.moved_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <PaginationControls
        currentPage={currentPage}
        totalPages={Math.ceil(totalCount / pageSize)}
        onPageChange={setCurrentPage}
        pageSize={pageSize}
        setPageSize={(value) => {
          setPageSize(parseInt(value));
          setCurrentPage(1);
        }}
      />
    </div>
  );
}
