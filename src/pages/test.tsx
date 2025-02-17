import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Overview } from "../components/overview"
import { AppUsage } from "../components/app-usage"
import { Clock, Layout, BarChart, ArrowUp, ArrowDown } from "lucide-react"

export default function Home() {
  return (

    //TODO: Dragable region
    <div className="flex-1 space-y-4 p-8 pt-6">
     
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Screen Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">8h 12m</div>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              <ArrowUp className="h-4 w-4 inline mr-1" />
              2.1% from last week
            </p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Used App</CardTitle>
            <Layout className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">Chrome</div>
            <p className="text-xs text-purple-600 dark:text-purple-400">2h 45m today</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productive Time</CardTitle>
            <BarChart className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-200">5h 30m</div>
            <p className="text-xs text-green-600 dark:text-green-400">67% of total time</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apps Used</CardTitle>
            <Layout className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">12</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">
              <ArrowDown className="h-4 w-4 inline mr-1" />2 from yesterday
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Top Applications</CardTitle>
          </CardHeader>
          <CardContent>
            <AppUsage />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

