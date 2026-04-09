"use client"

import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface YearRow {
  year: number
  principal: number
  interest: number
  balance: number
}

type ChartProps =
  | {
      type: "pie"
      monthlyPI: number
      monthlyTax: number
      monthlyInsurance: number
      monthlyPMI: number
      monthlyHOA: number
      yearSchedule?: never
    }
  | {
      type: "line"
      yearSchedule: YearRow[]
      monthlyPI?: never
      monthlyTax?: never
      monthlyInsurance?: never
      monthlyPMI?: never
      monthlyHOA?: never
    }
  | {
      type: "bar"
      yearSchedule: YearRow[]
      monthlyPI?: never
      monthlyTax?: never
      monthlyInsurance?: never
      monthlyPMI?: never
      monthlyHOA?: never
    }

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444", "#a855f7"]

function fmtShort(n: number) {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`
  return `$${n.toFixed(0)}`
}

function fmtTooltip(n: number) {
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export default function MortgageCharts(props: ChartProps) {
  if (props.type === "pie") {
    const data = [
      { name: "Principal & Interest", value: props.monthlyPI },
      { name: "Property Tax", value: props.monthlyTax },
      { name: "Insurance", value: props.monthlyInsurance },
      ...(props.monthlyPMI > 0
        ? [{ name: "PMI", value: props.monthlyPMI }]
        : []),
      ...(props.monthlyHOA > 0
        ? [{ name: "HOA", value: props.monthlyHOA }]
        : []),
    ]

    return (
      <div className="mx-auto max-w-md">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              label={(props) =>
                `${props.name ?? ""}: ${(((props.percent as number) ?? 0) * 100).toFixed(1)}%`
              }
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => fmtTooltip(Number(value))}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (props.type === "line") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={props.yearSchedule}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="year"
            label={{ value: "Year", position: "bottom", offset: -5 }}
          />
          <YAxis tickFormatter={fmtShort} width={60} />
          <Tooltip formatter={(value) => fmtTooltip(Number(value))} />
          <Legend />
          <Line
            type="monotone"
            dataKey="principal"
            name="Principal Paid"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="interest"
            name="Interest Paid"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="balance"
            name="Remaining Balance"
            stroke="#8b5cf6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // Bar chart
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={props.yearSchedule}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis dataKey="year" />
        <YAxis tickFormatter={fmtShort} width={60} />
        <Tooltip formatter={(value) => fmtTooltip(Number(value))} />
        <Legend />
        <Bar
          dataKey="principal"
          name="Principal"
          fill="#3b82f6"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="interest"
          name="Interest"
          fill="#ef4444"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
