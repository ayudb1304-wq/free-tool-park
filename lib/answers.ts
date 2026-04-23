import {
  convert,
  convertTemperature,
  type ConversionPair,
} from "@/data/conversions"
import type { Answer } from "@/data/answers"
import { getAnswerConversionPair } from "@/data/answers"

/**
 * Compute the numeric "1 fromUnit = ? toUnit" for an Answer using the
 * conversion logic from data/conversions.ts. The Answer's question is
 * interpreted as "How many fromUnit in 1 toUnit" so we convert in
 * the reverse direction (1 of the "to" unit expressed in "from" unit
 * terms).
 */
export function computeAnswerValue(answer: Answer, baseAmount = 1): number {
  const pair = getAnswerConversionPair(answer)
  if (!pair) return 0
  // "How many sqft in an acre?" - pair is acre-to-sqft (from=acre, to=sqft).
  // We want: 1 acre (the "from") -> sqft (the "to"). convert already does this.
  if (pair.category.isTemperature) {
    return convertTemperature(baseAmount, pair.from.key, pair.to.key)
  }
  return convert(baseAmount, pair.from, pair.to)
}

/**
 * Build the quick-reference table rows for an Answer.
 * Each row is { fromValue, toValue } where fromValue is in the
 * question's subject unit (the "to" unit logically, but renderable as
 * the "amount of X" column the reader cares about).
 *
 * For "How many MB in a GB?" the table should read:
 *   GB | MB
 *   0.5 | 512
 *   1   | 1024
 *   ...
 */
export interface AnswerTableRow {
  fromValue: number
  toValue: number
}

export function buildAnswerTable(answer: Answer): AnswerTableRow[] {
  const pair = getAnswerConversionPair(answer)
  if (!pair) return []
  const defaults = defaultTableValues(pair)
  const base = answer.referenceTableBaseValues ?? defaults
  return base.map((v) => ({
    fromValue: v,
    toValue: computeFor(pair, v),
  }))
}

function computeFor(pair: ConversionPair, value: number): number {
  if (pair.category.isTemperature) {
    return convertTemperature(value, pair.from.key, pair.to.key)
  }
  return convert(value, pair.from, pair.to)
}

function defaultTableValues(pair: ConversionPair): number[] {
  // Category-aware sensible defaults. Keep 7-9 rows.
  switch (pair.category.slug) {
    case "length":
      return [0.5, 1, 2, 5, 10, 25, 50, 100]
    case "weight":
      return [0.5, 1, 2, 5, 10, 25, 50, 100]
    case "temperature":
      return [0, 10, 20, 30, 40, 50, 75, 100]
    case "volume":
      return [0.25, 0.5, 1, 2, 4, 8, 16]
    case "area":
      return [0.1, 0.25, 0.5, 1, 2, 5, 10, 25]
    case "speed":
      return [10, 20, 30, 50, 60, 80, 100, 120]
    case "data":
      return [0.5, 1, 2, 4, 8, 16, 32, 64]
    case "time":
      return [0.5, 1, 2, 5, 10, 30, 60, 120]
    default:
      return [1, 2, 5, 10, 25]
  }
}

/**
 * Format a number for display in the answer table, with sensible
 * rounding based on magnitude.
 */
export function formatAnswerNumber(value: number): string {
  if (!isFinite(value)) return "-"
  if (value === 0) return "0"
  const abs = Math.abs(value)
  if (abs >= 1_000_000_000) return value.toLocaleString("en-US")
  if (abs >= 1000) return value.toLocaleString("en-US", { maximumFractionDigits: 0 })
  if (abs >= 100) return value.toLocaleString("en-US", { maximumFractionDigits: 1 })
  if (abs >= 1) return value.toLocaleString("en-US", { maximumFractionDigits: 3 })
  if (abs >= 0.01) return value.toLocaleString("en-US", { maximumFractionDigits: 4 })
  return value.toLocaleString("en-US", { maximumFractionDigits: 6 })
}
