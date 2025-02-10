// src/components/ScreenTimeDashboard.tsx
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { FaApple, FaChrome, FaCode, FaSpotify, FaRegClock } from 'react-icons/fa'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

const mockData = {
  daily: [
    { day: 'Mon', hours: 3.2 },
    { day: 'Tue', hours: 4.1 },
    { day: 'Wed', hours: 2.8 },
    { day: 'Thu', hours: 5.4 },
    { day: 'Fri', hours: 3.7 },
    { day: 'Sat', hours: 1.2 },
    { day: 'Sun', hours: 2.5 },
  ],
  apps: [
    { name: 'VS Code', hours: 18, icon: <FaCode /> },
    { name: 'Chrome', hours: 22, icon: <FaChrome /> },
    { name: 'Spotify', hours: 12, icon: <FaSpotify /> },
    { name: 'System', hours: 8, icon: <FaApple /> },
  ],
}

export function ScreenTimeDashboard() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {/* Header */}
        <div className="md:col-span-3 lg:col-span-4">
          <h1 className="text-3xl font-bold text-foreground">Screen Time</h1>
          <p className="text-muted-foreground">Weekly Activity Summary</p>
        </div>

        {/* Stats Cards */}
        <Card className="apple-card">
          <CardHeader>
            <CardTitle className="text-lg">Total Screen Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <FaRegClock className="h-8 w-8 text-primary" />
              <div>
                <p className="text-3xl font-bold">28.9h</p>
                <p className="text-sm text-muted-foreground">+12% from last week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="apple-card">
          <CardHeader>
            <CardTitle className="text-lg">Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-secondary p-2">
                <FaRegClock className="h-6 w-6 text-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold">4.1h</p>
                <p className="text-sm text-muted-foreground">-1.2h from last week</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Chart */}
        <Card className="md:col-span-2 lg:col-span-2 apple-card">
          <CardHeader>
            <CardTitle>Daily Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockData.daily}>
                  <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
                  <YAxis stroke="hsl(var(--foreground))" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* App Usage List */}
        <Card className="md:col-span-2 lg:col-span-2 apple-card">
          <CardHeader>
            <CardTitle>App Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {mockData.apps.map((app, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{app.icon}</span>
                    <div>
                      <p className="font-medium">{app.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.hours} hours
                      </p>
                    </div>
                  </div>
                  <div className="h-2 w-24 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${(app.hours / 24) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2 apple-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                    {i < 4 && (
                      <div className="absolute left-0.5 h-8 w-px bg-border mt-2" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Opened VS Code</p>
                    <p className="text-sm text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}