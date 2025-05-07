export default function FilterResultsSeaching({
  type,
  placeholder,
  value,
  onChange,
  exactMatch,
  setExactMatch,
  excludeMatch,
  setExcludeMatch,
}) {
  return (
    <div className="space-y-2">
      <input
        type={type}
        placeholder={placeholder}
        value={value ?? ''}
        onChange={onChange}
        className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="flex flex-wrap gap-4 text-sm text-gray-700 dark:text-gray-300">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={exactMatch}
            onChange={(e) => setExactMatch(e.target.checked)}
          />
          Exact match
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={excludeMatch}
            onChange={(e) => setExcludeMatch(e.target.checked)}
          />
          Exclude match
        </label>
      </div>
    </div>
  )
}
