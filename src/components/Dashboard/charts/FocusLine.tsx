import React, { useCallback, useId, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTheme } from '../../../hooks/useTheme'
import type { PomodoroSession } from '../../../types'
import { getFocusSeries } from '../../../utils/helpers'
import {
  getChartTooltipCursor,
  getFocusBarColors,
  getTooltipNumericValue,
} from '../../../utils/chartColors'
import { ChartTooltipContent } from './ChartTooltip'

type FocusLineProps = {
  sessions: PomodoroSession[]
}

export const FocusLine: React.FC<FocusLineProps> = ({ sessions }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const gradientId = useId().replace(/:/g, '')

  const gridColor = theme === 'dark' ? '#2d2d2d' : '#e5e5e5'
  const axisColor = theme === 'dark' ? '#737373' : '#525252'
  const barColors = getFocusBarColors(theme)

  const formatValue = useCallback(
    (value: number) => t('focus.minutes', { n: value }),
    [t],
  )

  const series = useMemo(() => {
    const raw = getFocusSeries(sessions, 7)
    return raw.map((point) => ({
      ...point,
      label: point.label === 'Today' ? t('chart.today') : point.label,
    }))
  }, [sessions, t])

  return (
    <div className="rounded-lg border border-tk-border bg-tk-surface p-4 shadow-sm">
      <h3 className="mb-2 text-sm font-medium text-tk-text-2">{t('dashboard.focusCurve')}</h3>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart
          data={series}
          margin={{ top: 4, right: 4, left: -8, bottom: 0 }}
          barCategoryGap="32%"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={barColors.top} stopOpacity={0.95} />
              <stop offset="100%" stopColor={barColors.bottom} stopOpacity={0.75} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            dy={6}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: axisColor }}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip
            cursor={getChartTooltipCursor(theme)}
            offset={12}
            wrapperStyle={{ outline: 'none', zIndex: 10 }}
            content={(props) => {
              const value = getTooltipNumericValue(props.payload)
              if (!props.active || value == null) return null
              return (
                <ChartTooltipContent
                  label={props.label}
                  value={value}
                  formatValue={formatValue}
                />
              )
            }}
          />
          <Bar
            dataKey="count"
            fill={`url(#${gradientId})`}
            maxBarSize={28}
            radius={[6, 6, 0, 0]}
            activeBar={{ fill: barColors.active, opacity: 0.9 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FocusLine
