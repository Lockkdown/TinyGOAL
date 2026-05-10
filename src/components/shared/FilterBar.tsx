import React from 'react'
import type { Category, FilterBarProps, Priority, Status } from '../../types'

const CATEGORIES: Category[] = ['Work', 'Personal', 'Study', 'Other']
const PRIORITIES: Priority[] = ['Low', 'Medium', 'High']
const STATUSES: Status[] = ['Todo', 'In Progress', 'Done']

const SELECT_CLASS =
  'w-full min-w-[8rem] rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
      <div className="flex w-full flex-col gap-3 sm:flex-1 sm:flex-row sm:flex-wrap sm:gap-4">
        <div className="min-w-[8rem] flex-1">
          <label htmlFor="filter-category" className="mb-1 block text-sm font-medium text-slate-700">
            Category
          </label>
          <select
            id="filter-category"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="All">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[8rem] flex-1">
          <label htmlFor="filter-priority" className="mb-1 block text-sm font-medium text-slate-700">
            Priority
          </label>
          <select
            id="filter-priority"
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="All">All</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div className="min-w-[8rem] flex-1">
          <label htmlFor="filter-status" className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="filter-status"
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className={SELECT_CLASS}
          >
            <option value="All">All</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="sm:shrink-0">
        <button
          type="button"
          onClick={onClearFilters}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 sm:w-auto"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export default FilterBar
