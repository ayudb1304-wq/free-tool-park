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
  ReferenceLine,
  ResponsiveContainer,
} from "recharts"

export interface MonthPoint {
  month: number
  balance: number
  value: number
}

type ChartProps =
  | {
      type: "breakdown"
      vehiclePrice: number
      salesTax: number
      fees: number
      totalInterest: number
    }
  | {
      type: "upside-down"
      data: MonthPoint[]
      crossoverMonth: number | null
    }
  | {
      type: "principal-interest"
      yearSchedule: Array<{
        year: number
        principal: number
        interest: number
      }>
    }

const COLORS = ["#3b82f6", "#22c55e", "#eab308", "#ef4444"]

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

export default function AutoLoanCharts(props: ChartProps) {
  if (props.type === "breakdown") {
    const data = [
      { name: "Vehicle Price", value: props.vehiclePrice },
      { name: "Sales Tax", value: props.salesTax },
      { name: "Fees", value: props.fees },
      { name: "Total Interest", value: props.totalInterest },
    ].filter((d) => d.value > 0)

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
              label={(p) =>
                `${p.name ?? ""}: ${(((p.percent as number) ?? 0) * 100).toFixed(1)}%`
              }
              labelLine={false}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => fmtTooltip(Number(value))} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (props.type === "upside-down") {
    return (
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={props.data}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis
            dataKey="month"
            label={{ value: "Month", position: "bottom", offset: -5 }}
          />
          <YAxis tickFormatter={fmtShort} width={70} />
          <Tooltip
            formatter={(value) => fmtTooltip(Number(value))}
            labelFormatter={(label) => `Month ${label}`}
          />
          <Legend />
          {props.crossoverMonth != null && (
            <ReferenceLine
              x={props.crossoverMonth}
              stroke="#22c55e"
              strokeDasharray="4 4"
              label={{
                value: `Break-even: mo ${props.crossoverMonth}`,
                position: "top",
                fontSize: 11,
              }}
            />
          )}
          <Line
            type="monotone"
            dataKey="balance"
            name="Loan Balance"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="Estimated Vehicle Value"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    )
  }

  // principal vs interest per year
  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={props.yearSchedule}>
        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
        <XAxis
          dataKey="year"
          label={{ value: "Year", position: "bottom", offset: -5 }}
        />
        <YAxis tickFormatter={fmtShort} width={70} />
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
