import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { invoke } from '@tauri-apps/api/tauri'

interface ScreenTimeData {
  app_name: string
  duration: number
}

export function ScreenTimeTracker() {
  const [screenTimeData, setScreenTimeData] = useState<ScreenTimeData[]>([])
  const [totalTime, setTotalTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(async () => {
      const data: ScreenTimeData[] = await invoke('get_tracking_data')
      const total = data.reduce((sum, item) => sum + item.duration, 0)
      setScreenTimeData(data)
      setTotalTime(total)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}h ${minutes}m ${secs}s`
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Screen Time Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Application</TableHead>
              <TableHead>Time Spent</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {screenTimeData.map((app) => (
              <TableRow key={app.app_name}>
                <TableCell className="font-medium">{app.app_name}</TableCell>
                <TableCell>{formatTime(app.duration)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Progress 
                      value={(app.duration / totalTime) * 100} 
                      className="w-[60%]" 
                    />
                    <span className="text-muted-foreground">
                      {Math.round((app.duration / totalTime) * 100)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}