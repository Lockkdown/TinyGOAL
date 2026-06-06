import React from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../hooks/useTheme'
import type { Category } from '../../types'
import {
  CHART_BADGE_BG_ALPHA,
  CHART_BADGE_TEXT_CLASSES,
  getCategoryChartColor,
  hexWithAlpha,
} from '../../utils/chartColors'

type CategoryBadgeProps = {
  category: Category
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const label = t(`category.${category}`)
  const chartColor = getCategoryChartColor(category, theme)

  return (
    <span
      className={`inline-flex shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${CHART_BADGE_TEXT_CLASSES}`}
      style={{ backgroundColor: hexWithAlpha(chartColor, CHART_BADGE_BG_ALPHA) }}
      aria-label={label}
    >
      {label}
    </span>
  )
}

export default CategoryBadge
