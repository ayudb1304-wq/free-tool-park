// The 20 "Most Visited Tools" ranked by Revenue Potential Score (RPS).
// These are the revenue engines of the site, placed at the top of the homepage.
// See MOST_VISITED_TOOLS_BUILD_SPEC.md for full details.

import {
  Home01Icon,
  Calculator01Icon,
  CalculatorIcon,
  Dollar01Icon,
  ReceiptDollarIcon,
  PercentIcon,
  BodyWeightIcon,
  Calendar01Icon,
  TimeZoneIcon,
  NaturalFoodIcon,
  WeightScaleIcon,
  LeftToRightListNumberIcon,
  School01Icon,
} from "@hugeicons/core-free-icons"

export interface MostVisitedTool {
  slug: string
  name: string
  description: string
  icon: typeof CalculatorIcon
  priority: "P0" | "P1" | "P2"
}

export const MOST_VISITED_TOOLS: MostVisitedTool[] = [
  // P0 — Build First
  {
    slug: "mortgage-calculator",
    name: "Mortgage Calculator",
    description: "Monthly payment with PMI, taxes, insurance & amortization",
    icon: Home01Icon,
    priority: "P0",
  },
  {
    slug: "refinance-calculator",
    name: "Refinance Calculator",
    description: "Break-even point, monthly savings & lifetime interest reduction",
    icon: Calculator01Icon,
    priority: "P0",
  },
  {
    slug: "auto-loan-calculator",
    name: "Auto Loan Calculator",
    description: "Car payment, interest, trade-in equity & total cost",
    icon: CalculatorIcon,
    priority: "P0",
  },
  {
    slug: "loan-calculator",
    name: "Loan Calculator",
    description: "Monthly payment for personal, student, business & more",
    icon: Dollar01Icon,
    priority: "P0",
  },
  {
    slug: "invoice-generator",
    name: "Invoice Generator",
    description: "Create & download professional invoices, no signup",
    icon: ReceiptDollarIcon,
    priority: "P0",
  },
  {
    slug: "income-tax-calculator",
    name: "Income Tax Calculator",
    description: "Federal & state tax estimator with deductions & credits",
    icon: Dollar01Icon,
    priority: "P0",
  },
  {
    slug: "compound-interest-calculator",
    name: "Compound Interest Calculator",
    description: "Investment growth with contributions & any compounding frequency",
    icon: CalculatorIcon,
    priority: "P0",
  },
  // P1 — Build Second
  {
    slug: "salary-to-hourly-calculator",
    name: "Salary to Hourly Calculator",
    description: "Convert annual pay to hourly wage with overtime & PTO",
    icon: Dollar01Icon,
    priority: "P1",
  },
  {
    slug: "investment-return-calculator",
    name: "Investment Return Calculator",
    description: "ROI, CAGR & total gain for stocks, bonds & real estate",
    icon: CalculatorIcon,
    priority: "P1",
  },
  {
    slug: "roi-calculator",
    name: "ROI Calculator",
    description: "Return on investment for marketing, real estate & projects",
    icon: PercentIcon,
    priority: "P1",
  },
  {
    slug: "profit-margin-calculator",
    name: "Profit Margin Calculator",
    description: "Gross, operating & net margin with markup conversion",
    icon: CalculatorIcon,
    priority: "P1",
  },
  {
    slug: "break-even-calculator",
    name: "Break-Even Calculator",
    description: "Units & revenue needed to cover fixed and variable costs",
    icon: LeftToRightListNumberIcon,
    priority: "P1",
  },
  {
    slug: "bmi-calculator",
    name: "BMI Calculator",
    description: "Body Mass Index with health ranges & recommendations",
    icon: BodyWeightIcon,
    priority: "P1",
  },
  {
    slug: "tdee-calculator",
    name: "TDEE / Calorie Calculator",
    description: "Total daily energy expenditure & calorie targets",
    icon: NaturalFoodIcon,
    priority: "P1",
  },
  // P2 — Build Third
  {
    slug: "macro-calculator",
    name: "Macro Calculator",
    description: "Protein, carbs & fat targets based on your goals",
    icon: NaturalFoodIcon,
    priority: "P2",
  },
  {
    slug: "body-fat-calculator",
    name: "Body Fat Calculator",
    description: "Body fat percentage with Navy method & health ranges",
    icon: WeightScaleIcon,
    priority: "P2",
  },
  {
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    description: "Find X% of Y, percentage change & more",
    icon: PercentIcon,
    priority: "P2",
  },
  {
    slug: "age-calculator",
    name: "Age Calculator",
    description: "Exact age in years, months, days & upcoming milestones",
    icon: Calendar01Icon,
    priority: "P2",
  },
  {
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    description: "Days, weeks & months between any two dates",
    icon: Calendar01Icon,
    priority: "P2",
  },
  {
    slug: "time-zone-converter",
    name: "Time Zone Converter",
    description: "Convert times across time zones worldwide",
    icon: TimeZoneIcon,
    priority: "P2",
  },
]
