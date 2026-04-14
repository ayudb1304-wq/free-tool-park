// Programmatic converter page data.
// Every pair here generates its own /tools/convert/[pair] page.

export interface ConversionUnit {
  key: string
  name: string
  /** Symbol or abbreviation shown in UI */
  abbr: string
  /** Factor to convert TO the category's base unit. For temperature, use special handling. */
  toBase: number
}

export interface ConversionCategory {
  slug: string
  name: string
  baseUnit: string
  units: ConversionUnit[]
  /** If true, uses custom temperature conversion logic instead of simple multiplication */
  isTemperature?: boolean
}

export interface ConversionPair {
  from: ConversionUnit
  to: ConversionUnit
  category: ConversionCategory
  slug: string
}

export const CONVERSION_CATEGORIES: ConversionCategory[] = [
  {
    slug: "length",
    name: "Length",
    baseUnit: "meters",
    units: [
      { key: "mm", name: "Millimeters", abbr: "mm", toBase: 0.001 },
      { key: "cm", name: "Centimeters", abbr: "cm", toBase: 0.01 },
      { key: "m", name: "Meters", abbr: "m", toBase: 1 },
      { key: "km", name: "Kilometers", abbr: "km", toBase: 1000 },
      { key: "in", name: "Inches", abbr: "in", toBase: 0.0254 },
      { key: "ft", name: "Feet", abbr: "ft", toBase: 0.3048 },
      { key: "yd", name: "Yards", abbr: "yd", toBase: 0.9144 },
      { key: "mi", name: "Miles", abbr: "mi", toBase: 1609.344 },
    ],
  },
  {
    slug: "weight",
    name: "Weight",
    baseUnit: "kilograms",
    units: [
      { key: "mg", name: "Milligrams", abbr: "mg", toBase: 0.000001 },
      { key: "g", name: "Grams", abbr: "g", toBase: 0.001 },
      { key: "kg", name: "Kilograms", abbr: "kg", toBase: 1 },
      { key: "oz", name: "Ounces", abbr: "oz", toBase: 0.0283495 },
      { key: "lb", name: "Pounds", abbr: "lb", toBase: 0.453592 },
      { key: "st", name: "Stones", abbr: "st", toBase: 6.35029 },
      { key: "t", name: "Metric Tons", abbr: "t", toBase: 1000 },
    ],
  },
  {
    slug: "temperature",
    name: "Temperature",
    baseUnit: "celsius",
    isTemperature: true,
    units: [
      { key: "c", name: "Celsius", abbr: "C", toBase: 1 },
      { key: "f", name: "Fahrenheit", abbr: "F", toBase: 1 },
      { key: "k", name: "Kelvin", abbr: "K", toBase: 1 },
    ],
  },
  {
    slug: "volume",
    name: "Volume",
    baseUnit: "liters",
    units: [
      { key: "ml", name: "Milliliters", abbr: "mL", toBase: 0.001 },
      { key: "l", name: "Liters", abbr: "L", toBase: 1 },
      { key: "gal", name: "Gallons (US)", abbr: "gal", toBase: 3.78541 },
      { key: "qt", name: "Quarts (US)", abbr: "qt", toBase: 0.946353 },
      { key: "pt", name: "Pints (US)", abbr: "pt", toBase: 0.473176 },
      { key: "cup", name: "Cups (US)", abbr: "cup", toBase: 0.236588 },
      { key: "floz", name: "Fluid Ounces (US)", abbr: "fl oz", toBase: 0.0295735 },
      { key: "tbsp", name: "Tablespoons", abbr: "tbsp", toBase: 0.0147868 },
      { key: "tsp", name: "Teaspoons", abbr: "tsp", toBase: 0.00492892 },
    ],
  },
  {
    slug: "area",
    name: "Area",
    baseUnit: "square meters",
    units: [
      { key: "sqm", name: "Square Meters", abbr: "m\u00B2", toBase: 1 },
      { key: "sqkm", name: "Square Kilometers", abbr: "km\u00B2", toBase: 1_000_000 },
      { key: "sqft", name: "Square Feet", abbr: "ft\u00B2", toBase: 0.092903 },
      { key: "sqyd", name: "Square Yards", abbr: "yd\u00B2", toBase: 0.836127 },
      { key: "sqmi", name: "Square Miles", abbr: "mi\u00B2", toBase: 2_589_988 },
      { key: "acre", name: "Acres", abbr: "ac", toBase: 4046.86 },
      { key: "ha", name: "Hectares", abbr: "ha", toBase: 10000 },
    ],
  },
  {
    slug: "speed",
    name: "Speed",
    baseUnit: "meters per second",
    units: [
      { key: "ms", name: "Meters per Second", abbr: "m/s", toBase: 1 },
      { key: "kmh", name: "Kilometers per Hour", abbr: "km/h", toBase: 0.277778 },
      { key: "mph", name: "Miles per Hour", abbr: "mph", toBase: 0.44704 },
      { key: "kn", name: "Knots", abbr: "kn", toBase: 0.514444 },
      { key: "fts", name: "Feet per Second", abbr: "ft/s", toBase: 0.3048 },
    ],
  },
  {
    slug: "data",
    name: "Digital Storage",
    baseUnit: "bytes",
    units: [
      { key: "b", name: "Bytes", abbr: "B", toBase: 1 },
      { key: "kb", name: "Kilobytes", abbr: "KB", toBase: 1024 },
      { key: "mb", name: "Megabytes", abbr: "MB", toBase: 1_048_576 },
      { key: "gb", name: "Gigabytes", abbr: "GB", toBase: 1_073_741_824 },
      { key: "tb", name: "Terabytes", abbr: "TB", toBase: 1_099_511_627_776 },
      { key: "pb", name: "Petabytes", abbr: "PB", toBase: 1_125_899_906_842_624 },
    ],
  },
  {
    slug: "time",
    name: "Time",
    baseUnit: "seconds",
    units: [
      { key: "ms", name: "Milliseconds", abbr: "ms", toBase: 0.001 },
      { key: "s", name: "Seconds", abbr: "s", toBase: 1 },
      { key: "min", name: "Minutes", abbr: "min", toBase: 60 },
      { key: "hr", name: "Hours", abbr: "hr", toBase: 3600 },
      { key: "day", name: "Days", abbr: "days", toBase: 86400 },
      { key: "wk", name: "Weeks", abbr: "wk", toBase: 604800 },
      { key: "mo", name: "Months (avg)", abbr: "mo", toBase: 2_629_746 },
      { key: "yr", name: "Years (avg)", abbr: "yr", toBase: 31_556_952 },
    ],
  },
]

