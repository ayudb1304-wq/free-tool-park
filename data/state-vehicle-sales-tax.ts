// Average vehicle sales tax rates by US state (combined state + average local)
// Sources: Tax Foundation, Avalara, DMV.org (2024). These are statewide averages
// Actual rates can vary by county and municipality. Users can override.

export interface StateVehicleTax {
  name: string
  abbr: string
  salesTaxRate: number // combined avg state + local on vehicle purchases (%)
}

export const VEHICLE_TAX_STATES: StateVehicleTax[] = [
  { name: "Alabama", abbr: "AL", salesTaxRate: 3.43 },
  { name: "Alaska", abbr: "AK", salesTaxRate: 1.76 },
  { name: "Arizona", abbr: "AZ", salesTaxRate: 8.4 },
  { name: "Arkansas", abbr: "AR", salesTaxRate: 9.46 },
  { name: "California", abbr: "CA", salesTaxRate: 8.85 },
  { name: "Colorado", abbr: "CO", salesTaxRate: 7.78 },
  { name: "Connecticut", abbr: "CT", salesTaxRate: 6.35 },
  { name: "Delaware", abbr: "DE", salesTaxRate: 4.25 }, // document fee, no sales tax
  { name: "District of Columbia", abbr: "DC", salesTaxRate: 6.0 },
  { name: "Florida", abbr: "FL", salesTaxRate: 7.02 },
  { name: "Georgia", abbr: "GA", salesTaxRate: 7.0 }, // TAVT
  { name: "Hawaii", abbr: "HI", salesTaxRate: 4.44 },
  { name: "Idaho", abbr: "ID", salesTaxRate: 6.03 },
  { name: "Illinois", abbr: "IL", salesTaxRate: 8.85 },
  { name: "Indiana", abbr: "IN", salesTaxRate: 7.0 },
  { name: "Iowa", abbr: "IA", salesTaxRate: 5.0 },
  { name: "Kansas", abbr: "KS", salesTaxRate: 8.75 },
  { name: "Kentucky", abbr: "KY", salesTaxRate: 6.0 },
  { name: "Louisiana", abbr: "LA", salesTaxRate: 9.56 },
  { name: "Maine", abbr: "ME", salesTaxRate: 5.5 },
  { name: "Maryland", abbr: "MD", salesTaxRate: 6.0 },
  { name: "Massachusetts", abbr: "MA", salesTaxRate: 6.25 },
  { name: "Michigan", abbr: "MI", salesTaxRate: 6.0 },
  { name: "Minnesota", abbr: "MN", salesTaxRate: 7.89 },
  { name: "Mississippi", abbr: "MS", salesTaxRate: 5.0 },
  { name: "Missouri", abbr: "MO", salesTaxRate: 8.39 },
  { name: "Montana", abbr: "MT", salesTaxRate: 0.0 }, // no sales tax
  { name: "Nebraska", abbr: "NE", salesTaxRate: 6.97 },
  { name: "Nevada", abbr: "NV", salesTaxRate: 8.24 },
  { name: "New Hampshire", abbr: "NH", salesTaxRate: 0.0 }, // no sales tax
  { name: "New Jersey", abbr: "NJ", salesTaxRate: 6.63 },
  { name: "New Mexico", abbr: "NM", salesTaxRate: 4.0 }, // motor vehicle excise
  { name: "New York", abbr: "NY", salesTaxRate: 8.53 },
  { name: "North Carolina", abbr: "NC", salesTaxRate: 3.0 }, // highway use tax
  { name: "North Dakota", abbr: "ND", salesTaxRate: 5.0 },
  { name: "Ohio", abbr: "OH", salesTaxRate: 7.24 },
  { name: "Oklahoma", abbr: "OK", salesTaxRate: 4.5 }, // excise tax
  { name: "Oregon", abbr: "OR", salesTaxRate: 0.5 }, // privilege tax, no sales tax
  { name: "Pennsylvania", abbr: "PA", salesTaxRate: 6.34 },
  { name: "Rhode Island", abbr: "RI", salesTaxRate: 7.0 },
  { name: "South Carolina", abbr: "SC", salesTaxRate: 5.0 }, // capped at $500
  { name: "South Dakota", abbr: "SD", salesTaxRate: 4.0 }, // excise tax
  { name: "Tennessee", abbr: "TN", salesTaxRate: 9.55 },
  { name: "Texas", abbr: "TX", salesTaxRate: 6.25 },
  { name: "Utah", abbr: "UT", salesTaxRate: 7.19 },
  { name: "Vermont", abbr: "VT", salesTaxRate: 6.36 },
  { name: "Virginia", abbr: "VA", salesTaxRate: 4.15 }, // motor vehicle sales & use
  { name: "Washington", abbr: "WA", salesTaxRate: 8.86 },
  { name: "West Virginia", abbr: "WV", salesTaxRate: 6.55 },
  { name: "Wisconsin", abbr: "WI", salesTaxRate: 5.43 },
  { name: "Wyoming", abbr: "WY", salesTaxRate: 5.22 },
]

export const DEFAULT_VEHICLE_TAX_STATE = "CA"

export function getVehicleTaxStateByAbbr(
  abbr: string
): StateVehicleTax | undefined {
  return VEHICLE_TAX_STATES.find((s) => s.abbr === abbr)
}
