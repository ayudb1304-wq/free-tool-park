// US federal income tax brackets, FICA rates, and state effective income tax
// rates for the 2025 tax year.
//
// Federal bracket + standard deduction values are from IRS Rev. Proc. 2024-40
// (2025 tax year). FICA wage base is the SSA 2025 value. State effective
// rates are approximate single-filer effective rates at median income used by
// most free tax estimators; bracket states are represented by a single
// effective rate for simplicity. Results are estimates and should not be
// relied on for tax filing decisions.

export type FilingStatus = "single" | "mfj" | "mfs" | "hoh" | "qw"

export const FILING_STATUSES: { value: FilingStatus; label: string }[] = [
  { value: "single", label: "Single" },
  { value: "mfj", label: "Married Filing Jointly" },
  { value: "mfs", label: "Married Filing Separately" },
  { value: "hoh", label: "Head of Household" },
  { value: "qw", label: "Qualifying Widow(er)" },
]

export interface TaxBracket {
  rate: number // e.g. 0.10 for 10%
  upTo: number | null // upper bound of the bracket (null = infinity)
}

// 2025 federal income tax brackets
export const FEDERAL_BRACKETS_2025: Record<FilingStatus, TaxBracket[]> = {
  single: [
    { rate: 0.1, upTo: 11925 },
    { rate: 0.12, upTo: 48475 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250525 },
    { rate: 0.35, upTo: 626350 },
    { rate: 0.37, upTo: null },
  ],
  mfj: [
    { rate: 0.1, upTo: 23850 },
    { rate: 0.12, upTo: 96950 },
    { rate: 0.22, upTo: 206700 },
    { rate: 0.24, upTo: 394600 },
    { rate: 0.32, upTo: 501050 },
    { rate: 0.35, upTo: 751600 },
    { rate: 0.37, upTo: null },
  ],
  mfs: [
    { rate: 0.1, upTo: 11925 },
    { rate: 0.12, upTo: 48475 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250525 },
    { rate: 0.35, upTo: 375800 },
    { rate: 0.37, upTo: null },
  ],
  hoh: [
    { rate: 0.1, upTo: 17000 },
    { rate: 0.12, upTo: 64850 },
    { rate: 0.22, upTo: 103350 },
    { rate: 0.24, upTo: 197300 },
    { rate: 0.32, upTo: 250500 },
    { rate: 0.35, upTo: 626350 },
    { rate: 0.37, upTo: null },
  ],
  // Qualifying Widow(er) uses the same brackets as MFJ per IRS rules.
  qw: [
    { rate: 0.1, upTo: 23850 },
    { rate: 0.12, upTo: 96950 },
    { rate: 0.22, upTo: 206700 },
    { rate: 0.24, upTo: 394600 },
    { rate: 0.32, upTo: 501050 },
    { rate: 0.35, upTo: 751600 },
    { rate: 0.37, upTo: null },
  ],
}

// 2025 standard deductions
export const STANDARD_DEDUCTION_2025: Record<FilingStatus, number> = {
  single: 15000,
  mfj: 30000,
  mfs: 15000,
  hoh: 22500,
  qw: 30000,
}

// FICA rates (Social Security + Medicare) for 2025
export const SS_RATE = 0.062
export const SS_WAGE_BASE_2025 = 176100
export const MEDICARE_RATE = 0.0145
// Additional Medicare tax (0.9%) applies above these Medicare wage thresholds
export const ADDL_MEDICARE_RATE = 0.009
export const ADDL_MEDICARE_THRESHOLDS: Record<FilingStatus, number> = {
  single: 200000,
  mfj: 250000,
  mfs: 125000,
  hoh: 200000,
  qw: 250000,
}

// Self-employment tax rate on 92.35% of net SE earnings
export const SE_TAX_RATE_SS = 0.124
export const SE_TAX_RATE_MEDICARE = 0.029

export interface StateTaxInfo {
  abbr: string
  name: string
  // Approximate effective state income tax rate for a single filer at median
  // income. Bracket states are flattened to a representative rate. 0 means
  // the state has no income tax on wages.
  effectiveRate: number
  note?: string
}

