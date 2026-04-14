"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { HugeiconsIcon } from "@hugeicons/react"
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons"

type Mode = "single" | "multi" | "sensitivity"

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

const fmtNum = (n: number) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

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
interface BreakEvenResult {
  breakEvenUnits: number
  breakEvenRevenue: number
  contributionMargin: number
  contributionMarginRatio: number
  profitAtTarget: number
  marginOfSafetyUnits: number
  marginOfSafetyPct: number
  marginOfSafetyRevenue: number
}

function calcBreakEven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number,
  currentSalesUnits: number
): BreakEvenResult {
  const fc = Math.max(0, fixedCosts)
  const p = Math.max(0, pricePerUnit)
  const vc = Math.max(0, variableCostPerUnit)
  const sales = Math.max(0, currentSalesUnits)

  const contributionMargin = p - vc
  const contributionMarginRatio = p > 0 ? contributionMargin / p : 0

  const breakEvenUnits =
    contributionMargin > 0 ? fc / contributionMargin : Infinity
  const breakEvenRevenue =
    contributionMarginRatio > 0 ? fc / contributionMarginRatio : Infinity

  const profitAtTarget = sales * contributionMargin - fc

  const marginOfSafetyUnits = Number.isFinite(breakEvenUnits)
    ? sales - breakEvenUnits
    : 0
  const marginOfSafetyPct =
    sales > 0 && Number.isFinite(breakEvenUnits)
      ? (marginOfSafetyUnits / sales) * 100
      : 0
  const marginOfSafetyRevenue = marginOfSafetyUnits * p

  return {
    breakEvenUnits,
    breakEvenRevenue,
    contributionMargin,
    contributionMarginRatio,
    profitAtTarget,
    marginOfSafetyUnits,
    marginOfSafetyPct,
    marginOfSafetyRevenue,
  }
}

// --- Multi-product types ---
interface Product {
  id: number
  name: string
  price: number
  variableCost: number
  salesMix: number // percentage of total unit sales
}

let nextId = 1

function createProduct(overrides?: Partial<Product>): Product {
  return {
    id: nextId++,
    name: overrides?.name ?? "",
    price: overrides?.price ?? 0,
    variableCost: overrides?.variableCost ?? 0,
    salesMix: overrides?.salesMix ?? 100,
    ...overrides,
  }
}

// ---------------- MAIN COMPONENT ----------------
export default function BreakEvenCalculator() {
  const [mode, setMode] = useState<Mode>("single")

  return (
    <div className="space-y-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList className="grid w-full grid-cols-3 sm:w-[520px]">
          <TabsTrigger value="single">Single Product</TabsTrigger>
          <TabsTrigger value="multi">Multi-Product</TabsTrigger>
          <TabsTrigger value="sensitivity">Sensitivity</TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "single" && <SingleMode />}
      {mode === "multi" && <MultiMode />}
      {mode === "sensitivity" && <SensitivityMode />}

      <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Estimates only.</strong> This
        calculator provides approximate break-even analysis for educational
        purposes. It does not account for taxes, financing, seasonality, or
        volume-dependent cost changes. Not financial or accounting advice.
      </div>
    </div>
  )
}