// Temperature conversion functions (special case, not multiplicative)
export function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value
  // Convert to Celsius first
  let celsius: number
  switch (from) {
    case "c": celsius = value; break
    case "f": celsius = (value - 32) * 5 / 9; break
    case "k": celsius = value - 273.15; break
    default: return value
  }
  // Convert from Celsius to target
  switch (to) {
    case "c": return celsius
    case "f": return celsius * 9 / 5 + 32
    case "k": return celsius + 273.15
    default: return value
  }
}

// Standard conversion for all non-temperature units
export function convert(value: number, from: ConversionUnit, to: ConversionUnit): number {
  return (value * from.toBase) / to.toBase
}

// Generate all bidirectional pairs for a category (excluding same-unit pairs)
function generatePairsForCategory(category: ConversionCategory): ConversionPair[] {
  const pairs: ConversionPair[] = []
  for (const from of category.units) {
    for (const to of category.units) {
      if (from.key === to.key) continue
      pairs.push({
        from,
        to,
        category,
        slug: `${from.key}-to-${to.key}`,
      })
    }
  }
  return pairs
}

// All conversion pairs across all categories
export const ALL_CONVERSION_PAIRS: ConversionPair[] =
  CONVERSION_CATEGORIES.flatMap(generatePairsForCategory)

// Lookup a pair by slug
export function getConversionPair(slug: string): ConversionPair | undefined {
  return ALL_CONVERSION_PAIRS.find((p) => p.slug === slug)
}

// Generate a common values reference table for a pair
export function getCommonValues(
  pair: ConversionPair,
): { from: string; to: string }[] {
  const { from, to, category } = pair

  // Pick sensible "common" input values based on category
  const commonInputs = getCommonInputs(from, category)

  return commonInputs.map((val) => {
    let result: number
    if (category.isTemperature) {
      result = convertTemperature(val, from.key, to.key)
    } else {
      result = convert(val, from, to)
    }
    return {
      from: formatValue(val, from),
      to: formatValue(result, to),
    }
  })
}

