import {
  ArrowLeftRightIcon,
  CalculatorIcon,
  CodeIcon,
  SeoIcon,
  SparklesIcon,
  TextFontIcon,
} from "@hugeicons/core-free-icons"

export const CATEGORY_SLUGS = [
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
    slug: "calculators",
    name: "Calculators",
    description:
      "Free online calculators for mortgage, BMI, percentage, and more.",
    longDescription:
      "Our free online calculators help you solve financial, health, and math problems instantly without installing any software. From mortgage payments and loan EMIs to BMI and percentage calculations, every calculator runs entirely in your browser for maximum privacy. Bookmark this page to access all calculators in one place.",
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
          "Our calculators use standard financial and mathematical formulas used by banks and professionals. Results are accurate for estimation purposes. For critical financial decisions, verify with a qualified professional.",
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
