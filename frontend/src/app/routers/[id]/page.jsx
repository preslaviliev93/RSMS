'use client'
import { useParams } from 'next/navigation'
import { Cpu, Globe, Clock, Network, Link2, ShieldCheck, Activity } from 'lucide-react'

// You'd fetch this via Axios or SWR in real use
const sampleRouter = {
  router_serial: "ABC123456",
  router_model: "RB4011",
  router_version: "7.12.1",
  router_hardware: "RB4011iGS+",
  router_identity: "Office-Router",
  router_uplink_ip: "192.168.88.1",
  router_public_ip: "203.0.113.12",
  router_tunnel_ip: "10.0.0.1",
  router_uptime: "3d12h23m",
  tunnels: [
    { tunnel_name: "sstp-out1", tunnel_type: "sstp-client", tunnel_is_active: true, tunnel_ips: ["10.5.5.1"] },
    { tunnel_name: "wg1", tunnel_type: "wireguard", tunnel_is_active: false, tunnel_ips: [] }
  ]
}

export default function RouterDetailsPage() {
  const { id } = useParams()

  // TODO: Replace with live API call using id
  const router = sampleRouter

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 bg-white dark:bg-[#1c1c1c] border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {router.router_identity}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Router ID: {id}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
        <div className="flex items-center gap-2"><Cpu className="w-4 h-4" /> <span>Hardware:</span> {router.router_hardware}</div>
        <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4" /> <span>Model:</span> {router.router_model}</div>
        <div className="flex items-center gap-2"><Globe className="w-4 h-4" /> <span>Public IP:</span> {router.router_public_ip}</div>
        <div className="flex items-center gap-2"><Network className="w-4 h-4" /> <span>Uplink IP:</span> {router.router_uplink_ip}</div>
        <div className="flex items-center gap-2"><Link2 className="w-4 h-4" /> <span>Tunnel IP:</span> {router.router_tunnel_ip}</div>
        <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> <span>Uptime:</span> {router.router_uptime}</div>
        <div className="flex items-center gap-2"><span>OS Version:</span> {router.router_version}</div>
        <div className="flex items-center gap-2"><span>Serial:</span> {router.router_serial}</div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">Tunnels</h2>
        <div className="space-y-2">
          {router.tunnels.length > 0 ? router.tunnels.map((tunnel, index) => (
            <div key={index} className="p-3 rounded-md border dark:border-gray-600 border-gray-200 bg-gray-50 dark:bg-[#262626]">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="font-medium text-gray-700 dark:text-gray-100">{tunnel.tunnel_name}</p>
                  <p className="text-xs text-gray-500">{tunnel.tunnel_type}</p>
                  <p className="text-xs text-gray-500">IPs: {tunnel.tunnel_ips.join(', ') || 'None'}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium ${tunnel.tunnel_is_active ? 'text-green-600' : 'text-red-500'}`}>
                    {tunnel.tunnel_is_active ? 'Active' : 'Inactive'}
                  </span>
                  <Activity className={`w-4 h-4 ${tunnel.tunnel_is_active ? 'text-green-600' : 'text-red-500'}`} />
                </div>
              </div>
            </div>
          )) : (
            <p className="text-sm text-gray-500">No tunnels configured.</p>
          )}
          {router.dhcp_leases && router.dhcp_leases.length > 0 && (
  <div className="mt-8">
    <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-100">DHCP Leases</h2>
    <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-[#2a2a2a] text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-2">Hostname</th>
            <th className="px-4 py-2">MAC Address</th>
            <th className="px-4 py-2">Internal IP</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-[#1c1c1c] text-gray-800 dark:text-gray-100">
          {router.dhcp_leases.map((lease, index) => (
                        <tr key={index} className="border-t dark:border-gray-700">
                        <td className="px-4 py-2">{lease.hostname}</td>
                        <td className="px-4 py-2">{lease.mac_address}</td>
                        <td className="px-4 py-2">{lease.internal_ip}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
            )}
        </div>
      </div>
    </div>
  )
}
