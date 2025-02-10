import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

interface OverallScreenTimeProps {
  hours: number
  minutes: number
}

export function OverallScreenTime({ hours, minutes }: OverallScreenTimeProps) {
  const totalMinutes = hours * 60 + minutes
  const percentage = (totalMinutes / (24 * 60)) * 100

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">Today's Screen Time</h2>
      <div className="flex items-center justify-between">
        <div className="w-32 h-32">
          <CircularProgressbar
            value={percentage}
            text={`${hours}h ${minutes}m`}
            styles={buildStyles({
              textSize: "16px",
              pathColor: "#007AFF",
              textColor: "#007AFF",
              trailColor: "#E5E5EA",
            })}
          />
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Daily Average</p>
          <p className="text-3xl font-bold text-gray-900">5h 30m</p>
          <p className="text-sm text-green-500">23% below average</p>
        </div>
      </div>
    </div>
  )
}

