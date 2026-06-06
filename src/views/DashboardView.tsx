import React, { useMemo } from 'react'
import Dashboard from '../components/Dashboard/Dashboard'
import type { DashboardViewProps } from '../types'
import { getStats } from '../utils/helpers'

export const DashboardView: React.FC<DashboardViewProps> = ({ tasks }) => {
  const stats = useMemo(() => getStats(tasks), [tasks])

  return (
    <div
      id="dashboard-panel"
      role="tabpanel"
      aria-labelledby="tab-dashboard"
      className="mx-auto w-full max-w-6xl px-4 pb-8"
    >
      <Dashboard stats={stats} />
    </div>
  )
}

export default DashboardView
