'use client'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function DateRangePicker({ startDate, endDate, setStartDate, setEndDate }) {
  return (
    <div className="flex items-center gap-4">
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300">Start Date</label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          className="px-4 py-2 rounded border dark:bg-[#1c1c1c] dark:text-white"
        />
      </div>
      <div>
        <label className="text-sm text-gray-600 dark:text-gray-300">End Date</label>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          className="px-4 py-2 rounded border dark:bg-[#1c1c1c] dark:text-white"
        />
      </div>
    </div>
  )
}
