import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Progress } from "@/components/ui/progress"

// Mock data - in a real app, this would come from Tauri backend
const mockApps = [
  { name: "Visual Studio Code", category: "Development", time: 120, icon: "V" },
  { name: "Chrome", category: "Browser", time: 95, icon: "C" },
  { name: "Slack", category: "Communication", time: 45, icon: "S" },
  { name: "Spotify", category: "Entertainment", time: 30, icon: "S" },
  { name: "Terminal", category: "Development", time: 25, icon: "T" },
  { name: "Notion", category: "Productivity", time: 20, icon: "N" },
  { name: "Figma", category: "Design", time: 15, icon: "F" },
  { name: "Mail", category: "Communication", time: 10, icon: "M" },
]

export default function AppUsage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">App Usage</h1>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search applications..." className="w-full pl-8 bg-background" />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Apps</TabsTrigger>
          <TabsTrigger value="development">Development</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="productivity">Productivity</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Applications</CardTitle>
              <CardDescription>Your usage across all applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockApps.map((app, i) => (
                  <div key={i} className="flex items-center">
                    <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mr-4">
                      <div className="text-sm">{app.icon}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between">
                        <p className="text-sm font-medium truncate">{app.name}</p>
                        <p className="text-sm text-muted-foreground">{app.time} min</p>
                      </div>
                      <p className="text-xs text-muted-foreground mb-1">{app.category}</p>
                      <Progress value={(app.time / 120) * 100} className="h-1.5" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tab contents would be similar but filtered by category */}
        <TabsContent value="development" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Development Applications</CardTitle>
              <CardDescription>Your usage across development applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {mockApps
                  .filter((app) => app.category === "Development")
                  .map((app, i) => (
                    <div key={i} className="flex items-center">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center mr-4">
                        <div className="text-sm">{app.icon}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium truncate">{app.name}</p>
                          <p className="text-sm text-muted-foreground">{app.time} min</p>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{app.category}</p>
                        <Progress value={(app.time / 120) * 100} className="h-1.5" />
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Similar content for other tabs */}
      </Tabs>
    </div>
  )
}

