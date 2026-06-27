import type { AppTheme } from '../types'
import type { Category, Priority, Status } from '../types'

export const STATUS_CHART_COLORS: Record<Status, string> = {
  Todo: '#94a3b8',
  'In Progress': '#3b82f6',
  Done: '#22c55e',
}

export const STATUS_CHART_COLORS_DARK: Record<Status, string> = {
  Todo: '#94a3b8',
  'In Progress': '#60a5fa',
  Done: '#4ade80',
}

/** Badge/list header text — neutral, không trùng hue với nền chart */
export const CHART_BADGE_TEXT_CLASSES = 'text-neutral-900 dark:text-neutral-100'

/** Opacity nền chart trên badge/header — đủ nhìn rõ mà vẫn đọc được text trung tính */
export const CHART_BADGE_BG_ALPHA = 0.35

/** 4 màu category — mỗi nhãn một hue riêng; text giữ neutral ở component */
const CATEGORY_CHART_COLORS: Record<Category, { light: string; dark: string }> = {
  Work: { light: '#3b82f6', dark: '#60a5fa' },       // blue
  Personal: { light: '#a855f7', dark: '#c084fc' },   // violet
  Study: { light: '#f59e0b', dark: '#fbbf24' },      // amber
  Other: { light: '#94a3b8', dark: '#94a3b8' },      // slate
}

export function hexWithAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace('#', '')
  const r = Number.parseInt(normalized.slice(0, 2), 16)
  const g = Number.parseInt(normalized.slice(2, 4), 16)
  const b = Number.parseInt(normalized.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getStatusChartColor(status: Status, theme: AppTheme): string {
  return theme === 'dark' ? STATUS_CHART_COLORS_DARK[status] : STATUS_CHART_COLORS[status]
}

export function getCategoryChartColor(category: Category, theme: AppTheme): string {
  const palette = CATEGORY_CHART_COLORS[category]
  return theme === 'dark' ? palette.dark : palette.light
}

/** Pill colors aligned with PriorityIcon hues (green / amber / red) */
const PRIORITY_PILL_COLORS: Record<Priority, { light: string; dark: string }> = {
  Low: { light: '#22c55e', dark: '#4ade80' },
  Medium: { light: '#eab308', dark: '#facc15' },
  High: { light: '#ef4444', dark: '#f87171' },
}

export function getPriorityPillColor(priority: Priority, theme: AppTheme): string {
  const palette = PRIORITY_PILL_COLORS[priority]
  return theme === 'dark' ? palette.dark : palette.light
}

const BREAK_RING_COLOR = { light: '#0d9488', dark: '#14b8a6' }

/** Ring hues — muted vs priority pills; same green/amber/red semantics, less neon */
const RING_STATUS_COLORS: Record<Priority, { light: string; dark: string }> = {
  Low: { light: '#16a34a', dark: '#22c55e' },
  Medium: { light: '#ca8a04', dark: '#d97706' },
  High: { light: '#dc2626', dark: '#ef4444' },
}

/**
 * Ring color by remaining time ratio.
 * @param progress remaining fraction from App (1 at start → 0 at end)
 * focus: >50% remaining = green (Low) · 20–50% = amber (Medium) · <20% = red (High)
 * break: fixed teal
 */
export function getRingColor(
  progress: number,
  variant: 'focus' | 'break',
  theme: AppTheme,
): string {
  if (variant === 'break') {
    return theme === 'dark' ? BREAK_RING_COLOR.dark : BREAK_RING_COLOR.light
  }
  const remaining = Math.min(1, Math.max(0, progress))
  const level: Priority =
    remaining > 0.5 ? 'Low' : remaining > 0.2 ? 'Medium' : 'High'
  const palette = RING_STATUS_COLORS[level]
  return theme === 'dark' ? palette.dark : palette.light
}

/** Focus bar chart — muted sky gradient, not full-width neon blocks */
const FOCUS_BAR_COLORS: Record<AppTheme, { top: string; bottom: string; active: string }> = {
  light: { top: '#38bdf8', bottom: '#0284c7', active: '#0ea5e9' },
  dark: { top: '#7dd3fc', bottom: '#0284c7', active: '#38bdf8' },
}

export function getFocusBarColors(theme: AppTheme): { top: string; bottom: string; active: string } {
  return FOCUS_BAR_COLORS[theme]
}

/** Recharts bar/line hover band — subtle, theme-aware (tránh vùng trắng mặc định) */
export function getChartTooltipCursor(theme: AppTheme): { fill: string; radius?: number } {
  return {
    fill: theme === 'dark' ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
    radius: 4,
  }
}

export function getTooltipNumericValue(
  payload: ReadonlyArray<{ value?: unknown }> | undefined,
): number | null {
  const raw = payload?.[0]?.value
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw
  if (typeof raw === 'string') {
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}
