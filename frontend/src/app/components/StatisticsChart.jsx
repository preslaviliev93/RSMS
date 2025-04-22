'use client'

import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

export default function StatisticsChart({ clients = [], logs = [] }) {
  if (!clients.length && !logs.length) return <p className="text-gray-400">No data to display.</p>

  const labels = ['Total']

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Clients',
        data: [clients[0]?.value || 0],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Logs',
        data: [logs[0]?.value || 0],
        borderColor: 'rgb(234, 88, 12)',
        backgroundColor: 'rgba(234, 88, 12, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          color: '#aaa',
        },
        ticks: {
          color: '#ccc',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count',
          color: '#aaa',
        },
        ticks: {
          beginAtZero: true,
          color: '#ccc',
        },
      },
    },
  }

  return <Line options={chartOptions} data={chartData} />
}
