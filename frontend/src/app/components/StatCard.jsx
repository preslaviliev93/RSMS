export function StatCard({ title, value, alert = false }) {
    return (
      <div className={`rounded-xl p-4 shadow bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white ${alert ? 'border-red-500 border' : ''}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    );
  }