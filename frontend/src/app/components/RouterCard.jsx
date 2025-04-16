'use client'
import { ShieldCheck, Cpu, Globe, Clock, Network, Link2, Activity } from 'lucide-react'
import Link from 'next/link'

export default function RouterCard({ router }) {
  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-4 hover:shadow-lg transition">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {router.router_identity}
        </h2>
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100 rounded">
          {router.router_model}
        </span>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <p className="flex items-center gap-2"><Cpu className="w-4 h-4" /> Hardware: {router.router_hardware}</p>
        <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> Uptime: {router.router_uptime}</p>
        <p className="flex items-center gap-2"><Network className="w-4 h-4" /> Uplink IP: {router.router_uplink_ip}</p>
        <p className="flex items-center gap-2"><Globe className="w-4 h-4" /> Public IP: {router.router_public_ip}</p>
        <p className="flex items-center gap-2"><Link2 className="w-4 h-4" /> Tunnel IP: {router.router_tunnel_ip}</p>
        <p className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> Version: {router.router_version}</p>
      </div>

      <div className="pt-4">
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Tunnels</h3>
        <div className="space-y-1">
          {router.tunnels.map((tunnel, index) => (
            <div
              key={index}
              className="flex justify-between text-sm px-3 py-2 rounded-md border dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-[#262626]"
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-100">{tunnel.tunnel_name}</span>
                <span className="text-xs text-gray-500">{tunnel.tunnel_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${tunnel.tunnel_is_active ? 'text-green-500' : 'text-red-500'}`}>
                  {tunnel.tunnel_is_active ? 'Active' : 'Inactive'}
                </span>
                <Activity className={`w-4 h-4 ${tunnel.tunnel_is_active ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="pt-2">
        <Link
            href={`/routers/${router.id}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 text-sm hover:underline"
        >
            View Details
        </Link>
      </div>
    </div>
  )
}
