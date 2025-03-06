import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"

// Mock data - in a real app, this would come from Tauri backend
const data = [
  { time: "12 AM", usage: 0 },
  { time: "2 AM", usage: 0 },
  { time: "4 AM", usage: 0 },
  { time: "6 AM", usage: 0.2 },
  { time: "8 AM", usage: 0.8 },
  { time: "10 AM", usage: 1.0 },
  { time: "12 PM", usage: 0.5 },
  { time: "2 PM", usage: 0.9 },
  { time: "4 PM", usage: 1.0 },
  { time: "6 PM", usage: 0.7 },
  { time: "8 PM", usage: 0.3 },
  { time: "10 PM", usage: 0.1 },
]

export function UsageChart() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 0,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis dataKey="time" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
          <YAxis
            className="text-xs"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
            tickFormatter={(value) => `${value}h`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              borderRadius: "0.5rem",
              color: "hsl(var(--foreground))",
            }}
            formatter={(value) => [`${value} hours`, "Usage"]}
          />
          <Line
            type="monotone"
            dataKey="usage"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ r: 3, fill: "hsl(var(--primary))" }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

