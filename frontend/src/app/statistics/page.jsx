'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import { format } from 'date-fns'
import StatisticsChart from '../components/StatisticsChart'
import DateRangePicker from '../components/DateRangePicker' // Import your custom picker

export default function StatisticsPage() {
  const today = new Date()

  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [data, setData] = useState({ clients: [], logs: [] })
  const [initialLoad, setInitialLoad] = useState(true)

  const fetchStats = async (start, end) => {
    try {
      const token = localStorage.getItem('accessToken')
      console.log("Fetching stats with:", {
        start: format(start, 'yyyy-MM-dd'),
        end: format(end, 'yyyy-MM-dd'),
        token
      })
      
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/statistics/`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          start: format(start, 'yyyy-MM-dd'),
          end: format(end, 'yyyy-MM-dd')
        }
      })
      setData(res.data)
    } catch (err) {
      console.error('Failed to fetch statistics:', err)
    }
  }

  useEffect(() => {
    // Fetch today's data on initial load
    fetchStats(today, today)
    setInitialLoad(false)
  }, [])

  useEffect(() => {
    if (!initialLoad && startDate && endDate) {
      fetchStats(startDate, endDate)
    }
  }, [startDate, endDate])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Client Statistics</h1>

      <DateRangePicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
      />

      <StatisticsChart
        clients={data.clients || []}
        logs={data.logs || []}
      />
    </div>
  )
}
