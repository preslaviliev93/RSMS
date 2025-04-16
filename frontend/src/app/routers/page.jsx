'use client'

import { useState } from 'react'
import RouterCard from '../components/RouterCard'

// --- Mock Data
const mockRouters = [
  {
    id: 1,
    router_serial: "R001-ABC123",
    router_model: "RB4011",
    router_version: "7.12.1",
    router_hardware: "RB4011iGS+",
    router_identity: "Office Router",
    router_uplink_ip: "192.168.88.1",
    router_public_ip: "203.0.113.12",
    router_tunnel_ip: "10.19.47.1",
    router_uptime: "4d 6h 12m",
    tunnels: [
      {
        tunnel_name: "sstp-out1",
        tunnel_type: "sstp-client",
        tunnel_is_active: true,
        tunnel_ips: ["10.10.10.1"]
      },
      {
        tunnel_name: "gre1",
        tunnel_type: "gre-tunnel",
        tunnel_is_active: false,
        tunnel_ips: []
      }
    ],
    dhcp_leases: [
      {
        hostname: "Laptop-1",
        mac_address: "AA:BB:CC:DD:EE:01",
        internal_ip: "192.168.88.101"
      },
      {
        hostname: "Printer-Office",
        mac_address: "AA:BB:CC:DD:EE:02",
        internal_ip: "192.168.88.150"
      }
    ]
  },
  {
    id: 2,
    router_serial: "R002-XYZ789",
    router_model: "hEX S",
    router_version: "7.10.3",
    router_hardware: "RB760iGS",
    router_identity: "Branch Router",
    router_uplink_ip: "192.168.89.1",
    router_public_ip: "203.0.113.45",
    router_tunnel_ip: "10.19.48.1",
    router_uptime: "12d 3h 45m",
    tunnels: [
      {
        tunnel_name: "wireguard1",
        tunnel_type: "wireguard",
        tunnel_is_active: true,
        tunnel_ips: ["10.11.11.1"]
      },
      {
        tunnel_name: "ovpn-out1",
        tunnel_type: "ovpn-client",
        tunnel_is_active: true,
        tunnel_ips: ["10.11.11.5"]
      }
    ],
    dhcp_leases: [
      {
        hostname: "Desktop-Branch",
        mac_address: "AA:BB:CC:DD:EE:11",
        internal_ip: "192.168.89.100"
      },
      {
        hostname: "POS-System",
        mac_address: "AA:BB:CC:DD:EE:12",
        internal_ip: "192.168.89.101"
      },
      {
        hostname: "Camera-1",
        mac_address: "AA:BB:CC:DD:EE:13",
        internal_ip: "192.168.89.102"
      }
    ]
  },
  { id: 3,
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
    ],
    dhcp_leases: [ // ✅ Add this block
      {
        hostname: "Desktop-01",
        mac_address: "AA:BB:CC:DD:EE:01",
        internal_ip: "192.168.88.101"
      },
      {
        hostname: "Printer",
        mac_address: "AA:BB:CC:DD:EE:02",
        internal_ip: "192.168.88.150"
      }
    ]
  }
]

// --- Main Page
export default function RoutersPage() {
  const [search, setSearch] = useState("")

  const filteredRouters = mockRouters.filter(router => {
    const target = JSON.stringify(router).toLowerCase()
    return target.includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {/* 🔍 Search Input */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search routers by name, IP, model, version..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* 🧩 Router Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRouters.length > 0 ? (
          filteredRouters.map(router => (
            <RouterCard key={router.id} router={router} />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 col-span-full">No routers found.</p>
        )}
      </div>
    </div>
  )
}
