// Single source of truth for which tools have built components.
// Used by both the server (page.tsx SSG) and client (tool-renderer.tsx).
// When adding a new tool component, add its componentName here.
export const BUILT_TOOL_NAMES = [
  "mortgage-calculator",
  "percentage-calculator",
  "password-generator",
  "qr-code-generator",
  "bmi-calculator",
  "age-calculator",
  "emi-calculator",
  "tip-calculator",
  "json-formatter",
  "word-counter",
  "base64-encoder-decoder",
  "regex-tester",
  "color-picker",
  "uuid-generator",
  "md5-generator",
  "url-encoder-decoder",
  "sha256-generator",
  "case-converter",
  "css-gradient-generator",
  "timestamp-converter",
] as const

export const BUILT_TOOL_SLUGS = new Set<string>(BUILT_TOOL_NAMES)