export const STATE_INCOME_TAX_RATES: StateTaxInfo[] = [
  { abbr: "AL", name: "Alabama", effectiveRate: 4.5 },
  { abbr: "AK", name: "Alaska", effectiveRate: 0, note: "No state income tax" },
  { abbr: "AZ", name: "Arizona", effectiveRate: 2.5, note: "Flat 2.5%" },
  { abbr: "AR", name: "Arkansas", effectiveRate: 4.4 },
  { abbr: "CA", name: "California", effectiveRate: 6.0 },
  { abbr: "CO", name: "Colorado", effectiveRate: 4.4, note: "Flat 4.4%" },
  { abbr: "CT", name: "Connecticut", effectiveRate: 5.0 },
  { abbr: "DE", name: "Delaware", effectiveRate: 5.2 },
  { abbr: "DC", name: "District of Columbia", effectiveRate: 6.5 },
  { abbr: "FL", name: "Florida", effectiveRate: 0, note: "No state income tax" },
  { abbr: "GA", name: "Georgia", effectiveRate: 5.39, note: "Flat 5.39%" },
  { abbr: "HI", name: "Hawaii", effectiveRate: 6.4 },
  { abbr: "ID", name: "Idaho", effectiveRate: 5.8, note: "Flat 5.8%" },
  { abbr: "IL", name: "Illinois", effectiveRate: 4.95, note: "Flat 4.95%" },
  { abbr: "IN", name: "Indiana", effectiveRate: 3.0, note: "Flat 3.0%" },
  { abbr: "IA", name: "Iowa", effectiveRate: 3.8, note: "Flat 3.8%" },
  { abbr: "KS", name: "Kansas", effectiveRate: 5.2 },
  { abbr: "KY", name: "Kentucky", effectiveRate: 4.0, note: "Flat 4.0%" },
  { abbr: "LA", name: "Louisiana", effectiveRate: 4.25 },
  { abbr: "ME", name: "Maine", effectiveRate: 5.8 },
  { abbr: "MD", name: "Maryland", effectiveRate: 4.75 },
  { abbr: "MA", name: "Massachusetts", effectiveRate: 5.0, note: "Flat 5.0%" },
  { abbr: "MI", name: "Michigan", effectiveRate: 4.25, note: "Flat 4.25%" },
  { abbr: "MN", name: "Minnesota", effectiveRate: 6.8 },
  { abbr: "MS", name: "Mississippi", effectiveRate: 4.4, note: "Flat 4.4%" },
  { abbr: "MO", name: "Missouri", effectiveRate: 4.8 },
  { abbr: "MT", name: "Montana", effectiveRate: 5.5 },
  { abbr: "NE", name: "Nebraska", effectiveRate: 5.2 },
  { abbr: "NV", name: "Nevada", effectiveRate: 0, note: "No state income tax" },
  {
    abbr: "NH",
    name: "New Hampshire",
    effectiveRate: 0,
    note: "No tax on wages",
  },
  { abbr: "NJ", name: "New Jersey", effectiveRate: 5.5 },
  { abbr: "NM", name: "New Mexico", effectiveRate: 4.9 },
  { abbr: "NY", name: "New York", effectiveRate: 6.5 },
  { abbr: "NC", name: "North Carolina", effectiveRate: 4.5, note: "Flat 4.5%" },
  { abbr: "ND", name: "North Dakota", effectiveRate: 1.95 },
  { abbr: "OH", name: "Ohio", effectiveRate: 3.5 },
  { abbr: "OK", name: "Oklahoma", effectiveRate: 4.75 },
  { abbr: "OR", name: "Oregon", effectiveRate: 8.75 },
  { abbr: "PA", name: "Pennsylvania", effectiveRate: 3.07, note: "Flat 3.07%" },
  { abbr: "RI", name: "Rhode Island", effectiveRate: 5.0 },
  { abbr: "SC", name: "South Carolina", effectiveRate: 6.2 },
  { abbr: "SD", name: "South Dakota", effectiveRate: 0, note: "No state income tax" },
  { abbr: "TN", name: "Tennessee", effectiveRate: 0, note: "No tax on wages" },
  { abbr: "TX", name: "Texas", effectiveRate: 0, note: "No state income tax" },
  { abbr: "UT", name: "Utah", effectiveRate: 4.65, note: "Flat 4.65%" },
  { abbr: "VT", name: "Vermont", effectiveRate: 6.6 },
  { abbr: "VA", name: "Virginia", effectiveRate: 5.3 },
  { abbr: "WA", name: "Washington", effectiveRate: 0, note: "No tax on wages" },
  { abbr: "WV", name: "West Virginia", effectiveRate: 4.82 },
  { abbr: "WI", name: "Wisconsin", effectiveRate: 5.3 },
  { abbr: "WY", name: "Wyoming", effectiveRate: 0, note: "No state income tax" },
]

export const DEFAULT_STATE = "CA"

export function getStateRate(abbr: string): StateTaxInfo {
  return (
    STATE_INCOME_TAX_RATES.find((s) => s.abbr === abbr) ??
    STATE_INCOME_TAX_RATES[0]
  )
}
