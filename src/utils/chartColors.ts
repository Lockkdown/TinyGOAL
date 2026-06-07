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
