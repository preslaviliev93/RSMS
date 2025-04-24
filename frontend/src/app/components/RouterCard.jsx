'use client';
import {
  Cpu,
  Globe,
  Clock,
  Network,
  Link2,
  Activity,
  ArrowUp01,
  User,
  Code,
} from 'lucide-react';
import Link from 'next/link';
import Tooltip from '../components/Tooltip';

export default function RouterCard({ router }) {
  if (!router) return null;

  return (
    <div className="bg-white dark:bg-[#1c1c1c] rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 p-6 space-y-5 hover:shadow-lg transition">
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {router.router_serial}
        </h2>
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100 rounded">
          {router.router_model}
        </span>
      </div>

      {/* Router Details */}
      <div className="space-y-4">
        {/* System Info */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">System Info</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Tooltip text="Device hardware">
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition cursor-default">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <Cpu className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{router.router_hardware}</p>
                </div>
              </div>
            </Tooltip>

            <Tooltip text="Router uptime">
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition cursor-default">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <Clock className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{router.router_uptime}</p>
                </div>
              </div>
            </Tooltip>

            <Tooltip text="OS Version">
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition cursor-default">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <ArrowUp01 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{router.router_version}</p>
                </div>
              </div>
            </Tooltip>

            <Tooltip text="Client associated with this router">
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition cursor-default">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Client</p>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{router.router_client || 'Unknown'}</p>
                </div>
              </div>
            </Tooltip>

            <Tooltip text="Hardcoded Data">
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition cursor-default">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <Code className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{router.router_hc_client || 'Unknown'}</p>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* IP Addresses */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mt-2 mb-1">IP Addresses</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Tooltip text="Uplink IP address">
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition cursor-default">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <Network className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{router.router_uplink_ip}</p>
                </div>
              </div>
            </Tooltip>

            <Tooltip text="Public IP address">
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition cursor-default">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <Globe className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{router.router_public_ip}</p>
                </div>
              </div>
            </Tooltip>

            <Tooltip text="VPN management IP address">
              <div className="flex items-center gap-3 p-3 rounded-md bg-gray-50 dark:bg-[#262626] hover:bg-gray-100 dark:hover:bg-[#2f2f2f] transition cursor-default">
                <div className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
                  <Link2 className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{router.router_vpn_mgmt_ip}</p>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>

        {/* Interfaces */}
        {router.interfaces && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              Interfaces
            </h3>
            {router.interfaces.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {router.interfaces.map((intf, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center text-center w-14"
                  >
                    <Tooltip text={intf.interface_ip || 'No IP assigned'}>
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center border transition-colors duration-200 ${
                          intf.interface_is_active
                            ? 'bg-emerald-600 border-emerald-700'
                            : 'bg-rose-800 border-rose-700'
                        }`}
                      >
                        <Network className="w-4 h-4 text-white" />
                      </div>
                    </Tooltip>
                    <span className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
                      {intf.interface_name}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No interfaces found.
              </p>
            )}
          </div>
        )}
      </div>

      {/* View Details */}
      <div className="pt-2">
        <Link
          href={`/routers/${router.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition"
        >
          View Details <ArrowUp01 className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
