import React, { useCallback, useMemo } from 'react'
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
import { getChartTooltipCursor, getTooltipNumericValue } from '../../../utils/chartColors'
import { ChartTooltipContent } from './ChartTooltip'

type FocusLineProps = {
  sessions: PomodoroSession[]
}

export const FocusLine: React.FC<FocusLineProps> = ({ sessions }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const gridColor = theme === 'dark' ? '#2d2d2d' : '#e5e5e5'
  const axisColor = theme === 'dark' ? '#737373' : '#525252'
  const barColor = theme === 'dark' ? '#38bdf8' : '#0ea5e9'

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
        <BarChart data={series}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} stroke={axisColor} />
          <YAxis allowDecimals={false} tick={{ fontSize: 12 }} stroke={axisColor} />
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
            fill={barColor}
            radius={[4, 4, 0, 0]}
            activeBar={{ fill: barColor, opacity: 0.75 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default FocusLine