// ---------------- SINGLE PRODUCT MODE ----------------
function SingleMode() {
  const [fixedCosts, setFixedCosts] = useState(10000)
  const [pricePerUnit, setPricePerUnit] = useState(50)
  const [variableCostPerUnit, setVariableCostPerUnit] = useState(20)
  const [currentSalesUnits, setCurrentSalesUnits] = useState(500)

  const result = useMemo(
    () =>
      calcBreakEven(fixedCosts, pricePerUnit, variableCostPerUnit, currentSalesUnits),
    [fixedCosts, pricePerUnit, variableCostPerUnit, currentSalesUnits]
  )

  const isValid =
    Number.isFinite(result.breakEvenUnits) && result.contributionMargin > 0

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fixedCosts">
                Fixed Costs
                <span className="ml-1 text-xs text-muted-foreground">
                  (rent, salaries, insurance)
                </span>
              </Label>
              <NumberInput
                id="fixedCosts"
                value={fixedCosts}
                onChange={setFixedCosts}
                step="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pricePerUnit">Price per Unit</Label>
              <NumberInput
                id="pricePerUnit"
                value={pricePerUnit}
                onChange={setPricePerUnit}
                step="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="variableCost">Variable Cost per Unit</Label>
              <NumberInput
                id="variableCost"
                value={variableCostPerUnit}
                onChange={setVariableCostPerUnit}
                step="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currentSales">
                Current / Expected Sales
                <span className="ml-1 text-xs text-muted-foreground">
                  (units)
                </span>
              </Label>
              <NumberInput
                id="currentSales"
                value={currentSalesUnits}
                onChange={setCurrentSalesUnits}
                step="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {!isValid && result.contributionMargin <= 0 && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Price per unit must be greater than variable cost per unit to reach a
          break-even point. Your current contribution margin is{" "}
          {fmtFull(result.contributionMargin)}.
        </div>
      )}

      {isValid && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <SummaryCard
              label="Break-Even Units"
              value={fmtNum(Math.ceil(result.breakEvenUnits))}
              sub="Units you need to sell"
              accent
              tone="neutral"
            />
            <SummaryCard
              label="Break-Even Revenue"
              value={fmt(result.breakEvenRevenue)}
              sub="Revenue needed to cover all costs"
              accent
              tone="neutral"
            />
            <SummaryCard
              label="Contribution Margin"
              value={fmtFull(result.contributionMargin)}
              sub={`${fmtPct(result.contributionMarginRatio * 100)} of price`}
              tone="positive"
            />
            <SummaryCard
              label="Profit at Current Sales"
              value={fmt(result.profitAtTarget)}
              sub={`At ${fmtNum(currentSalesUnits)} units`}
              tone={result.profitAtTarget >= 0 ? "positive" : "negative"}
            />
          </div>

          {/* Margin of Safety */}
          <Card>
            <CardHeader>
              <CardTitle>Margin of Safety</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="text-muted-foreground">
                How far your current sales are above the break-even point. A
                higher margin of safety means more cushion before you start
                losing money.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-0.5">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Units above break-even
                  </div>
                  <div
                    className={`font-heading text-xl font-semibold tabular-nums ${
                      result.marginOfSafetyUnits >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-destructive"
                    }`}
                  >
                    {fmtNum(Math.round(result.marginOfSafetyUnits))}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Safety margin
                  </div>
                  <div
                    className={`font-heading text-xl font-semibold tabular-nums ${
                      result.marginOfSafetyPct >= 20
                        ? "text-emerald-600 dark:text-emerald-400"
                        : result.marginOfSafetyPct >= 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-destructive"
                    }`}
                  >
                    {fmtPct(result.marginOfSafetyPct)}
                  </div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Revenue cushion
                  </div>
                  <div
                    className={`font-heading text-xl font-semibold tabular-nums ${
                      result.marginOfSafetyRevenue >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-destructive"
                    }`}
                  >
                    {fmt(result.marginOfSafetyRevenue)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Break-Even Chart (CSS-based) */}
          <BreakEvenChart
            fixedCosts={fixedCosts}
            pricePerUnit={pricePerUnit}
            variableCostPerUnit={variableCostPerUnit}
            breakEvenUnits={result.breakEvenUnits}
          />

          {/* P&L at various sales levels */}
          <Card>
            <CardHeader>
              <CardTitle>Profit at Different Sales Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] text-left text-xs">
                  <thead className="border-b bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Units Sold</th>
                      <th className="px-3 py-2 text-right font-medium">Revenue</th>
                      <th className="px-3 py-2 text-right font-medium">Total Costs</th>
                      <th className="px-3 py-2 text-right font-medium">Profit / Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildSalesLevels(result.breakEvenUnits, currentSalesUnits).map(
                      (units) => {
                        const revenue = units * pricePerUnit
                        const totalCosts = fixedCosts + units * variableCostPerUnit
                        const profit = revenue - totalCosts
                        const isBE = Math.abs(units - result.breakEvenUnits) < 1
                        return (
                          <tr
                            key={units}
                            className={`border-b last:border-0 ${
                              isBE ? "bg-primary/5 font-semibold" : ""
                            }`}
                          >
                            <td className="px-3 py-2 tabular-nums">
                              {fmtNum(units)}
                              {isBE && (
                                <span className="ml-1.5 text-[10px] font-medium uppercase text-primary">
                                  Break-even
                                </span>
                              )}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                              {fmt(revenue)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                              {fmt(totalCosts)}
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 py-2 text-right tabular-nums ${
                                profit >= 0
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-destructive"
                              }`}
                            >
                              {fmt(profit)}
                            </td>
                          </tr>
                        )
                      }
                    )}
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

// Generate interesting sales levels around break-even
function buildSalesLevels(beUnits: number, currentUnits: number): number[] {
  const be = Math.ceil(beUnits)
  const levels = new Set<number>()
  // Fractions of break-even
  levels.add(Math.round(be * 0.25))
  levels.add(Math.round(be * 0.5))
  levels.add(Math.round(be * 0.75))
  levels.add(be)
  levels.add(Math.round(be * 1.25))
  levels.add(Math.round(be * 1.5))
  levels.add(Math.round(be * 2))
  if (currentUnits > 0) levels.add(currentUnits)
  // Remove 0 or negatives
  const arr = Array.from(levels)
    .filter((n) => n > 0)
    .sort((a, b) => a - b)
  return arr
}

// ---------------- MULTI-PRODUCT MODE ----------------
function MultiMode() {
  const [fixedCosts, setFixedCosts] = useState(25000)
  const [products, setProducts] = useState<Product[]>([
    createProduct({ name: "Product A", price: 80, variableCost: 30, salesMix: 60 }),
    createProduct({ name: "Product B", price: 45, variableCost: 20, salesMix: 40 }),
  ])

  const addProduct = () =>
    setProducts((prev) => [...prev, createProduct({ name: `Product ${String.fromCharCode(65 + prev.length)}`, salesMix: 0 })])

  const removeProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id))

  const updateProduct = (id: number, field: keyof Product, value: string | number) =>
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    )

  const totalMix = products.reduce((s, p) => s + p.salesMix, 0)

  const analysis = useMemo(() => {
    if (totalMix === 0) return null

    // Weighted average contribution margin
    const weightedCM = products.reduce((s, p) => {
      const weight = p.salesMix / totalMix
      return s + (p.price - p.variableCost) * weight
    }, 0)

    // Weighted average price
    const weightedPrice = products.reduce((s, p) => {
      const weight = p.salesMix / totalMix
      return s + p.price * weight
    }, 0)

    const cmRatio = weightedPrice > 0 ? weightedCM / weightedPrice : 0
    const totalBEUnits = weightedCM > 0 ? fixedCosts / weightedCM : Infinity
    const totalBERevenue = cmRatio > 0 ? fixedCosts / cmRatio : Infinity

    const perProduct = products.map((p) => {
      const weight = p.salesMix / totalMix
      const beUnits = Number.isFinite(totalBEUnits) ? totalBEUnits * weight : Infinity
      const cm = p.price - p.variableCost
      const cmr = p.price > 0 ? (cm / p.price) * 100 : 0
      return {
        ...p,
        contributionMargin: cm,
        contributionMarginRatio: cmr,
        breakEvenUnits: beUnits,
        breakEvenRevenue: beUnits * p.price,
      }
    })

    return {
      weightedCM,
      weightedPrice,
      cmRatio,
      totalBEUnits,
      totalBERevenue,
      perProduct,
    }
  }, [products, fixedCosts, totalMix])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Fixed Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-xs space-y-1.5">
            <Label htmlFor="multiFixed">Total Fixed Costs</Label>
            <NumberInput
              id="multiFixed"
              value={fixedCosts}
              onChange={setFixedCosts}
              step="100"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Products / SKUs</CardTitle>
          <Button variant="outline" size="sm" onClick={addProduct}>
            <HugeiconsIcon icon={Add01Icon} className="mr-1 h-4 w-4" />
            Add
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((p) => (
              <div
                key={p.id}
                className="grid gap-3 rounded-lg border p-3 sm:grid-cols-5"
              >
                <div className="space-y-1 sm:col-span-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={p.name}
                    onChange={(e) => updateProduct(p.id, "name", e.target.value)}
                    placeholder="Product name"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Price</Label>
                  <NumberInput
                    value={p.price}
                    onChange={(v) => updateProduct(p.id, "price", v)}
                    step="1"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Variable Cost</Label>
                  <NumberInput
                    value={p.variableCost}
                    onChange={(v) => updateProduct(p.id, "variableCost", v)}
                    step="1"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Sales Mix %</Label>
                  <NumberInput
                    value={p.salesMix}
                    onChange={(v) => updateProduct(p.id, "salesMix", v)}
                    step="5"
                  />
                </div>
                <div className="flex items-end">
                  {products.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeProduct(p.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <HugeiconsIcon icon={Delete02Icon} className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {totalMix !== 100 && totalMix > 0 && (
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
              Sales mix totals {fmtPct(totalMix)}. For accurate results, mix
              should total 100%.
            </p>
          )}
        </CardContent>
      </Card>

      {analysis && Number.isFinite(analysis.totalBEUnits) && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <SummaryCard
              label="Total Break-Even Units"
              value={fmtNum(Math.ceil(analysis.totalBEUnits))}
              sub="Combined units across all products"
              accent
            />
            <SummaryCard
              label="Break-Even Revenue"
              value={fmt(analysis.totalBERevenue)}
              sub="Combined revenue target"
              accent
            />
            <SummaryCard
              label="Weighted Avg CM"
              value={fmtFull(analysis.weightedCM)}
              sub={`${fmtPct(analysis.cmRatio * 100)} CM ratio`}
              tone="positive"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Per-Product Break-Even</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px] text-left text-xs">
                  <thead className="border-b bg-muted/40 text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 font-medium">Product</th>
                      <th className="px-3 py-2 text-right font-medium">Price</th>
                      <th className="px-3 py-2 text-right font-medium">Var. Cost</th>
                      <th className="px-3 py-2 text-right font-medium">CM</th>
                      <th className="px-3 py-2 text-right font-medium">CM Ratio</th>
                      <th className="px-3 py-2 text-right font-medium">Mix</th>
                      <th className="px-3 py-2 text-right font-medium">BE Units</th>
                      <th className="px-3 py-2 text-right font-medium">BE Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysis.perProduct.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="px-3 py-2 font-medium">{p.name || "-"}</td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {fmtFull(p.price)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {fmtFull(p.variableCost)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {fmtFull(p.contributionMargin)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {fmtPct(p.contributionMarginRatio)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {fmtPct(p.salesMix)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums font-semibold">
                          {Number.isFinite(p.breakEvenUnits)
                            ? fmtNum(Math.ceil(p.breakEvenUnits))
                            : "-"}
                        </td>
                        <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                          {Number.isFinite(p.breakEvenRevenue)
                            ? fmt(p.breakEvenRevenue)
                            : "-"}
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

      {analysis && !Number.isFinite(analysis.totalBEUnits) && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          Break-even cannot be reached. Check that each product&apos;s price exceeds
          its variable cost and that sales mix percentages are greater than zero.
        </div>
      )}
    </>
  )
}

// ---------------- SENSITIVITY MODE ----------------
function SensitivityMode() {
  const [fixedCosts, setFixedCosts] = useState(10000)
  const [basePrice, setBasePrice] = useState(50)
  const [baseVC, setBaseVC] = useState(20)

  // Range for sensitivity: +/- 30%
  const [priceAdj, setPriceAdj] = useState(0)
  const [vcAdj, setVcAdj] = useState(0)
  const [fcAdj, setFcAdj] = useState(0)

  const adjustedPrice = basePrice * (1 + priceAdj / 100)
  const adjustedVC = baseVC * (1 + vcAdj / 100)
  const adjustedFC = fixedCosts * (1 + fcAdj / 100)

  const baseResult = useMemo(
    () => calcBreakEven(fixedCosts, basePrice, baseVC, 0),
    [fixedCosts, basePrice, baseVC]
  )
  const adjustedResult = useMemo(
    () => calcBreakEven(adjustedFC, adjustedPrice, adjustedVC, 0),
    [adjustedFC, adjustedPrice, adjustedVC]
  )

  const baseBE = Number.isFinite(baseResult.breakEvenUnits)
    ? baseResult.breakEvenUnits
    : 0
  const adjBE = Number.isFinite(adjustedResult.breakEvenUnits)
    ? adjustedResult.breakEvenUnits
    : 0
  const beDelta = baseBE > 0 ? ((adjBE - baseBE) / baseBE) * 100 : 0

  // Build sensitivity table: vary price from -20% to +20%
  const sensitivityRows = useMemo(() => {
    const rows: { label: string; beUnits: number; beRevenue: number; cm: number }[] = []
    for (let pctChange = -20; pctChange <= 20; pctChange += 5) {
      const p = basePrice * (1 + pctChange / 100)
      const cm = p - baseVC
      const be = cm > 0 ? fixedCosts / cm : Infinity
      const beRev = cm > 0 ? fixedCosts / (cm / p) : Infinity
      rows.push({
        label: `${pctChange >= 0 ? "+" : ""}${pctChange}%`,
        beUnits: be,
        beRevenue: beRev,
        cm,
      })
    }
    return rows
  }, [basePrice, baseVC, fixedCosts])

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Base Values</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="sensFC">Fixed Costs</Label>
              <NumberInput
                id="sensFC"
                value={fixedCosts}
                onChange={setFixedCosts}
                step="100"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sensPrice">Price per Unit</Label>
              <NumberInput
                id="sensPrice"
                value={basePrice}
                onChange={setBasePrice}
                step="1"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sensVC">Variable Cost per Unit</Label>
              <NumberInput
                id="sensVC"
                value={baseVC}
                onChange={setBaseVC}
                step="1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adjust Variables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <SliderRow
            label="Price Change"
            value={priceAdj}
            onChange={setPriceAdj}
            displayValue={`${priceAdj >= 0 ? "+" : ""}${priceAdj}% (${fmtFull(adjustedPrice)})`}
          />
          <SliderRow
            label="Variable Cost Change"
            value={vcAdj}
            onChange={setVcAdj}
            displayValue={`${vcAdj >= 0 ? "+" : ""}${vcAdj}% (${fmtFull(adjustedVC)})`}
          />
          <SliderRow
            label="Fixed Cost Change"
            value={fcAdj}
            onChange={setFcAdj}
            displayValue={`${fcAdj >= 0 ? "+" : ""}${fcAdj}% (${fmt(adjustedFC)})`}
          />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Base Break-Even"
          value={
            Number.isFinite(baseBE) ? `${fmtNum(Math.ceil(baseBE))} units` : "N/A"
          }
          sub={
            Number.isFinite(baseResult.breakEvenRevenue)
              ? fmt(baseResult.breakEvenRevenue)
              : ""
          }
        />
        <SummaryCard
          label="Adjusted Break-Even"
          value={
            Number.isFinite(adjBE) ? `${fmtNum(Math.ceil(adjBE))} units` : "N/A"
          }
          sub={
            Number.isFinite(adjustedResult.breakEvenRevenue)
              ? fmt(adjustedResult.breakEvenRevenue)
              : ""
          }
          accent
          tone={adjBE <= baseBE ? "positive" : "negative"}
        />
        <SummaryCard
          label="Change"
          value={`${beDelta >= 0 ? "+" : ""}${fmtPct(beDelta)}`}
          sub={`${beDelta <= 0 ? "Fewer" : "More"} units needed`}
          tone={beDelta <= 0 ? "positive" : "negative"}
        />
        <SummaryCard
          label="Adjusted CM"
          value={fmtFull(adjustedResult.contributionMargin)}
          sub={`${fmtPct(adjustedResult.contributionMarginRatio * 100)} of price`}
          tone={adjustedResult.contributionMargin > 0 ? "positive" : "negative"}
        />
      </div>

      {/* Price sensitivity table */}
      <Card>
        <CardHeader>
          <CardTitle>Price Sensitivity Table</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-xs text-muted-foreground">
            Shows how changing your price by -20% to +20% affects the break-even
            point, holding variable and fixed costs constant.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-xs">
              <thead className="border-b bg-muted/40 text-muted-foreground">
                <tr>
                  <th className="px-3 py-2 font-medium">Price Change</th>
                  <th className="px-3 py-2 text-right font-medium">New Price</th>
                  <th className="px-3 py-2 text-right font-medium">CM / Unit</th>
                  <th className="px-3 py-2 text-right font-medium">BE Units</th>
                  <th className="px-3 py-2 text-right font-medium">BE Revenue</th>
                </tr>
              </thead>
              <tbody>
                {sensitivityRows.map((row) => {
                  const isBase = row.label === "+0%"
                  const newPrice = basePrice * (1 + parseInt(row.label) / 100)
                  return (
                    <tr
                      key={row.label}
                      className={`border-b last:border-0 ${
                        isBase ? "bg-primary/5 font-semibold" : ""
                      }`}
                    >
                      <td className="px-3 py-2 tabular-nums">
                        {row.label}
                        {isBase && (
                          <span className="ml-1.5 text-[10px] font-medium uppercase text-primary">
                            Current
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                        {fmtFull(newPrice)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                        {fmtFull(row.cm)}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                        {Number.isFinite(row.beUnits)
                          ? fmtNum(Math.ceil(row.beUnits))
                          : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2 text-right tabular-nums">
                        {Number.isFinite(row.beRevenue)
                          ? fmt(row.beRevenue)
                          : "N/A"}
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

// --- Slider row for sensitivity ---
function SliderRow({
  label,
  value,
  onChange,
  displayValue,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  displayValue: string
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <Label>{label}</Label>
        <span className="text-xs tabular-nums text-muted-foreground">
          {displayValue}
        </span>
      </div>
      <input
        type="range"
        min={-30}
        max={30}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-[10px] text-muted-foreground">
        <span>-30%</span>
        <span>0%</span>
        <span>+30%</span>
      </div>
    </div>
  )
}

// --- Break-Even Chart (CSS-based) ---
function BreakEvenChart({
  fixedCosts,
  pricePerUnit,
  variableCostPerUnit,
  breakEvenUnits,
}: {
  fixedCosts: number
  pricePerUnit: number
  variableCostPerUnit: number
  breakEvenUnits: number
}) {
  const maxUnits = Math.ceil(breakEvenUnits * 2)
  const maxRevenue = maxUnits * pricePerUnit
  const maxCost = fixedCosts + maxUnits * variableCostPerUnit
  const yMax = Math.max(maxRevenue, maxCost) * 1.1

  // Generate 6 data points from 0 to maxUnits
  const points = 6
  const data = Array.from({ length: points + 1 }, (_, i) => {
    const units = Math.round((maxUnits / points) * i)
    const revenue = units * pricePerUnit
    const totalCost = fixedCosts + units * variableCostPerUnit
    return { units, revenue, totalCost }
  })

  const toX = (units: number) => (units / maxUnits) * 100
  const toY = (val: number) => 100 - (val / yMax) * 100

  // SVG polyline points
  const revenueLine = data.map((d) => `${toX(d.units)},${toY(d.revenue)}`).join(" ")
  const totalCostLine = data.map((d) => `${toX(d.units)},${toY(d.totalCost)}`).join(" ")
  const fixedCostY = toY(fixedCosts)

  const beX = toX(breakEvenUnits)
  const beY = toY(breakEvenUnits * pricePerUnit)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Break-Even Chart</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-[2/1] w-full">
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="h-full w-full"
          >
            {/* Fixed cost line */}
            <line
              x1="0"
              y1={fixedCostY}
              x2="100"
              y2={fixedCostY}
              stroke="currentColor"
              strokeWidth="0.3"
              strokeDasharray="1.5,1"
              className="text-muted-foreground/50"
            />
            {/* Total cost line */}
            <polyline
              points={totalCostLine}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-destructive"
            />
            {/* Revenue line */}
            <polyline
              points={revenueLine}
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-emerald-500"
            />
            {/* Break-even intersection */}
            <circle
              cx={beX}
              cy={beY}
              r="1.5"
              fill="currentColor"
              className="text-primary"
            />
          </svg>

          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 flex h-full flex-col justify-between text-[10px] text-muted-foreground">
            <span>{fmt(yMax)}</span>
            <span>{fmt(yMax / 2)}</span>
            <span>$0</span>
          </div>

          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 flex w-full translate-y-4 justify-between text-[10px] text-muted-foreground">
            <span>0</span>
            <span>{fmtNum(maxUnits / 2)}</span>
            <span>{fmtNum(maxUnits)}</span>
          </div>

          {/* Break-even marker label */}
          <div
            className="absolute text-[10px] font-medium text-primary"
            style={{
              left: `${beX}%`,
              top: `${beY}%`,
              transform: "translate(-50%, -140%)",
            }}
          >
            BE: {fmtNum(Math.ceil(breakEvenUnits))} units
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded bg-emerald-500" />
            <span>Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded bg-destructive" />
            <span>Total Costs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-4 rounded border border-dashed border-muted-foreground/50" />
            <span>Fixed Costs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span>Break-Even Point</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// --- Subcomponents ---
function SummaryCard({
  label,
  value,
  sub,
  tone = "neutral",
  accent,
}: {
  label: string
  value: string
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
      {sub && (
        <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
      )}
    </div>
  )
}
