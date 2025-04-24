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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler, zoomPlugin)

export default function StatisticsChart({ clients = [], logs = [], routers = [], machines = [] }) {
  const chartRef = useRef()
  const [chartType, setChartType] = useState('line')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [activeTab, setActiveTab] = useState('clients')

  const labels = useMemo(() => {
    const allDates = new Set([...clients, ...logs, ...routers, ...machines].map(item => item.date))
    return Array.from(allDates).sort()
  }, [clients, logs, routers, machines])

  const formatData = (source) => labels.map(label => source.find(item => item.date === label)?.count || 0)

  const datasetsMap = {
    clients: {
      label: 'Clients',
      color: 'rgb(59, 130, 246)',
      data: formatData(clients),
    },
    logs: {
      label: 'Logs',
      color: 'rgb(234, 88, 12)',
      data: formatData(logs),
    },
    routers: {
      label: 'Routers',
      color: 'rgb(20, 184, 166)',
      data: formatData(routers),
    },
    machines: {
      label: 'Machines',
      color: 'rgb(139, 92, 246)',
      data: formatData(machines),
    }
  }

  const activeDataset = datasetsMap[activeTab]

  const chartData = {
    labels,
    datasets: [
      {
        label: activeDataset.label,
        data: activeDataset.data,
        borderColor: activeDataset.color,
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 200)
          gradient.addColorStop(0, activeDataset.color.replace('rgb', 'rgba').replace(')', ', 0.4)'))
          gradient.addColorStop(1, activeDataset.color.replace('rgb', 'rgba').replace(')', ', 0)'))
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
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: { display: false },
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
        title: { display: true, text: 'Date', color: '#6b7280' },
        ticks: { color: '#4b5563' },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Count', color: '#6b7280' },
        ticks: { color: '#4b5563' },
        grid: { color: 'rgba(0,0,0,0.05)' },
      },
    },
  }

  return (
    <div className="bg-white dark:bg-[#1c1c1c] text-gray-800 dark:text-white rounded-2xl shadow-md p-4 w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
        <div className="flex gap-2">
          {Object.keys(datasetsMap).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3 py-1 rounded text-sm font-medium ${activeTab === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              {datasetsMap[key].label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
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
