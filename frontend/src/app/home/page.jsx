'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'
import DateRangePicker from '../components/DateRangePicker'
import StatTabs from '../components/StatTabs'

const StatisticsChart = dynamic(() => import('../components/StatisticsChart'), { ssr: false })

export default function StatisticsPage() {
  const today = new Date()
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)
  const [data, setData] = useState({ clients: [], logs: [], routers: [], macs: [] })
  const [activeTab, setActiveTab] = useState('clients')

  const fetchStats = async (start, end) => {
    try {
      const token = localStorage.getItem('accessToken')
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/statistics/`, {
        headers: { Authorization: `Bearer ${token}` },
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
    fetchStats(startDate, endDate)
  }, [startDate, endDate])

  const handleQuickRange = (range) => {
    const ranges = {
      today: [new Date(), new Date()],
      last7: [subDays(new Date(), 6), new Date()],
      thisMonth: [startOfMonth(new Date()), endOfMonth(new Date())]
    }
    const [start, end] = ranges[range]
    setStartDate(start)
    setEndDate(end)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Home</h1>

      <div className="flex flex-wrap items-center gap-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <div className="flex gap-2">
          <button onClick={() => handleQuickRange('today')} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Today</button>
          <button onClick={() => handleQuickRange('last7')} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">Last 7 Days</button>
          <button onClick={() => handleQuickRange('thisMonth')} className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded">This Month</button>
        </div>
      </div>
      {/* {console.log("DATA SENT TO STATTABS:", JSON.stringify(data, null, 2))} //LEFT FOR DEBUG */}
      <StatTabs data={data} activeTab={activeTab} setActiveTab={setActiveTab} />

      <StatisticsChart
        clients={data.clients}
        logs={data.logs}
        routers={data.routers}
        macs={data.macs}
        total_heartbeats={data.total_heartbeats}
        activeTab={activeTab}
      />
    </div>
  )
}
