import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Monitor, BarChart2, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { UsageChart } from "../components/pagecomp/UsageChart"
import { Progress } from "@/components/ui/progress"

// Mock data - in a real app, this would come from Tauri backend
const mockData = {
  dailyUsage: 5.2, // hours
  weeklyAverage: 4.8, // hours
  weeklyChange: 8, // percent
  dailyLimit: 6, // hours
  topApps: [
    { name: "Visual Studio Code", time: 120 }, // minutes
    { name: "Chrome", time: 95 },
    { name: "Slack", time: 45 },
    { name: "Spotify", time: 30 },
  ],
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleTimeString()}</div>
      </div>

      <Tabs defaultValue="today" className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="week">This Week</TabsTrigger>
          <TabsTrigger value="month">This Month</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Screen Time Today</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.dailyUsage} hours</div>
                <div className="text-xs text-muted-foreground mt-1">Daily limit: {mockData.dailyLimit} hours</div>
                <Progress value={(mockData.dailyUsage / mockData.dailyLimit) * 100} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Weekly Average</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{mockData.weeklyAverage} hours</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  {mockData.weeklyChange > 0 ? (
                    <>
                      <ArrowUpRight className="mr-1 h-3 w-3 text-red-500" />
                      <span className="text-red-500">{mockData.weeklyChange}% from last week</span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="mr-1 h-3 w-3 text-green-500" />
                      <span className="text-green-500">{Math.abs(mockData.weeklyChange)}% from last week</span>
                    </>
                  )}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Devices</CardTitle>
                <Monitor className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground mt-1">MacBook Pro</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Usage Timeline</CardTitle>
                <CardDescription>Your screen time throughout the day</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <UsageChart />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Applications</CardTitle>
                <CardDescription>Apps you've used the most today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockData.topApps.map((app, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-9 h-9 rounded bg-primary/10 flex items-center justify-center mr-3">
                        <div className="text-xs">{app.name.charAt(0)}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{app.name}</p>
                        <div className="w-full mt-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{app.time} min</span>
                            <span>{Math.round((app.time / (mockData.dailyUsage * 60)) * 100)}%</span>
                          </div>
                          <Progress value={(app.time / (mockData.dailyUsage * 60)) * 100} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>Your screen time for the past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Weekly data will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="month" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Overview</CardTitle>
              <CardDescription>Your screen time for the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Monthly data will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

