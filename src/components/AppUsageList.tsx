import { Progress } from "@/components/ui/progress"

const appUsageData = [
  { name: "Social", time: 180, icon: "🌐" },
  { name: "Productivity", time: 120, icon: "📊" },
  { name: "Entertainment", time: 90, icon: "🎬" },
  { name: "Gaming", time: 60, icon: "🎮" },
  { name: "Education", time: 45, icon: "📚" },
]

export function AppUsageList() {
  const maxTime = Math.max(...appUsageData.map((app) => app.time))

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg h-full">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">App Categories</h2>
      <div className="space-y-6">
        {appUsageData.map((app) => (
          <div key={app.name}>
            <div className="flex justify-between mb-2">
              <span className="font-medium text-gray-700">{app.name}</span>
              <span className="text-sm text-gray-500">{formatTime(app.time)}</span>
            </div>
            <Progress value={(app.time / maxTime) * 100} className="h-2 bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  )
}

function formatTime(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

