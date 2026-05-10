import React from 'react'
import type { SearchBarProps } from '../../types'

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="w-full sm:max-w-md">
      <label htmlFor="task-search" className="mb-1 block text-sm font-medium text-slate-700">
        Search
      </label>
      <input
        id="task-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by title or description"
        autoComplete="off"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}

export default SearchBar
