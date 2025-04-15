'use client';

const sampleServers = [
  { id: 'SRV-001', name: 'Auth Server', status: 'Online', ip: '192.168.1.10' },
  { id: 'SRV-002', name: 'Database', status: 'Offline', ip: '192.168.1.20' },
  { id: 'SRV-003', name: 'Web API', status: 'Online', ip: '192.168.1.30' },
  { id: 'SRV-004', name: 'Logging', status: 'Maintenance', ip: '192.168.1.40' },
];

export default function ServersTable() {
  return (
    <div className="rounded-xl overflow-hidden border border-[var(--border-color)] shadow-sm">
      <table className="w-full text-sm text-left text-[var(--font-color)]">
        <thead className="text-xs uppercase bg-[var(--border-color)]/20">
          <tr>
            <th className="px-6 py-3">Server ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {sampleServers.map((server) => (
            <tr
              key={server.id}
              className="border-t border-[var(--border-color)] hover:bg-[var(--border-color)]/10 transition-colors"
            >
              <td className="px-6 py-4">{server.id}</td>
              <td className="px-6 py-4">{server.name}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    server.status === 'Online'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : server.status === 'Offline'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}
                >
                  {server.status}
                </span>
              </td>
              <td className="px-6 py-4">{server.ip}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
