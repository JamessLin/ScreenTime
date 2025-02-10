const mostUsedApps = [
    { name: "Instagram", time: 120, icon: "📸" },
    { name: "Twitter", time: 90, icon: "🐦" },
    { name: "Slack", time: 60, icon: "💼" },
    { name: "YouTube", time: 45, icon: "▶️" },
  ]
  
  export function MostUsedApps() {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-lg h-full">
        <h2 className="mb-4 text-2xl font-semibold text-gray-900">Most Used Apps</h2>
        <div className="space-y-4">
          {mostUsedApps.map((app) => (
            <div key={app.name} className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{app.icon}</span>
                <span className="font-medium text-gray-700">{app.name}</span>
              </div>
              <span className="text-sm text-gray-500">{formatTime(app.time)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  function formatTime(minutes: number) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }
  
  