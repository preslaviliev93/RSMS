import Link from 'next/link'
import CountUp from 'react-countup'

export default function StatTabs({ data = {} }) {
  const {
    total_clients = 0,
    total_logs = 0,
    total_macs = 0,
    total_routers = 0,
    total_heartbeats = 0,
    offline_routers = 0,
    inactive_routers = 0,
    
  } = data

  const cards = [
    { label: 'Clients', value: total_clients, color: 'blue' },
    { label: 'Logs', value: total_logs, color: 'orange' },
    { label: 'Routers', value: total_routers, color: 'cyan' },
    { label: 'Machines', value: total_macs, color: 'indigo' },
    { label: 'Heartbeats', value: total_heartbeats, color: 'teal' },
    {
      label: 'Offline Routers',
      value: offline_routers,
      color: 'red',
      alert: true,
    },
    {
      label: 'Inactive > 24h',
      value: (
        <Link href="/routers?inactive=24" className="text-blue-500 hover:underline">
          {inactive_routers}
        </Link>
      ),
      color: 'red',
      alert: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 mt-4">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl shadow-md bg-white dark:bg-[#1c1c1c] text-gray-800 dark:text-white border ${
            card.alert ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{card.label}</p>
          <p className="text-2xl font-bold">
            {typeof card.value === 'number' ? <CountUp end={card.value} duration={1.2} /> : card.value}
          </p>
        </div>
      ))}
    </div>
  )
}
