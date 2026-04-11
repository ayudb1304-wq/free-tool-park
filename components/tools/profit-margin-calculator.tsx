"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { INDUSTRY_BENCHMARKS } from "@/data/profit-margin-benchmarks"

type Mode = "calculate" | "reverse" | "bulk"

// --- Formatting ---
const fmt = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

const fmtFull = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

const fmtPct = (n: number) => `${n.toFixed(2)}%`

// --- Number input helper ---
function NumberInput({
  value,
  onChange,
  placeholder,
  id,
  step = "0.01",
  min = 0,
}: {
  value: number
  onChange: (n: number) => void
  placeholder?: string
  id?: string
  step?: string
  min?: number
}) {
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <Input
      id={id}
      type="number"
      inputMode="decimal"
      step={step}
      min={min}
      placeholder={placeholder}
      value={draft ?? (Number.isFinite(value) ? String(value) : "")}
      onChange={(e) => {
        setDraft(e.target.value)
        const n = Number(e.target.value)
        onChange(Number.isFinite(n) ? n : 0)
      }}
      onBlur={() => setDraft(null)}
    />
  )
}

// --- Core math ---
interface MarginResult {
  grossProfit: number
  grossMargin: number
  operatingIncome: number
  operatingMargin: number
  netIncome: number
  netMargin: number
  markup: number // markup % on cost
}

function calcMargins(
  revenue: number,
  cogs: number,
  opex: number,
  taxes: number
): MarginResult {
  const r = Math.max(0, revenue)
  const c = Math.max(0, cogs)
  const o = Math.max(0, opex)
  const t = Math.max(0, taxes)

  const grossProfit = r - c
  const operatingIncome = grossProfit - o
  const netIncome = operatingIncome - t

  const grossMargin = r > 0 ? (grossProfit / r) * 100 : 0
  const operatingMargin = r > 0 ? (operatingIncome / r) * 100 : 0
  const netMargin = r > 0 ? (netIncome / r) * 100 : 0
  const markup = c > 0 ? (grossProfit / c) * 100 : 0

  return {
    grossProfit,
    grossMargin,
    operatingIncome,
    operatingMargin,
    netIncome,
    netMargin,
    markup,
  }
}

// Margin% -> Price given cost. Margin is expressed on price, so:
//   margin = (price - cost) / price
//   price = cost / (1 - margin)
function priceFromMargin(cost: number, marginPct: number) {
  const m = marginPct / 100
  if (m >= 1) return Number.POSITIVE_INFINITY
  if (m <= -Number.POSITIVE_INFINITY) return 0
  return cost / (1 - m)
}

// Markup% -> Margin% (and vice versa)
function markupToMargin(markupPct: number) {
  const mk = markupPct / 100
  return (mk / (1 + mk)) * 100
}

function marginToMarkup(marginPct: number) {
  const m = marginPct / 100
  if (m >= 1) return Number.POSITIVE_INFINITY
  return (m / (1 - m)) * 100
}

// --- Bulk parser ---
// Accepts tab, comma, or multiple-space separated rows: "name, cost, price"
// or "name\tcost\tprice". Lines without valid numbers are skipped.
interface BulkRow {
  name: string
  cost: number
  price: number
  profit: number
  margin: number
  markup: number
}

function parseBulkInput(text: string): BulkRow[] {
  if (!text.trim()) return []
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, idx) => {
      // Split on tab, comma, or multiple spaces
      const parts = line.split(/\t|,|\s{2,}/).map((p) => p.trim())
      let name = ""
      let costStr = ""
      let priceStr = ""
      if (parts.length >= 3) {
        name = parts.slice(0, parts.length - 2).join(" ")
        costStr = parts[parts.length - 2]
        priceStr = parts[parts.length - 1]
      } else if (parts.length === 2) {
        name = `Item ${idx + 1}`
        costStr = parts[0]
        priceStr = parts[1]
      } else {
        return null
      }
      const cost = Number(costStr.replace(/[$,]/g, ""))
      const price = Number(priceStr.replace(/[$,]/g, ""))
      if (!Number.isFinite(cost) || !Number.isFinite(price)) return null
      const profit = price - cost
      const margin = price > 0 ? (profit / price) * 100 : 0
      const markup = cost > 0 ? (profit / cost) * 100 : 0
      return { name: name || `Item ${idx + 1}`, cost, price, profit, margin, markup }
    })
    .filter((row): row is BulkRow => row !== null)
}

