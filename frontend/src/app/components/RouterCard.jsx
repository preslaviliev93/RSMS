'use client'
import {
  ShieldCheck,
  Cpu,
  Globe,
  Clock,
  Network,
  Link2,
  Activity
} from 'lucide-react'
import Link from 'next/link'

export default function RouterCard({ router }) {
  if (!router) return null

  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 space-y-4 hover:shadow-lg transition">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {router.router_identity}
        </h2>
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100 rounded">
          {router.router_model}
        </span>
      </div>

      {/* Router Details */}
      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <p className="flex items-center gap-2">
          <Cpu className="w-4 h-4" /> Hardware: {router.router_hardware}
        </p>
        <p className="flex items-center gap-2">
          <Clock className="w-4 h-4" /> Uptime: {router.router_uptime}
        </p>
        <p className="flex items-center gap-2">
          <Network className="w-4 h-4" /> Uplink IP: {router.router_uplink_ip}
        </p>
        <p className="flex items-center gap-2">
          <Globe className="w-4 h-4" /> Public IP: {router.router_public_ip}
        </p>
        <p className="flex items-center gap-2">
          <Link2 className="w-4 h-4" /> Management IP: {router.router_vpn_mgmt_ip}
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Version: {router.router_version}
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> Client: {router.router_client || "Unknown"}
        </p>
        <p className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4" /> HC: {router.router_hc_client || "Unknown"}
        </p>
        {/* Interfaces */}
        
        {router.interfaces && (
  <div className="pt-4">
    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
      Interfaces
    </h3>
    {router.interfaces.length > 0 ? (
      <div className="space-y-1">
        {router.interfaces.map((intf, index) => (
          <div
            key={index}
            className="flex justify-between text-sm px-3 py-2 rounded-md border dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-[#262626]"
          >
            <div className="flex flex-col">
              <span className="font-medium text-gray-700 dark:text-gray-100">
                {intf.interface_name}
              </span>
              <span className="text-xs text-gray-500">
                {intf.interface_type}
              </span>
              <span className="text-xs text-gray-500">
                {intf.interface_ip || 'No IP assigned'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-semibold ${
                  intf.interface_is_active ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {intf.interface_is_active ? 'Active' : 'Inactive'}
              </span>
              <Activity
                className={`w-4 h-4 ${
                  intf.interface_is_active ? 'text-green-500' : 'text-red-500'
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm text-gray-500 dark:text-gray-400">No interfaces found.</p>
    )}
  </div>
)}

 



      </div>

      {/* Tunnels */}
      {router.tunnels?.length > 0 && (
        <div className="pt-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Tunnels
          </h3>
          <div className="space-y-1">
            {router.tunnels.map((tunnel, index) => (
              <div
                key={index}
                className="flex justify-between text-sm px-3 py-2 rounded-md border dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-[#262626]"
              >
                <div className="flex flex-col">
                  <span className="font-medium text-gray-700 dark:text-gray-100">
                    {tunnel.tunnel_name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {tunnel.tunnel_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold ${
                      tunnel.tunnel_is_active
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  >
                    {tunnel.tunnel_is_active ? 'Active' : 'Inactive'}
                  </span>
                  <Activity
                    className={`w-4 h-4 ${
                      tunnel.tunnel_is_active
                        ? 'text-green-500'
                        : 'text-red-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View Details Button */}
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
