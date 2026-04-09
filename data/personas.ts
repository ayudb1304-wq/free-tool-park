export interface Persona {
  title: string
  metaTitle: string
  metaDescription: string
  headline: string
  subheadline: string
  categories: string[]
  keywords: string[]
}

export const PERSONAS: Record<string, Persona> = {
  developers: {
    title: "Developer Tools",
    metaTitle: "Free Developer Tools Online — JSON, Regex, UUID & More",
    metaDescription:
      "Essential browser-based developer tools. JSON formatter, regex tester, Base64 encoder, UUID generator, and more. No install, no signup, 100% private.",
    headline: "Free Developer Tools That Respect Your Privacy",
    subheadline:
      "Format, encode, decode, test, and validate — all in your browser. No data ever leaves your machine.",
    categories: ["developer-tools", "generators"],
    keywords: [
      "developer tools online",
      "free json formatter",
      "regex tester online",
      "base64 encoder",
      "uuid generator",
    ],
  },
  writers: {
    title: "Writer Tools",
    metaTitle: "Free Writing Tools for Bloggers & Content Creators",
    metaDescription:
      "Word counter, case converter, and more writing tools. Perfect for bloggers, copywriters, and content creators. 100% free, no signup.",
    headline: "Writing Tools Built for Content Creators",
    subheadline:
      "Count words, convert case, and polish your writing — all without leaving your browser.",
    categories: ["text-tools", "seo-tools"],
    keywords: [
      "writing tools for bloggers",
      "word counter online",
      "case converter",
      "free writing tools",
    ],
  },
  students: {
    title: "Student Tools",
    metaTitle: "Free Calculators & Study Tools for Students",
    metaDescription:
      "Math calculators, unit converters, and study tools for students. Free, no ads popup, works offline. Perfect for homework and exams.",
    headline: "Free Study Tools for Students",
    subheadline:
      "Calculators, converters, and study aids that work offline and never track you.",
    categories: ["calculators", "converters"],
    keywords: [
      "free calculators for school",
      "student calculator online",
      "percentage calculator",
      "unit converter for students",
    ],
  },
  designers: {
    title: "Designer Tools",
    metaTitle: "Free Design Tools Online — Colors, Gradients & More",
    metaDescription:
      "Free browser-based design tools: color picker, CSS gradient generator, QR code generator, and more. No install, no signup required.",
    headline: "Free Design Tools for Creatives",
    subheadline:
      "Pick colors, generate gradients, create QR codes — all in your browser with zero tracking.",
    categories: ["generators", "developer-tools"],
    keywords: [
      "free design tools online",
      "color picker",
      "css gradient generator",
      "qr code generator",
    ],
  },
  finance: {
    title: "Finance Tools",
    metaTitle: "Free Financial Calculators — Mortgage, EMI, Tip & More",
    metaDescription:
      "Free financial calculators: mortgage, EMI, tip, and percentage calculators. 100% private — your financial data never leaves your browser.",
    headline: "Free Financial Calculators You Can Trust",
    subheadline:
      "Calculate mortgage payments, EMIs, tips, and more. Your financial data stays on your device.",
    categories: ["calculators"],
    keywords: [
      "financial calculators free",
      "mortgage calculator",
      "emi calculator",
      "tip calculator online",
    ],
  },
}

export function getPersona(slug: string): Persona | undefined {
  return PERSONAS[slug]
}

export function getAllPersonaSlugs(): string[] {
  return Object.keys(PERSONAS)
}
