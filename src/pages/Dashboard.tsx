import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Activity, Clock, Calendar, BarChart2, Monitor, ChevronRight, Lock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';


const mockData = [
  { name: 'Mon', time: 4 },
  { name: 'Tue', time: 3 },
  { name: 'Wed', time: 5 },
  { name: 'Thu', time: 2 },
  { name: 'Fri', time: 6 },
  { name: 'Sat', time: 8 },
  { name: 'Sun', time: 7 },
];

export default function ScreenTimeDashboard() {
  const [timeFrame, setTimeFrame] = useState('today');

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Screen Time</h1>
          <Tabs defaultValue="today" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="today">Today</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>


        <Card className="bg-primary/5">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Screen Time</p>
                <h2 className="text-4xl font-bold">5h 42m</h2>
                <p className="text-sm text-green-600">↑ 12% from yesterday</p>
              </div>
              <div className="col-span-2">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="time" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6">

          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Most Used Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Visual Studio Code', 'Chrome', 'Spotify', 'Slack'].map((app) => (
                  <div key={app} className="flex items-center justify-between p-3 hover:bg-accent rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{app}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">2h 15m</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">

            <Card>
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Focus Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">3h 25m</p>
                    <p className="text-sm text-muted-foreground">Total focus time today</p>
                  </div>
                  <div className="w-24 h-24 border-8 border-primary rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">68%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Productivity Score</p>
                    <p className="text-2xl font-bold">85</p>
                  </div>
                  <div className="h-2 w-48 bg-primary/20 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-primary rounded-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}