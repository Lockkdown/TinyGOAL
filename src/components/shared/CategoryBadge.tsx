import React from 'react'
import type { Category } from '../../types'

const CATEGORY_CLASSES: Record<Category, string> = {
  Work: 'bg-blue-100 text-blue-700',
  Personal: 'bg-purple-100 text-purple-700',
  Study: 'bg-amber-100 text-amber-700',
  Other: 'bg-slate-100 text-slate-600',
}

type CategoryBadgeProps = {
  category: Category
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  return (
    <span
      className={`inline-flex shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${CATEGORY_CLASSES[category]}`}
      aria-label={category}
    >
      {category}
    </span>
  )
}

export default CategoryBadge