// ---------------- MAIN COMPONENT ----------------
export default function ProfitMarginCalculator() {
  const [mode, setMode] = useState<Mode>("calculate")

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-3 sm:w-[520px]">
          <TabsTrigger value="calculate">Calculate</TabsTrigger>
          <TabsTrigger value="reverse">Reverse (Find Price)</TabsTrigger>
          <TabsTrigger value="bulk">Bulk</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "calculate" && <CalculateMode />}
      {mode === "reverse" && <ReverseMode />}
      {mode === "bulk" && <BulkMode />}
    </div>
  )
}

// ---------------- CALCULATE MODE ----------------
function CalculateMode() {
  const [revenue, setRevenue] = useState(10000)
  const [cogs, setCogs] = useState(4500)
  const [opex, setOpex] = useState(2500)
  const [taxes, setTaxes] = useState(500)
  const [benchmarkIdx, setBenchmarkIdx] = useState<string>("Retail (non-food)")

  const result = useMemo(
    () => calcMargins(revenue, cogs, opex, taxes),
    [revenue, cogs, opex, taxes]
  )

  const benchmark = INDUSTRY_BENCHMARKS.find((b) => b.name === benchmarkIdx)

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Income &amp; Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="revenue">Total Revenue</Label>
              <NumberInput
                id="revenue"
                value={revenue}
                onChange={setRevenue}
                step="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cogs">Cost of Goods Sold (COGS)</Label>
              <NumberInput
                id="cogs"
                value={cogs}
                onChange={setCogs}
                step="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="opex">
                Operating Expenses
                <span className="ml-1 text-xs text-muted-foreground">
                  (rent, salaries, marketing)
                </span>
              </Label>
              <NumberInput
                id="opex"
                value={opex}
                onChange={setOpex}
                step="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="taxes">Taxes &amp; Interest</Label>
              <NumberInput
                id="taxes"
                value={taxes}
                onChange={setTaxes}
                step="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <MarginCard
          label="Gross Margin"
          value={fmtPct(result.grossMargin)}
          amount={fmt(result.grossProfit)}
          sub="Revenue minus COGS"
          tone={
            result.grossMargin >= 40
              ? "positive"
              : result.grossMargin >= 20
                ? "neutral"
                : "negative"
          }
          accent
        />
        <MarginCard
          label="Operating Margin"
          value={fmtPct(result.operatingMargin)}
          amount={fmt(result.operatingIncome)}
          sub="After operating expenses"
          tone={
            result.operatingMargin >= 15
              ? "positive"
              : result.operatingMargin >= 5
                ? "neutral"
                : "negative"
          }
        />
        <MarginCard
          label="Net Margin"
          value={fmtPct(result.netMargin)}
          amount={fmt(result.netIncome)}
          sub="After taxes and interest"
          tone={
            result.netMargin >= 10
              ? "positive"
              : result.netMargin >= 3
                ? "neutral"
                : "negative"
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profit &amp; Loss Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <Row label="Revenue" value={fmt(revenue)} bold />
            <Row label="Cost of Goods Sold" value={`-${fmt(cogs)}`} muted />
            <div className="my-1 border-t" />
            <Row
              label="Gross Profit"
              value={fmt(result.grossProfit)}
              bold
            />
            <Row
              label={`Gross Margin`}
              value={fmtPct(result.grossMargin)}
              muted
            />
            <div className="my-2 border-t" />
            <Row label="Operating Expenses" value={`-${fmt(opex)}`} muted />
            <Row
              label="Operating Income"
              value={fmt(result.operatingIncome)}
              bold
            />
            <Row
              label={`Operating Margin`}
              value={fmtPct(result.operatingMargin)}
              muted
            />
            <div className="my-2 border-t" />
            <Row label="Taxes &amp; Interest" value={`-${fmt(taxes)}`} muted />
            <Row
              label="Net Income"
              value={fmt(result.netIncome)}
              bold
            />
            <Row
              label={`Net Margin`}
              value={fmtPct(result.netMargin)}
              muted
            />
            <div className="my-2 border-t" />
            <Row
              label="Markup on cost"
              value={fmtPct(result.markup)}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry Benchmark</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="space-y-1.5">
              <Label>Compare to industry average</Label>
              <Select value={benchmarkIdx} onValueChange={setBenchmarkIdx}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {INDUSTRY_BENCHMARKS.map((b) => (
                    <SelectItem key={b.name} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {benchmark && (
              <div className="space-y-3 pt-2">
                <BenchmarkRow
                  label="Gross"
                  yours={result.grossMargin}
                  industry={benchmark.gross}
                />
                <BenchmarkRow
                  label="Operating"
                  yours={result.operatingMargin}
                  industry={benchmark.operating}
                />
                <BenchmarkRow
                  label="Net"
                  yours={result.netMargin}
                  industry={benchmark.net}
                />
              </div>
            )}
            <p className="pt-2 text-xs text-muted-foreground">
              Industry averages are approximate 2024 figures compiled from
              public financial data. Individual companies can vary widely
              from these averages.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Markup vs Margin explainer */}
      <Card>
        <CardHeader>
          <CardTitle>Markup vs Margin: Why the Difference Matters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Margin</strong> is profit as a
            percentage of <em>price</em>. A 50% margin on a $100 item means
            $50 of profit.
          </p>
          <p>
            <strong className="text-foreground">Markup</strong> is profit as a
            percentage of <em>cost</em>. A 50% markup on a $100 cost item
            means $50 added, selling for $150 (profit of $50 on a $150 price,
            which is a 33% margin).
          </p>
          <p>
            These are not the same number, and confusing them is one of the
            most common pricing mistakes. Quick reference:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[320px] text-xs">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="px-2 py-1 text-left">Markup</th>
                  <th className="px-2 py-1 text-right">Margin</th>
                  <th className="px-2 py-1 text-right">Example ($100 cost)</th>
                </tr>
              </thead>
              <tbody>
                {[25, 50, 75, 100, 150, 200].map((mk) => {
                  const price = 100 * (1 + mk / 100)
                  const margin = markupToMargin(mk)
                  return (
                    <tr key={mk} className="border-b last:border-0">
                      <td className="px-2 py-1 tabular-nums">{mk}%</td>
                      <td className="px-2 py-1 text-right tabular-nums">
                        {fmtPct(margin)}
                      </td>
                      <td className="px-2 py-1 text-right tabular-nums">
                        sells for {fmtFull(price)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// ---------------- REVERSE MODE ----------------
function ReverseMode() {
  const [cost, setCost] = useState(50)
  const [targetMargin, setTargetMargin] = useState(40)

  const price = useMemo(() => priceFromMargin(cost, targetMargin), [cost, targetMargin])
  const profit = price - cost
  const markup = useMemo(() => marginToMarkup(targetMargin), [targetMargin])
  const achievable = targetMargin < 100 && targetMargin >= 0

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Price Finder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cost">Unit Cost</Label>
              <NumberInput
                id="cost"
                value={cost}
                onChange={setCost}
                step="0.5"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="target">Target Margin %</Label>
              <NumberInput
                id="target"
                value={targetMargin}
                onChange={setTargetMargin}
                step="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {achievable ? (
        <div className="grid gap-4 sm:grid-cols-3">
          <MarginCard
            label="Selling Price"
            value={fmtFull(price)}
            sub={`Set this price to hit ${fmtPct(targetMargin)} margin`}
            accent
            tone="positive"
          />
          <MarginCard
            label="Profit per Unit"
            value={fmtFull(profit)}
            sub={`On ${fmtFull(cost)} cost`}
          />
          <MarginCard
            label="Equivalent Markup"
            value={fmtPct(markup)}
            sub="Profit as a % of cost"
          />
        </div>
      ) : (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Target margin must be between 0% and 99%. A 100% margin would
          require an infinite price.
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Common Margin Targets</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] text-xs">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="px-2 py-1 text-left">Target Margin</th>
                  <th className="px-2 py-1 text-right">Required Price</th>
                  <th className="px-2 py-1 text-right">Profit</th>
                  <th className="px-2 py-1 text-right">Markup</th>
                </tr>
              </thead>
              <tbody>
                {[10, 20, 30, 40, 50, 60, 70, 80].map((m) => {
                  const p = priceFromMargin(cost, m)
                  return (
                    <tr key={m} className="border-b last:border-0">
                      <td className="px-2 py-1 tabular-nums">{m}%</td>
                      <td className="px-2 py-1 text-right tabular-nums">
                        {fmtFull(p)}
                      </td>
                      <td className="px-2 py-1 text-right tabular-nums">
                        {fmtFull(p - cost)}
                      </td>
                      <td className="px-2 py-1 text-right tabular-nums text-muted-foreground">
                        {fmtPct(marginToMarkup(m))}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <p className="pt-2 text-xs text-muted-foreground">
            Based on your {fmtFull(cost)} unit cost. Adjust the cost field
            above and this table updates automatically.
          </p>
        </CardContent>
      </Card>
    </>
  )
}

// ---------------- BULK MODE ----------------
function BulkMode() {
  const [input, setInput] = useState(
    "Widget A, 12.50, 24.99\nWidget B, 8.00, 19.99\nPremium Widget, 22.00, 59.99"
  )

  const rows = useMemo(() => parseBulkInput(input), [input])

  const totals = useMemo(() => {
    const totalCost = rows.reduce((s, r) => s + r.cost, 0)
    const totalRevenue = rows.reduce((s, r) => s + r.price, 0)
    const totalProfit = totalRevenue - totalCost
    const avgMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0
    const avgMarkup = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0
    return { totalCost, totalRevenue, totalProfit, avgMargin, avgMarkup }
  }, [rows])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Bulk Product Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label htmlFor="bulk">
            Paste your products (one per line). Formats supported:
            <code className="ml-1 rounded bg-muted px-1 py-0.5 text-xs">
              Name, Cost, Price
            </code>{" "}
            or{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">
              Cost, Price
            </code>
            . Separators: comma, tab, or 2+ spaces.
          </Label>
          <Textarea
            id="bulk"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Widget A, 12.50, 24.99&#10;Widget B, 8.00, 19.99"
            className="font-mono text-xs"
          />
          <p className="text-xs text-muted-foreground">
            {rows.length} valid rows parsed
          </p>
        </CardContent>
      </Card>

      {rows.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MarginCard
              label="Total Revenue"
              value={fmt(totals.totalRevenue)}
              sub={`${rows.length} products`}
              accent
            />
            <MarginCard
              label="Total Cost"
              value={fmt(totals.totalCost)}
            />
            <MarginCard
              label="Total Profit"
              value={fmt(totals.totalProfit)}
              tone={totals.totalProfit >= 0 ? "positive" : "negative"}
            />
            <MarginCard
              label="Average Margin"
              value={fmtPct(totals.avgMargin)}
              sub={`${fmtPct(totals.avgMarkup)} average markup`}
              tone={
                totals.avgMargin >= 20
                  ? "positive"
                  : totals.avgMargin >= 10
                    ? "neutral"
                    : "negative"
              }
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Per-Product Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-xs">
                  <thead className="border-b bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Product</th>
                      <th className="px-3 py-2 text-right font-medium">
                        Cost
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Price
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Profit
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Margin
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        Markup
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-3 py-2 font-medium">{row.name}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {fmtFull(row.cost)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {fmtFull(row.price)}
                        </td>
                        <td
                          className={`whitespace-nowrap px-3 py-2 text-right tabular-nums ${
                            row.profit >= 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-destructive"
                          }`}
                        >
                          {fmtFull(row.profit)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {fmtPct(row.margin)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums text-muted-foreground">
                          {fmtPct(row.markup)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </>
  )
}

// --- Subcomponents ---
function MarginCard({
  label,
  value,
  amount,
  sub,
  tone = "neutral",
  accent,
}: {
  label: string
  value: string
  amount?: string
  sub?: string
  tone?: "positive" | "negative" | "neutral"
  accent?: boolean
}) {
  const toneClass =
    tone === "positive"
      ? "text-emerald-600 dark:text-emerald-400"
      : tone === "negative"
        ? "text-destructive"
        : ""
  return (
    <div
      className={`rounded-2xl border p-4 ${
        accent ? "bg-primary/10 ring-1 ring-primary/30" : "bg-card"
      }`}
    >
      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div
        className={`mt-1 font-heading text-2xl font-semibold tabular-nums ${toneClass}`}
      >
        {value}
      </div>
      {amount && (
        <div className="mt-0.5 text-xs font-medium tabular-nums">
          {amount}
        </div>
      )}
      {sub && (
        <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
      )}
    </div>
  )
}

function Row({
  label,
  value,
  bold,
  muted,
}: {
  label: string
  value: string
  bold?: boolean
  muted?: boolean
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        bold ? "font-semibold" : ""
      } ${muted ? "text-muted-foreground" : ""}`}
    >
      <span>{label}</span>
      <span className="whitespace-nowrap tabular-nums">{value}</span>
    </div>
  )
}

function BenchmarkRow({
  label,
  yours,
  industry,
}: {
  label: string
  yours: number
  industry: number
}) {
  const delta = yours - industry
  const maxWidth = Math.max(Math.abs(yours), Math.abs(industry), 10)
  const yoursW = Math.min(100, (Math.abs(yours) / maxWidth) * 100)
  const industryW = Math.min(100, (Math.abs(industry) / maxWidth) * 100)

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span
          className={`tabular-nums ${
            delta >= 0
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-destructive"
          }`}
        >
          {delta >= 0 ? "+" : ""}
          {fmtPct(delta)} vs industry
        </span>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="w-16 shrink-0 text-xs text-muted-foreground">
            You
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary"
              style={{ width: `${yoursW}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs tabular-nums">
            {fmtPct(yours)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-16 shrink-0 text-xs text-muted-foreground">
            Industry
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-muted-foreground/50"
              style={{ width: `${industryW}%` }}
            />
          </div>
          <span className="w-14 shrink-0 text-right text-xs tabular-nums">
            {fmtPct(industry)}
          </span>
        </div>
      </div>
    </div>
  )
}

