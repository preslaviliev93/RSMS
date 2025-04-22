'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import CountUp from 'react-countup'
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler, zoomPlugin)

export default function StatisticsChart({ clients = [], logs = [] }) {
  const chartRef = useRef()
  const [chartType, setChartType] = useState('line')
  const [autoRefresh, setAutoRefresh] = useState(true)

  const labels = useMemo(() => {
    const allDates = new Set([...clients, ...logs].map(item => item.date))
    return Array.from(allDates).sort()
  }, [clients, logs])

  const formatData = (source) => labels.map(label => source.find(item => item.date === label)?.count || 0)

  const exportToCSV = () => {
    const rows = [['Date', 'Clients', 'Logs']]
    labels.forEach((date, index) => {
      rows.push([date, formatData(clients)[index], formatData(logs)[index]])
    })
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n')
    const link = document.createElement('a')
    link.setAttribute('href', encodeURI(csvContent))
    link.setAttribute('download', 'statistics.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportToImage = () => {
    const chart = chartRef.current
    if (chart) {
      const url = chart.toBase64Image()
      const link = document.createElement('a')
      link.href = url
      link.download = 'chart.png'
      link.click()
    }
  }

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Clients',
        data: formatData(clients),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200)
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.4)')
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
          return gradient
        },
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Logs',
        data: formatData(logs),
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200)
          gradient.addColorStop(0, 'rgba(234, 88, 12, 0.4)')
          gradient.addColorStop(1, 'rgba(234, 88, 12, 0)')
          return gradient
        },
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4b5563',
          font: { size: 14, weight: 'bold' },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const curr = context.raw
            const prev = context.dataset.data[context.dataIndex - 1] || 0
            const diff = curr - prev
            const percent = prev ? ((diff / prev) * 100).toFixed(1) : '0'
            return `${context.dataset.label}: ${curr} (${diff >= 0 ? '+' : ''}${diff}, ${percent}%)`
          }
        }
      },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: 'x' }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#6b7280',
        },
        ticks: {
          color: '#4b5563',
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
          color: '#6b7280',
        },
        ticks: {
          color: '#4b5563',
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
    },
  }

  const totalClients = clients.reduce((sum, item) => sum + item.count, 0)
  const totalLogs = logs.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="bg-white dark:bg-[#1c1c1c] text-gray-800 dark:text-white rounded-2xl shadow-md p-4 w-full max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-sm text-gray-500">Clients</div>
            <div className="text-xl font-bold"><CountUp end={totalClients} duration={1.2} /></div>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500">Logs</div>
            <div className="text-xl font-bold"><CountUp end={totalLogs} duration={1.2} /></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={exportToCSV} className="px-3 py-1 rounded bg-blue-600 text-white text-sm">Export CSV</button>
          <button onClick={exportToImage} className="px-3 py-1 rounded bg-green-600 text-white text-sm">Export Image</button>
          <button onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')} className="px-3 py-1 rounded bg-gray-700 text-white text-sm">
            {chartType === 'line' ? 'Bar' : 'Line'} Chart
          </button>
          <button onClick={() => setAutoRefresh(!autoRefresh)} className="px-3 py-1 rounded bg-gray-500 text-white text-sm">
            {autoRefresh ? 'Pause' : 'Auto-Refresh'}
          </button>
        </div>
      </div>
      <div className="relative h-72">
        {chartType === 'line' ? (
          <Line ref={chartRef} options={chartOptions} data={chartData} />
        ) : (
          <Bar ref={chartRef} options={chartOptions} data={chartData} />
        )}
      </div>
    </div>
  )
}
