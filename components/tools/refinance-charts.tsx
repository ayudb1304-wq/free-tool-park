"use client"

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts"

export interface SavingsPoint {
  month: number
  savings: number
}

type ChartProps =
  | {
      type: "savings-curve"
      data: SavingsPoint[]
      breakEvenMonths: number
    }
  | {
      type: "comparison"
      currentTotalInterest: number
      newTotalInterest: number
      closingCosts: number
    }

function fmtShort(n: number) {
  const abs = Math.abs(n)
  const sign = n < 0 ? "-" : ""
  if (abs >= 1000000) return `${sign}$${(abs / 1000000).toFixed(1)}M`
  if (abs >= 1000) return `${sign}$${(abs / 1000).toFixed(0)}K`
  return `${sign}$${abs.toFixed(0)}`
}

function fmtTooltip(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export default function RefinanceCharts(props: ChartProps) {
  if (props.type === "savings-curve") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={props.data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="month"
            label={{ value: "Months", position: "bottom", offset: -5 }}
          />
          <YAxis tickFormatter={fmtShort} width={70} />
          <Tooltip
            formatter={(value) => fmtTooltip(Number(value))}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Legend />
          <ReferenceLine
            y={0}
            stroke="#94a3b8"
            strokeDasharray="4 4"
            label={{ value: "Break-even", position: "right", fontSize: 11 }}
          />
          {Number.isFinite(props.breakEvenMonths) && (
            <ReferenceLine
              x={Math.round(props.breakEvenMonths)}
              stroke="#22c55e"
              strokeDasharray="4 4"
              label={{
                value: `${Math.round(props.breakEvenMonths)}mo`,
                position: "top",
                fontSize: 11,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="savings"
            name="Cumulative Net Savings"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // Comparison bar chart
  const data = [
    {
      name: "Current Loan Interest",
      value: props.currentTotalInterest,
      fill: "#ef4444",
    },
    {
      name: "New Loan Interest",
      value: props.newTotalInterest,
      fill: "#3b82f6",
    },
    {
      name: "Closing Costs",
      value: props.closingCosts,
      fill: "#eab308",
    },
  ]

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tickFormatter={fmtShort} width={70} />
        <Tooltip formatter={(value) => fmtTooltip(Number(value))} />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
