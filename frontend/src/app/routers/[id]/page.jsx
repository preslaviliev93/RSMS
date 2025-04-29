'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import axios from 'axios'
import { useAuthGuard } from '../../hooks/useAuthGuard'
import {
  Cpu,
  Globe,
  Clock,
  Network,
  ShieldCheck,
  Activity,
  EarthLock,
  CircleDot,
  Barcode,
  User,
  Code,
  MapPin,
  Eye,
  Calendar1,
  IdCard 
} from 'lucide-react'
import { formatDateForUI } from '@/app/utils/formatDate'
import { secureFetch } from '@/app/utils/secureFetch'
import toast from 'react-hot-toast'

export default function RouterDetailsPage() {
  const { user, loadingUser } = useAuthGuard()
  const [routerData, setRouterData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { id } = useParams()
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const fetchRouterDetails = async () => {
    setLoading(true)
    try {
      const response = await secureFetch({
        url: `${API_URL}/routers/${id}/`,
      })
      setRouterData(response)
    } catch (err) {
      toast.error('Failed to load router details.')
      setError('Failed to load router details.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user && !loadingUser) {
      router.push('/login')
    } else if (user && id) {
      fetchRouterDetails()
    }
  }, [user, loadingUser, id])

  if (loading) {
    return <div className="flex justify-center items-center h-60"><img src="/loading.svg" alt="Loading..." className="w-12 h-12" /></div>
  }

  if (error || !routerData) {
    return <div className="text-center text-red-500 mt-8">{error || 'Router not found.'}</div>
  }

  const routerInfo = routerData

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 bg-white dark:bg-[#1c1c1c] border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {routerInfo.router_identity}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Router ID: {id}</p>
      </div>
      {console.log(`Router Info:`, routerInfo)}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
        <InfoRow icon={<Cpu className="w-4 h-4" />} label="Hardware" value={routerInfo.router_hardware} />
        <InfoRow icon={<IdCard  className="w-4 h-4" />} label="Identity" value={routerInfo.router_identity} />
        <InfoRow icon={<ShieldCheck className="w-4 h-4" />} label="Model" value={routerInfo.router_model} />
        <InfoRow icon={<Globe className="w-4 h-4" />} label="Public IP" value={routerInfo.router_public_ip} />
        <InfoRow icon={<Network className="w-4 h-4" />} label="Uplink IP" value={routerInfo.router_uplink_ip} />
        <InfoRow icon={<EarthLock  className="w-4 h-4" />} label="Tunnel IP" value={routerInfo.router_vpn_mgmt_ip} />
        <InfoRow icon={<Clock className="w-4 h-4" />} label="Uptime" value={routerInfo.router_uptime} />
        <InfoRow icon={<CircleDot className="w-4 h-4" />} label="OS Version" value={routerInfo.router_version} />
        <InfoRow icon={<Barcode className="w-4 h-4" />} label="Serial" value={routerInfo.router_serial} />
        <InfoRow icon={<User className="w-4 h-4" />} label="Client" value={routerInfo.router_client?.client_name || "Unknown"} />
        <InfoRow icon={<Code className="w-4 h-4" />} label="Hardcoded" value={routerInfo.router_hc_client} />
        <InfoRow icon={<MapPin className="w-4 h-4" />} label="Location Country" value={routerInfo.router_location_country} />
        <InfoRow icon={<Eye className="w-4 h-4" />} label="Last Seen" value={formatDateForUI(routerInfo.router_last_seen)} />
        <InfoRow icon={<Calendar1 className="w-4 h-4" />} label="First time registered" value={formatDateForUI(routerInfo.router_added)} />
      </div>

      {/* Tunnels */}
      {routerInfo.tunnels?.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Tunnels</h2>
          <div className="space-y-2">
            {routerInfo.tunnels.map((tunnel, index) => (
              <div key={index} className="p-3 rounded-md border dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-[#262626]">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-medium text-gray-700 dark:text-gray-100">{tunnel.tunnel_name}</p>
                    <p className="text-xs text-gray-500">{tunnel.tunnel_type}</p>
                    <p className="text-xs text-gray-500">IPs: {tunnel.tunnel_ips?.join(', ') || 'None'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${tunnel.tunnel_is_active ? 'text-green-600' : 'text-red-500'}`}>
                      {tunnel.tunnel_is_active ? 'Active' : 'Inactive'}
                    </span>
                    <Activity className={`w-4 h-4 ${tunnel.tunnel_is_active ? 'text-green-600' : 'text-red-500'}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Router info */}
      {routerInfo.interfaces?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Interfaces</h2>
          <div className="flex flex-wrap gap-4">
            {routerInfo.interfaces.map((intf, index) => (
              <div key={index} className="w-32 text-center">
                <div
                  className={`w-12 h-12 mx-auto rounded-lg flex items-center justify-center border-2 transition ${
                    intf.interface_is_active
                      ? 'bg-green-500 border-green-600'
                      : 'bg-red-600 border-red-700'
                  }`}
                >
                  <Network className="w-5 h-5 text-white" />
                </div>
                <div className="mt-1 text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                  {intf.interface_name}
                </div>
                <div className="text-[14px] text-gray-500 dark:text-gray-400 break-all">
                  {intf.interface_ip || 'No IP'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* DHCP Leases */}
      {routerInfo.dhcp_leases?.length > 0 && (
  <div className="mt-10">
    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
      DHCP Leases
    </h2>

    <div className="overflow-auto rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
      <table className="min-w-full table-auto text-sm">
        <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-3 text-left">Hostname</th>
            <th className="px-6 py-3 text-left">MAC Address</th>
            <th className="px-6 py-3 text-left">Internal IP</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#1c1c1c] text-gray-800 dark:text-gray-100">
          {routerInfo.dhcp_leases.map((lease, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 dark:hover:bg-[#2a2a2a] border-t border-gray-200 dark:border-gray-700 transition"
            >
              <td className="px-6 py-3 whitespace-nowrap">{lease.hostname}</td>
              <td className="px-6 py-3 whitespace-nowrap font-mono">{lease.mac_address}</td>
              <td className="px-6 py-3 whitespace-nowrap">{lease.dhcp_lease_ip_address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}




    </div>
  )
}

// Reusable row component
function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2">
      {icon && <div>{icon}</div>}
      <span className="font-medium">{label}:</span>
      <span>{value || '—'}</span>
    </div>
  )
}
