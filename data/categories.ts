import {
  ArrowLeftRightIcon,
  CalculatorIcon,
  CodeIcon,
  MoneyBag01Icon,
  SeoIcon,
  SparklesIcon,
  TextFontIcon,
} from "@hugeicons/core-free-icons"

export const CATEGORY_SLUGS = [
  "finance",
  "calculators",
  "developer-tools",
  "text-tools",
  "converters",
  "seo-tools",
  "generators",
] as const

export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export interface CategoryFAQ {
  question: string
  answer: string
}

export interface Category {
  slug: CategorySlug
  name: string
  description: string
  longDescription: string
  icon: typeof CalculatorIcon
  faqs: CategoryFAQ[]
}

export const CATEGORIES: Category[] = [
  {
    slug: "finance",
    name: "Finance Calculators",
    description:
      "Free online mortgage, loan, retirement, 401(k), tax, and investment calculators.",
    longDescription:
      "FreeToolPark's finance calculators cover every major personal-finance question: mortgage payments, refinance break-even, loan and EMI, 401(k) projections, retirement planning, compound interest, investment returns, income tax, and small-business metrics like ROI, profit margin, and break-even. Every calculator runs entirely in your browser, so your salary, loan amount, and account balances never touch a server. Formulas match what banks, lenders, and financial planners use. See our methodology page for the exact math behind each tool.",
    icon: MoneyBag01Icon,
    faqs: [
      {
        question: "Are your finance calculators free to use?",
        answer:
          "Yes, every finance calculator on FreeToolPark is free with no signup, no subscription, and no usage limits. Your inputs stay in your browser and are never transmitted to our servers.",
      },
      {
        question: "How accurate are the financial results?",
        answer:
          "Calculators use the same amortization, compound-interest, and tax-bracket formulas banks and financial planners use. Results are accurate for planning and comparison. For decisions that affect taxes, retirement accounts, or large loans, confirm with a licensed professional.",
      },
      {
        question: "Do the calculators save my financial data?",
        answer:
          "No. All finance tools run client-side in JavaScript. Your salary, loan balance, and retirement numbers are not logged, stored, or transmitted. You can verify this by checking your browser's Network tab while using any calculator.",
      },
      {
        question: "Which finance calculator should I use for retirement planning?",
        answer:
          "Start with the Retirement Calculator for a full projection, or use the 401(k) Calculator if you just want to see your 401(k) balance at retirement. Pair either with the Compound Interest Calculator to understand how rate assumptions change outcomes.",
      },
    ],
  },
  {
    slug: "calculators",
    name: "Calculators",
    description:
      "Free online calculators for BMI, percentages, grades, calories, and everyday math.",
    longDescription:
      "Our free online calculators cover everyday math and health-related calculations: BMI and body fat, calorie and macro needs, percentage and tip math, age calculations, grades, and GPA. For mortgage, loan, and retirement math, see our dedicated Finance Calculators category. Every tool runs entirely in your browser with no signup and no usage limits.",
    icon: CalculatorIcon,
    faqs: [
      {
        question: "Are these calculators free to use?",
        answer:
          "Yes, all calculators on FreeToolPark are completely free with no signup, no subscription, and no usage limits. Every calculation runs in your browser.",
      },
      {
        question: "How accurate are the calculator results?",
        answer:
          "Our calculators use standard formulas used by health professionals, educators, and mathematicians. Results are accurate for informational and planning purposes.",
      },
      {
        question: "Do the calculators work on mobile?",
        answer:
          "Yes, all calculators are fully responsive and work on iPhone, Android, tablets, and desktop browsers without any app installation.",
      },
    ],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    description:
      "Free online developer tools for JSON, Base64, regex, hashing, and more.",
    longDescription:
      "FreeToolPark's developer tools help programmers format, encode, hash, validate, and convert data instantly in the browser. No installation, no API keys, no rate limits - just fast, reliable tools built for daily development workflows. All tools process data client-side so your code and data stay private.",
    icon: CodeIcon,
    faqs: [
      {
        question: "Do these dev tools send my data to a server?",
        answer:
          "No. Every tool on FreeToolPark runs entirely in your browser using JavaScript. No data is transmitted to any server. This makes them safe for sensitive code, API keys, and internal data.",
      },
      {
        question: "Which developer tools are most popular?",
        answer:
          "The JSON Formatter, Base64 Encoder/Decoder, Regex Tester, and UUID Generator are the most widely used. These cover the most common daily developer needs for API debugging and data processing.",
      },
      {
        question: "Can I use these tools offline?",
        answer:
          "Once the page loads, most tools will continue to work even if you lose internet connection, since all processing happens in your browser. Bookmark the tools you use most for quick access.",
      },
    ],
  },
  {
    slug: "text-tools",
    name: "Text Tools",
    description:
      "Free online text tools for word counting, case conversion, and more.",
    longDescription:
      "Our free text tools help writers, editors, students, and developers process and analyze text instantly. Word counters, case converters, duplicate removers, and readability checkers - all browser-based with no character limits and no account required.",
    icon: TextFontIcon,
    faqs: [
      {
        question: "Is there a character or word limit?",
        answer:
          "No, there are no limits on how much text you can process. All text tools handle documents of any length directly in your browser.",
      },
      {
        question: "Can I use these text tools for commercial work?",
        answer:
          "Yes, all FreeToolPark tools are free for personal and commercial use with no attribution required.",
      },
      {
        question: "Do text tools store my content?",
        answer:
          "No. Your text never leaves your browser. We do not store, log, or transmit any content you process using our tools.",
      },
    ],
  },
  {
    slug: "converters",
    name: "Converters",
    description:
      "Free online converters for units, numbers, and data formats.",
    longDescription:
      "Our free online converters handle unit conversions, number base conversions, data format transformations, and more. Get instant, accurate results for length, weight, temperature, data size, and dozens of other conversion types without any software.",
    icon: ArrowLeftRightIcon,
    faqs: [
      {
        question: "How precise are the unit conversion results?",
        answer:
          "Conversions use internationally standardized conversion factors and are accurate to multiple decimal places. Results are suitable for engineering, cooking, travel, and academic use.",
      },
      {
        question: "Which unit conversions are available?",
        answer:
          "We cover length (cm, inches, feet, meters), weight (kg, lbs, oz), temperature (Celsius, Fahrenheit, Kelvin), data size (bytes, KB, MB, GB), speed, and more. New converters are added regularly.",
      },
      {
        question: "Can I convert between multiple units at once?",
        answer:
          "Most converters show the result for one target unit at a time. Enter your value, select the source and target units, and get the result instantly.",
      },
    ],
  },
  {
    slug: "seo-tools",
    name: "SEO Tools",
    description:
      "Free online SEO tools for meta tags, sitemaps, and keyword analysis.",
    longDescription:
      "FreeToolPark's free SEO tools help marketers, bloggers, and developers optimize their websites without expensive subscriptions. Generate meta tags, robots.txt files, XML sitemaps, and analyze keyword density - all from your browser with instant results.",
    icon: SeoIcon,
    faqs: [
      {
        question: "Are these SEO tools suitable for professionals?",
        answer:
          "Yes. The tools generate production-ready outputs - meta tags, robots.txt, and sitemaps that you can copy and implement directly. They're used by freelancers, agencies, and in-house SEO teams.",
      },
      {
        question: "Do I need an account to use the SEO tools?",
        answer:
          "No account, no subscription, no API key required. All SEO tools are free and work instantly in your browser.",
      },
      {
        question:
          "How do I use the meta tag generator for my website?",
        answer:
          "Enter your page title, description, and URL into the meta tag generator, then copy the output HTML and paste it into the <head> section of your webpage. The tool supports Open Graph tags for social sharing too.",
      },
    ],
  },
  {
    slug: "generators",
    name: "Generators",
    description:
      "Free online generators for passwords, QR codes, UUIDs, and more.",
    longDescription:
      "Our free generator tools create passwords, UUIDs, QR codes, placeholder text, and more on demand. Every output is generated locally in your browser, so passwords and sensitive data are never transmitted anywhere.",
    icon: SparklesIcon,
    faqs: [
      {
        question: "Are generated passwords and UUIDs truly random?",
        answer:
          "Yes. Passwords use the browser's built-in cryptographically secure random number generator (window.crypto.getRandomValues), which is the same standard used by security-focused applications.",
      },
      {
        question: "Can I generate multiple items at once?",
        answer:
          "Most generators let you set a quantity and generate multiple results in one click. Results can be copied individually or all at once.",
      },
      {
        question:
          "Is it safe to generate passwords in a browser tool?",
        answer:
          "Yes, because generation happens entirely client-side. No password is ever sent to a server. The tool has no network requests during generation. You can even disconnect from the internet and it will still work.",
      },
    ],
  },
]

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
