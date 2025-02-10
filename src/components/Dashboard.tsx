import { OverallScreenTime } from "./OverallScreenTime.tsx"
import { AppUsageList } from "./AppUsageList"
import { UsageChart } from "./UsageChart.tsx"
import { MostUsedApps } from "./MostUsedApps.tsx"

export function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8 font-sans">
      <h1 className="mb-8 text-4xl font-bold text-gray-900">Screen Time</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full lg:col-span-2">
          <OverallScreenTime hours={6} minutes={45} />
        </div>
        <div className="lg:row-span-2">
          <AppUsageList />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <UsageChart />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <MostUsedApps />
        </div>
      </div>
    </div>
  )
}

