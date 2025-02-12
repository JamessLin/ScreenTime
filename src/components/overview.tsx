"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const data = [
  {
    name: "Mon",
    social: 20,
    entertainment: 80,
    work: 320,
  },
  {
    name: "Tue",
    social: 22,
    entertainment: 60,
    work: 280,
  },
  {
    name: "Wed",
    social: 45,
    entertainment: 90,
    work: 350,
  },
  {
    name: "Thu",
    social: 20,
    entertainment: 70,
    work: 300,
  },
  {
    name: "Fri",
    social: 30,
    entertainment: 120,
    work: 280,
  },
  {
    name: "Sat",
    social: 38,
    entertainment: 150,
    work: 100,
  },
  {
    name: "Sun",
    social: 40,
    entertainment: 100,
    work: 50,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}m`}
        />
        <Tooltip
          formatter={(value, name) => [`${value}m`, typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1) : name]}
          labelStyle={{ color: "var(--foreground)" }}
        />
        <Legend />
        <Bar dataKey="social" stackId="stack" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="entertainment" stackId="stack" fill="#f59e0b" radius={[0, 0, 0, 0]} />
        <Bar dataKey="work" stackId="stack" fill="#4338ca" radius={[0, 0, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

