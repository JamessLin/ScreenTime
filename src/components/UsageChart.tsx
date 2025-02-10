import { Bar } from "react-chartjs-2"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const data = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [
    {
      label: "Social",
      data: [2, 1.5, 2.5, 2, 2.5, 3, 2.5],
      backgroundColor: "rgba(0, 122, 255, 0.8)", // Apple Blue
    },
    {
      label: "Productivity",
      data: [1.5, 2, 1, 2.5, 1.5, 1, 1.5],
      backgroundColor: "rgba(52, 199, 89, 0.8)", // Apple Green
    },
    {
      label: "Entertainment",
      data: [1, 1.5, 0.5, 1.5, 1, 3, 1.5],
      backgroundColor: "rgba(255, 149, 0, 0.8)", // Apple Orange
    },
    {
      label: "Other",
      data: [0.5, 1, 0.5, 1, 0.5, 1, 0.5],
      backgroundColor: "rgba(175, 82, 222, 0.8)", // Apple Purple
    },
  ],
}

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      labels: {
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
        font: {
          size: 12,
        },
      },
    },
    title: {
      display: false,
    },
    tooltip: {
      mode: "index" as const,
      intersect: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      max: 8,
      ticks: {
        stepSize: 2,
        callback: (value: number | string) => value + "h",
      },
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
  },
}

export function UsageChart() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h2 className="mb-4 text-2xl font-semibold text-gray-900">Weekly Trend</h2>
      <div className="h-64">
        <Bar options={options} data={data} />
      </div>
    </div>
  )
}

