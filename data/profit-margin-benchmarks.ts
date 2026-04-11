// Approximate industry average margins for 2024. These are rough averages
// compiled from public financial data and are intended for rough benchmarking
// only. Actual margins vary widely by company, region, and year.

export interface IndustryBenchmark {
  name: string
  gross: number // gross margin %
  operating: number // operating margin %
  net: number // net margin %
}

export const INDUSTRY_BENCHMARKS: IndustryBenchmark[] = [
  { name: "Software / SaaS", gross: 80, operating: 20, net: 15 },
  { name: "Real Estate", gross: 85, operating: 25, net: 18 },
  { name: "Banking", gross: 85, operating: 30, net: 22 },
  { name: "Insurance", gross: 60, operating: 15, net: 10 },
  { name: "Consulting / Professional Services", gross: 70, operating: 15, net: 11 },
  { name: "Hotels / Hospitality", gross: 70, operating: 12, net: 7 },
  { name: "Restaurants", gross: 65, operating: 8, net: 5 },
  { name: "Apparel", gross: 55, operating: 12, net: 7 },
  { name: "Healthcare", gross: 45, operating: 10, net: 6 },
  { name: "Retail (non-food)", gross: 42, operating: 7, net: 4 },
  { name: "E-commerce", gross: 40, operating: 8, net: 5 },
  { name: "Manufacturing", gross: 32, operating: 9, net: 6 },
  { name: "Automotive", gross: 18, operating: 6, net: 4 },
  { name: "Grocery", gross: 28, operating: 3, net: 1.5 },
  { name: "Construction", gross: 20, operating: 7, net: 5 },
  { name: "Transportation / Logistics", gross: 25, operating: 8, net: 5 },
  { name: "Energy / Utilities", gross: 35, operating: 12, net: 8 },
  { name: "Food Delivery", gross: 25, operating: 3, net: 2 },
  { name: "Media / Publishing", gross: 45, operating: 10, net: 6 },
  { name: "Advertising / Marketing", gross: 50, operating: 12, net: 8 },
]