function getCommonInputs(from: ConversionUnit, category: ConversionCategory): number[] {
  if (category.isTemperature) {
    if (from.key === "c") return [-40, -20, 0, 10, 20, 25, 30, 37, 50, 100]
    if (from.key === "f") return [-40, 0, 32, 50, 68, 72, 77, 98.6, 100, 212]
    if (from.key === "k") return [0, 77, 233, 273.15, 293.15, 298.15, 310.15, 373.15]
  }
  // For multiplicative conversions, pick round numbers that make sense for the unit
  const base = from.toBase
  if (base >= 1000) return [0.1, 0.25, 0.5, 1, 2, 5, 10, 25, 50, 100]
  if (base >= 1) return [1, 5, 10, 25, 50, 100, 250, 500, 1000]
  if (base >= 0.01) return [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000]
  return [1, 10, 100, 500, 1000, 5000, 10000, 50000, 100000]
}

function formatValue(n: number, unit: ConversionUnit): string {
  let formatted: string
  if (Math.abs(n) >= 0.01 && Math.abs(n) < 1e9) {
    formatted = n.toLocaleString("en-US", { maximumFractionDigits: 6 })
  } else if (n === 0) {
    formatted = "0"
  } else {
    formatted = n.toExponential(4)
  }
  return `${formatted} ${unit.abbr}`
}

// SEO helpers
export function getPairTitle(pair: ConversionPair): string {
  return `${pair.from.name} to ${pair.to.name} Converter`
}

export function getPairH1(pair: ConversionPair): string {
  return `Convert ${pair.from.name} to ${pair.to.name} (${pair.from.abbr} to ${pair.to.abbr})`
}

export function getPairDescription(pair: ConversionPair): string {
  return `Free ${pair.from.name.toLowerCase()} to ${pair.to.name.toLowerCase()} converter. Instantly convert ${pair.from.abbr} to ${pair.to.abbr} with a reference table of common values. No signup, runs in your browser.`
}

export function getPairKeywords(pair: ConversionPair): string[] {
  const f = pair.from.name.toLowerCase()
  const t = pair.to.name.toLowerCase()
  const fa = pair.from.abbr.toLowerCase()
  const ta = pair.to.abbr.toLowerCase()
  return [
    `${f} to ${t}`,
    `${fa} to ${ta}`,
    `convert ${f} to ${t}`,
    `${f} to ${t} converter`,
    `${f} to ${t} conversion`,
    `how many ${t} in a ${f.replace(/s$/, "")}`,
    `${fa} to ${ta} formula`,
  ]
}

// Get the reverse pair slug
export function getReversePairSlug(pair: ConversionPair): string {
  return `${pair.to.key}-to-${pair.from.key}`
}

// Get related conversion pairs (same category, different pairs)
export function getRelatedPairs(pair: ConversionPair, limit = 6): ConversionPair[] {
  return ALL_CONVERSION_PAIRS
    .filter(
      (p) =>
        p.category.slug === pair.category.slug &&
        p.slug !== pair.slug &&
        p.slug !== getReversePairSlug(pair)
    )
    .slice(0, limit)
}

// Get formula description for a pair
export function getFormulaText(pair: ConversionPair): {
  expression: string
  explanation: string
} {
  const { from, to, category } = pair

  if (category.isTemperature) {
    if (from.key === "c" && to.key === "f")
      return { expression: "F = (C x 9/5) + 32", explanation: "Multiply the Celsius value by 9/5 (or 1.8), then add 32." }
    if (from.key === "f" && to.key === "c")
      return { expression: "C = (F - 32) x 5/9", explanation: "Subtract 32 from the Fahrenheit value, then multiply by 5/9 (or divide by 1.8)." }
    if (from.key === "c" && to.key === "k")
      return { expression: "K = C + 273.15", explanation: "Add 273.15 to the Celsius value." }
    if (from.key === "k" && to.key === "c")
      return { expression: "C = K - 273.15", explanation: "Subtract 273.15 from the Kelvin value." }
    if (from.key === "f" && to.key === "k")
      return { expression: "K = (F - 32) x 5/9 + 273.15", explanation: "Subtract 32, multiply by 5/9, then add 273.15." }
    if (from.key === "k" && to.key === "f")
      return { expression: "F = (K - 273.15) x 9/5 + 32", explanation: "Subtract 273.15, multiply by 9/5, then add 32." }
  }

  const factor = from.toBase / to.toBase
  const factorStr = factor >= 0.001 && factor < 1e9
    ? factor.toLocaleString("en-US", { maximumFractionDigits: 10 })
    : factor.toExponential(6)

  return {
    expression: `${to.abbr} = ${from.abbr} x ${factorStr}`,
    explanation: `Multiply the ${from.name.toLowerCase()} value by ${factorStr} to get ${to.name.toLowerCase()}.`,
  }
}
