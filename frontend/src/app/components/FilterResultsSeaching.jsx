export default function FilterResultsSeaching({ type, placeholder, value, onChange }) {
    return (
      <div className="flex justify-between items-center">
        <input
          type={type}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          className="w-full md:w-1/2 px-4 py-2 border rounded-lg shadow-sm bg-white dark:bg-[#121212] text-gray-800 dark:text-gray-100 border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    )
  }
  