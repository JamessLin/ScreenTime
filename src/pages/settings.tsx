import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { Slider } from "../components/ui/slider"
import { Button } from "../components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Configure how the application behaves</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-start">Start on system boot</Label>
                <p className="text-sm text-muted-foreground">Automatically start the app when your computer starts</p>
              </div>
              <Switch id="auto-start" />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="notifications">Enable notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications about your screen time</p>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>

            <Separator />

            <div className="space-y-3">
              <div>
                <Label htmlFor="idle-time">Idle detection time</Label>
                <p className="text-sm text-muted-foreground">Time before considering you as idle (in minutes)</p>
              </div>
              <div className="flex items-center gap-2">
                <Slider id="idle-time" defaultValue={[5]} max={30} step={1} className="flex-1" />
                <span className="w-12 text-sm">5 min</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Screen Time Limits</CardTitle>
            <CardDescription>Set daily limits for your screen time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div>
                <Label htmlFor="daily-limit">Daily screen time limit</Label>
                <p className="text-sm text-muted-foreground">Maximum hours of screen time per day</p>
              </div>
              <div className="flex items-center gap-2">
                <Slider id="daily-limit" defaultValue={[6]} max={12} step={0.5} className="flex-1" />
                <span className="w-12 text-sm">6 hrs</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <Label htmlFor="limit-action">When limit is reached</Label>
              <Select defaultValue="notify">
                <SelectTrigger id="limit-action">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notify">Notify only</SelectItem>
                  <SelectItem value="warn">Show warning</SelectItem>
                  <SelectItem value="block">Block screen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your usage data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Data retention</Label>
                <p className="text-sm text-muted-foreground">How long to keep your usage data</p>
              </div>
              <Select defaultValue="90">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="destructive" className="ml-auto">
              Clear All Data
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

