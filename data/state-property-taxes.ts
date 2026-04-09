// Average effective property tax rates by US state (% of home value per year)
// Source: Tax Foundation, US Census Bureau (2024 data)

export interface StateInfo {
  name: string
  abbr: string
  propertyTaxRate: number // effective rate as percentage
}

export const US_STATES: StateInfo[] = [
  { name: "Alabama", abbr: "AL", propertyTaxRate: 0.41 },
  { name: "Alaska", abbr: "AK", propertyTaxRate: 1.19 },
  { name: "Arizona", abbr: "AZ", propertyTaxRate: 0.62 },
  { name: "Arkansas", abbr: "AR", propertyTaxRate: 0.62 },
  { name: "California", abbr: "CA", propertyTaxRate: 0.74 },
  { name: "Colorado", abbr: "CO", propertyTaxRate: 0.51 },
  { name: "Connecticut", abbr: "CT", propertyTaxRate: 2.14 },
  { name: "Delaware", abbr: "DE", propertyTaxRate: 0.57 },
  { name: "Florida", abbr: "FL", propertyTaxRate: 0.89 },
  { name: "Georgia", abbr: "GA", propertyTaxRate: 0.92 },
  { name: "Hawaii", abbr: "HI", propertyTaxRate: 0.28 },
  { name: "Idaho", abbr: "ID", propertyTaxRate: 0.69 },
  { name: "Illinois", abbr: "IL", propertyTaxRate: 2.27 },
  { name: "Indiana", abbr: "IN", propertyTaxRate: 0.85 },
  { name: "Iowa", abbr: "IA", propertyTaxRate: 1.57 },
  { name: "Kansas", abbr: "KS", propertyTaxRate: 1.41 },
  { name: "Kentucky", abbr: "KY", propertyTaxRate: 0.86 },
  { name: "Louisiana", abbr: "LA", propertyTaxRate: 0.55 },
  { name: "Maine", abbr: "ME", propertyTaxRate: 1.36 },
  { name: "Maryland", abbr: "MD", propertyTaxRate: 1.09 },
  { name: "Massachusetts", abbr: "MA", propertyTaxRate: 1.23 },
  { name: "Michigan", abbr: "MI", propertyTaxRate: 1.54 },
  { name: "Minnesota", abbr: "MN", propertyTaxRate: 1.12 },
  { name: "Mississippi", abbr: "MS", propertyTaxRate: 0.81 },
  { name: "Missouri", abbr: "MO", propertyTaxRate: 0.97 },
  { name: "Montana", abbr: "MT", propertyTaxRate: 0.84 },
  { name: "Nebraska", abbr: "NE", propertyTaxRate: 1.73 },
  { name: "Nevada", abbr: "NV", propertyTaxRate: 0.60 },
  { name: "New Hampshire", abbr: "NH", propertyTaxRate: 2.18 },
  { name: "New Jersey", abbr: "NJ", propertyTaxRate: 2.49 },
  { name: "New Mexico", abbr: "NM", propertyTaxRate: 0.80 },
  { name: "New York", abbr: "NY", propertyTaxRate: 1.72 },
  { name: "North Carolina", abbr: "NC", propertyTaxRate: 0.84 },
  { name: "North Dakota", abbr: "ND", propertyTaxRate: 0.98 },
  { name: "Ohio", abbr: "OH", propertyTaxRate: 1.56 },
  { name: "Oklahoma", abbr: "OK", propertyTaxRate: 0.90 },
  { name: "Oregon", abbr: "OR", propertyTaxRate: 0.97 },
  { name: "Pennsylvania", abbr: "PA", propertyTaxRate: 1.58 },
  { name: "Rhode Island", abbr: "RI", propertyTaxRate: 1.63 },
  { name: "South Carolina", abbr: "SC", propertyTaxRate: 0.57 },
  { name: "South Dakota", abbr: "SD", propertyTaxRate: 1.31 },
  { name: "Tennessee", abbr: "TN", propertyTaxRate: 0.71 },
  { name: "Texas", abbr: "TX", propertyTaxRate: 1.80 },
  { name: "Utah", abbr: "UT", propertyTaxRate: 0.63 },
  { name: "Vermont", abbr: "VT", propertyTaxRate: 1.90 },
  { name: "Virginia", abbr: "VA", propertyTaxRate: 0.82 },
  { name: "Washington", abbr: "WA", propertyTaxRate: 0.98 },
  { name: "West Virginia", abbr: "WV", propertyTaxRate: 0.58 },
  { name: "Wisconsin", abbr: "WI", propertyTaxRate: 1.85 },
  { name: "Wyoming", abbr: "WY", propertyTaxRate: 0.61 },
]

export const DEFAULT_STATE = "CA"

export function getStateByAbbr(abbr: string): StateInfo | undefined {
  return US_STATES.find((s) => s.abbr === abbr)
}
