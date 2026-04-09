# ENHANCEMENT.md — USP & Viral Growth Engine Implementation

> **Purpose:** This document provides Claude Code with complete specifications for implementing a privacy-first USP and viral growth mechanics across the entire tool site. Every feature is SEO-optimized for maximum organic traffic and ad revenue.

> **Priority:** HIGH — These enhancements are critical path items for scaling to 1M+ monthly organic visitors.

> **Stack Context:** Next.js 16 App Router + Tailwind CSS v4 + TypeScript + Vercel

---

## Table of Contents

1. [Global USP Implementation](#1-global-usp-implementation)
2. [Privacy Badge Component](#2-privacy-badge-component)
3. [Shareable Result Links System](#3-shareable-result-links-system)
4. [Embeddable Widget System](#4-embeddable-widget-system)
5. [Branded Export System](#5-branded-export-system)
6. [Social Share Integration](#6-social-share-integration)
7. [Persona Landing Pages](#7-persona-landing-pages)
8. [Tool Request Community Page](#8-tool-request-community-page)
9. [Privacy Policy Page (SEO-Optimized)](#9-privacy-policy-page-seo-optimized)
10. [Save Without Account System](#10-save-without-account-system)
11. [Schema Markup Enhancements](#11-schema-markup-enhancements)
12. [Internal Linking Automation](#12-internal-linking-automation)

---

## 1. Global USP Implementation

### 1.1 Site-Wide Tagline

**Primary tagline (use in header, meta, OG tags):**
```
"Free tools that respect you. No tracking. No limits. No BS."
```

**Secondary tagline (use in footer, about page):**
```
"100% client-side tools. Your data never leaves your browser."
```

### 1.2 Global Metadata Updates

Update `app/layout.tsx` with enhanced metadata:

```typescript
// app/layout.tsx

import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'Free Online Tools — No Tracking, No Limits | YourSiteName',
    template: '%s | YourSiteName — Free Privacy-First Tools',
  },
  description:
    '100+ free browser-based tools that respect your privacy. No data collection, no sign-ups, no limits. Calculators, converters, dev tools & more.',
  keywords: [
    'free online tools',
    'privacy-focused tools',
    'no tracking tools',
    'browser-based calculator',
    'free converter',
    'developer tools online',
  ],
  authors: [{ name: 'YourSiteName Team' }],
  creator: 'YourSiteName',
  publisher: 'YourSiteName',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'YourSiteName',
    title: 'Free Online Tools — No Tracking, No Limits',
    description:
      '100+ free browser-based tools. Your data never leaves your browser. No sign-ups required.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YourSiteName — Free Privacy-First Online Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Tools — No Tracking, No Limits',
    description: '100+ free browser-based tools that respect your privacy.',
    images: ['/og-image.png'],
    creator: '@yourtwitterhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};
```

### 1.3 Homepage Hero Section Update

**SEO Requirements:**
- H1 must contain primary keyword: "Free Online Tools"
- Subheading must contain USP differentiator: "privacy", "no tracking"
- Include trust signals above the fold

```tsx
// components/home/HeroSection.tsx

export function HeroSection() {
  return (
    <section className="relative py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* H1 — Primary keyword first */}
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Free Online Tools That{' '}
          <span className="text-primary">Respect Your Privacy</span>
        </h1>

        {/* Subheading — Secondary keywords + USP */}
        <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto">
          100+ browser-based calculators, converters, and developer tools.
          No tracking. No sign-ups. No limits. Your data never leaves your device.
        </p>

        {/* Trust Badges — Social proof + technical proof */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-green-500" />
            <span>100% Client-Side</span>
          </div>
          <div className="flex items-center gap-2">
            <LockIcon className="w-5 h-5 text-green-500" />
            <span>No Data Collection</span>
          </div>
          <div className="flex items-center gap-2">
            <ZapIcon className="w-5 h-5 text-green-500" />
            <span>Instant Results</span>
          </div>
          <div className="flex items-center gap-2">
            <InfinityIcon className="w-5 h-5 text-green-500" />
            <span>Unlimited Use</span>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/tools"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition"
          >
            Browse All Tools
          </Link>
          <Link
            href="/privacy"
            className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-muted transition"
          >
            How We Protect You
          </Link>
        </div>
      </div>
    </section>
  );
}
```

---

## 2. Privacy Badge Component

### 2.1 Component Specification

Create a reusable privacy badge that appears on EVERY tool page.

**SEO Purpose:**
- Reinforces E-E-A-T trust signals
- Internal link to `/privacy` page (crawl efficiency)
- Differentiator content that competitors don't have

```tsx
// components/tools/PrivacyBadge.tsx

import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';

interface PrivacyBadgeProps {
  toolName?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export function PrivacyBadge({ toolName, variant = 'default' }: PrivacyBadgeProps) {
  if (variant === 'compact') {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-full text-sm">
        <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400" />
        <span className="text-green-700 dark:text-green-300 font-medium">
          100% Private
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">
              Your Privacy is Protected
            </h3>
            <p className="mt-1 text-sm text-green-700 dark:text-green-300">
              This {toolName || 'tool'} runs entirely in your browser using JavaScript.
              Your data is never sent to our servers, stored in any database, or shared
              with third parties. We can't see what you enter because it never leaves
              your device.
            </p>
            <Link
              href="/privacy"
              className="mt-2 inline-flex items-center text-sm font-medium text-green-600 dark:text-green-400 hover:underline"
            >
              Learn how we protect your data →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
      <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
      <div className="text-sm">
        <span className="font-medium text-green-800 dark:text-green-200">
          100% Private
        </span>
        <span className="text-green-700 dark:text-green-300">
          {' '}— This tool runs entirely in your browser. Your data never touches our servers.{' '}
        </span>
        <Link
          href="/privacy"
          className="font-medium text-green-600 dark:text-green-400 hover:underline"
        >
          How we protect you →
        </Link>
      </div>
    </div>
  );
}
```

### 2.2 Integration in Tool Page Template

Add to the standard tool page layout (place BELOW the tool, ABOVE the FAQ):

```tsx
// In every tool page component, after the tool output section:

<section className="mt-8">
  <PrivacyBadge toolName="JSON Formatter" variant="default" />
</section>
```

---

## 3. Shareable Result Links System

### 3.1 Overview

Every tool that produces a calculable result should generate a shareable URL containing the input parameters. When someone visits this URL, the tool auto-populates with those values and shows the result.

**SEO Benefits:**
- Each shared link = free backlink potential
- Increased direct traffic (not counted as organic, but builds brand)
- Users bookmark and return (engagement signals)

### 3.2 URL State Hook

```typescript
// hooks/useShareableState.ts

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface UseShareableStateOptions<T> {
  /** Default values when no URL params exist */
  defaultValues: T;
  /** Keys to include in the shareable URL */
  shareableKeys: (keyof T)[];
  /** Transform values before encoding to URL (optional) */
  encode?: (key: keyof T, value: T[keyof T]) => string;
  /** Transform values after decoding from URL (optional) */
  decode?: (key: keyof T, value: string) => T[keyof T];
}

export function useShareableState<T extends Record<string, any>>({
  defaultValues,
  shareableKeys,
  encode = (_, v) => String(v),
  decode = (_, v) => v as T[keyof T],
}: UseShareableStateOptions<T>) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Initialize state from URL params or defaults
  const getInitialState = useCallback((): T => {
    const state = { ...defaultValues };
    shareableKeys.forEach((key) => {
      const urlValue = searchParams.get(String(key));
      if (urlValue !== null) {
        state[key] = decode(key, urlValue);
      }
    });
    return state;
  }, [searchParams, defaultValues, shareableKeys, decode]);

  const [state, setState] = useState<T>(getInitialState);
  const [hasResult, setHasResult] = useState(false);

  // Generate shareable URL
  const getShareableUrl = useCallback((): string => {
    const params = new URLSearchParams();
    shareableKeys.forEach((key) => {
      const value = state[key];
      if (value !== undefined && value !== null && value !== '') {
        params.set(String(key), encode(key, value));
      }
    });
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}${pathname}?${params.toString()}`;
  }, [state, shareableKeys, pathname, encode]);

  // Update URL without navigation (for copy/share)
  const updateUrl = useCallback(() => {
    const params = new URLSearchParams();
    shareableKeys.forEach((key) => {
      const value = state[key];
      if (value !== undefined && value !== null && value !== '') {
        params.set(String(key), encode(key, value));
      }
    });
    const newUrl = `${pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [state, shareableKeys, pathname, encode]);

  // Copy shareable URL to clipboard
  const copyShareableUrl = useCallback(async (): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(getShareableUrl());
      return true;
    } catch {
      return false;
    }
  }, [getShareableUrl]);

  return {
    state,
    setState,
    hasResult,
    setHasResult,
    getShareableUrl,
    updateUrl,
    copyShareableUrl,
  };
}
```

### 3.3 Share Result Component

```tsx
// components/tools/ShareResult.tsx

'use client';

import { useState } from 'react';
import { Copy, Check, Twitter, Linkedin, Link2 } from 'lucide-react';

interface ShareResultProps {
  /** The shareable URL */
  url: string;
  /** Result summary for social sharing */
  resultText: string;
  /** Tool name for social sharing context */
  toolName: string;
  /** Optional hashtags for Twitter */
  hashtags?: string[];
}

export function ShareResult({
  url,
  resultText,
  toolName,
  hashtags = [],
}: ShareResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const twitterText = encodeURIComponent(
    `${resultText}\n\nCalculated with this free ${toolName}:`
  );
  const twitterHashtags = hashtags.length > 0 ? `&hashtags=${hashtags.join(',')}` : '';
  const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}&url=${encodeURIComponent(url)}${twitterHashtags}`;

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
      <p className="text-sm font-medium text-muted-foreground mb-3">
        Share your result
      </p>

      {/* Shareable URL Display */}
      <div className="flex items-center gap-2 mb-4">
        <div className="flex-1 px-3 py-2 bg-background border rounded-md text-sm truncate">
          {url}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition"
          aria-label="Copy link"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Social Share Buttons */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Share on:</span>
        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-muted transition"
          aria-label="Share on Twitter"
        >
          <Twitter className="w-5 h-5" />
        </a>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-muted transition"
          aria-label="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}
```

### 3.4 Example Integration (Mortgage Calculator)

```tsx
// app/tools/mortgage-calculator/page.tsx

'use client';

import { useShareableState } from '@/hooks/useShareableState';
import { ShareResult } from '@/components/tools/ShareResult';
import { PrivacyBadge } from '@/components/tools/PrivacyBadge';

export default function MortgageCalculatorPage() {
  const {
    state,
    setState,
    hasResult,
    setHasResult,
    getShareableUrl,
    updateUrl,
  } = useShareableState({
    defaultValues: {
      principal: 400000,
      rate: 6.5,
      term: 30,
      downPayment: 80000,
    },
    shareableKeys: ['principal', 'rate', 'term', 'downPayment'],
    decode: (key, value) => parseFloat(value),
  });

  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const calculate = () => {
    const p = state.principal - state.downPayment;
    const r = state.rate / 100 / 12;
    const n = state.term * 12;
    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyPayment(payment);
    setHasResult(true);
    updateUrl(); // Update URL with current values
  };

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* Tool UI here */}

      {hasResult && monthlyPayment && (
        <>
          {/* Result Display */}
          <div className="mt-8 p-6 bg-primary/10 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">Your Monthly Payment</p>
            <p className="text-4xl font-bold mt-2">
              ${monthlyPayment.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Share Component */}
          <ShareResult
            url={getShareableUrl()}
            resultText={`My estimated mortgage payment: $${monthlyPayment.toFixed(2)}/month on a $${state.principal.toLocaleString()} home.`}
            toolName="Mortgage Calculator"
            hashtags={['MortgageCalculator', 'HomeBuying', 'RealEstate']}
          />
        </>
      )}

      {/* Privacy Badge */}
      <div className="mt-8">
        <PrivacyBadge toolName="Mortgage Calculator" />
      </div>
    </main>
  );
}
```

---

## 4. Embeddable Widget System

### 4.1 Overview

Create iframe-embeddable versions of high-value tools. Each embed includes attribution link = passive backlinks at scale.

**Target Tools for Embeds (Priority Order):**

| Tool | Target Embedders | Estimated Monthly Embeds |
|------|------------------|--------------------------|
| Currency Converter | Travel blogs, expat sites | 50-100 |
| Mortgage Calculator | Real estate blogs | 30-50 |
| BMI Calculator | Health/fitness blogs | 40-80 |
| Word Counter | Writing blogs, schools | 60-100 |
| Color Picker | Design blogs, portfolios | 30-60 |
| Percentage Calculator | Education sites | 40-70 |

### 4.2 Embed Route Structure

```
/embed/[tool-slug]/page.tsx    — Minimal embed version (no header/footer)
/embed/[tool-slug]/customize   — Customization UI for getting embed code
```

### 4.3 Embed Layout (Minimal Chrome)

```tsx
// app/embed/layout.tsx

import '@/styles/globals.css';

export const metadata = {
  robots: 'noindex, nofollow', // Don't index embed pages
};

export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900">
        <div className="p-4">{children}</div>

        {/* Attribution Footer — REQUIRED for backlink */}
        <footer className="px-4 py-2 border-t text-center text-xs text-muted-foreground">
          Powered by{' '}
          <a
            href="https://yourdomain.com?ref=embed"
            target="_blank"
            rel="noopener"
            className="font-medium text-primary hover:underline"
          >
            YourSiteName
          </a>
          {' '}— Free Privacy-First Tools
        </footer>
      </body>
    </html>
  );
}
```

### 4.4 Embed Tool Example (Currency Converter)

```tsx
// app/embed/currency-converter/page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Simplified embed version — no navigation, no ads, minimal UI
export default function CurrencyConverterEmbed() {
  const searchParams = useSearchParams();

  // Get customization from URL params
  const defaultFrom = searchParams.get('from') || 'USD';
  const defaultTo = searchParams.get('to') || 'EUR';
  const defaultAmount = parseFloat(searchParams.get('amount') || '100');
  const themeColor = searchParams.get('color') || '#3b82f6';

  const [amount, setAmount] = useState(defaultAmount);
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [result, setResult] = useState<number | null>(null);

  // Your conversion logic here...

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-4">Currency Converter</h2>
      {/* Minimal converter UI */}
      {/* ... form fields ... */}
      {result && (
        <div
          className="mt-4 p-3 rounded-lg text-center text-white"
          style={{ backgroundColor: themeColor }}
        >
          <span className="text-2xl font-bold">
            {result.toFixed(2)} {toCurrency}
          </span>
        </div>
      )}
    </div>
  );
}
```

### 4.5 Embed Showcase Page

**URL:** `/embed`
**Target Keywords:**
- "free embeddable calculator" (KD: 15, Vol: 1.2K)
- "embed currency converter widget" (KD: 8, Vol: 800)
- "free website calculator widget" (KD: 12, Vol: 2.1K)

```tsx
// app/embed/page.tsx

import { Metadata } from 'next';
import { EmbedShowcase } from '@/components/embed/EmbedShowcase';

export const metadata: Metadata = {
  title: 'Free Embeddable Widgets & Calculators for Your Website',
  description:
    'Add free calculators, converters, and tools to your website. Privacy-first, customizable widgets with one-click embed code. No signup required.',
  keywords: [
    'free embeddable calculator',
    'website widget',
    'embed calculator',
    'free currency converter widget',
    'embeddable tools',
  ],
};

export default function EmbedPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* H1 with primary keyword */}
      <h1 className="text-4xl font-bold text-center">
        Free Embeddable Widgets for Your Website
      </h1>

      <p className="mt-4 text-xl text-center text-muted-foreground max-w-2xl mx-auto">
        Add powerful calculators and tools to your blog, website, or app.
        Privacy-first, fully customizable, and always free.
      </p>

      {/* Trust badges */}
      <div className="mt-8 flex justify-center gap-6 text-sm text-muted-foreground">
        <span>✓ No signup required</span>
        <span>✓ Customize colors & defaults</span>
        <span>✓ Mobile responsive</span>
        <span>✓ GDPR compliant</span>
      </div>

      {/* Widget gallery */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-8">Available Widgets</h2>
        <EmbedShowcase />
      </section>

      {/* How it works section (HowTo schema target) */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">
          How to Add a Widget to Your Website
        </h2>
        <ol className="space-y-4 max-w-2xl">
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </span>
            <div>
              <strong>Choose your widget</strong>
              <p className="text-muted-foreground">
                Browse our collection and select the tool you want to embed.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </span>
            <div>
              <strong>Customize appearance</strong>
              <p className="text-muted-foreground">
                Set default values, colors, and dimensions to match your site.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </span>
            <div>
              <strong>Copy the embed code</strong>
              <p className="text-muted-foreground">
                Paste the iframe code into your HTML and you're done!
              </p>
            </div>
          </li>
        </ol>
      </section>

      {/* FAQ Section (PAA targeting) */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 max-w-2xl">
          <div>
            <h3 className="font-medium">
              Are these widgets really free to use?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Yes, all our embeddable widgets are 100% free with no usage limits.
              We only ask that you keep the small attribution link.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              Do the widgets collect user data?
            </h3>
            <p className="mt-2 text-muted-foreground">
              No. All calculations happen in the browser. We don't collect, store,
              or transmit any data entered into our widgets.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              Can I customize the widget colors?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Yes! Each widget can be customized with your brand colors using
              URL parameters. See the customization options when you select a widget.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              Will the widgets slow down my website?
            </h3>
            <p className="mt-2 text-muted-foreground">
              No. Widgets load asynchronously in an iframe and don't block your
              page rendering. They're optimized for Core Web Vitals.
            </p>
          </div>
          <div>
            <h3 className="font-medium">
              Can I remove the attribution link?
            </h3>
            <p className="mt-2 text-muted-foreground">
              We'd appreciate if you keep it, but we understand. Contact us about
              white-label options for commercial use.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
```

### 4.6 Embed Code Generator Component

```tsx
// components/embed/EmbedCodeGenerator.tsx

'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface EmbedCodeGeneratorProps {
  toolSlug: string;
  toolName: string;
  defaultParams?: Record<string, string>;
  availableParams: {
    name: string;
    label: string;
    type: 'text' | 'number' | 'color' | 'select';
    options?: { value: string; label: string }[];
    default: string;
  }[];
}

export function EmbedCodeGenerator({
  toolSlug,
  toolName,
  defaultParams = {},
  availableParams,
}: EmbedCodeGeneratorProps) {
  const [params, setParams] = useState(defaultParams);
  const [width, setWidth] = useState('400');
  const [height, setHeight] = useState('300');
  const [copied, setCopied] = useState(false);

  const baseUrl = `https://yourdomain.com/embed/${toolSlug}`;
  const queryString = new URLSearchParams(params).toString();
  const embedUrl = queryString ? `${baseUrl}?${queryString}` : baseUrl;

  const embedCode = `<iframe
  src="${embedUrl}"
  width="${width}"
  height="${height}"
  frameborder="0"
  title="${toolName}"
  loading="lazy"
></iframe>
<p style="font-size:12px;margin-top:4px;">
  Powered by <a href="https://yourdomain.com/${toolSlug}?ref=embed" target="_blank" rel="noopener">YourSiteName</a>
</p>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Customization Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        {availableParams.map((param) => (
          <div key={param.name}>
            <label className="block text-sm font-medium mb-1">
              {param.label}
            </label>
            {param.type === 'select' ? (
              <select
                value={params[param.name] || param.default}
                onChange={(e) =>
                  setParams({ ...params, [param.name]: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              >
                {param.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={param.type}
                value={params[param.name] || param.default}
                onChange={(e) =>
                  setParams({ ...params, [param.name]: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md"
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1">Width (px)</label>
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Height (px)</label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
      </div>

      {/* Preview */}
      <div>
        <h3 className="text-sm font-medium mb-2">Preview</h3>
        <div className="border rounded-lg p-4 bg-muted/30">
          <iframe
            src={embedUrl}
            width={width}
            height={height}
            frameBorder="0"
            title={`${toolName} Preview`}
          />
        </div>
      </div>

      {/* Embed Code */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium">Embed Code</h3>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Code
              </>
            )}
          </button>
        </div>
        <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg overflow-x-auto text-sm">
          <code>{embedCode}</code>
        </pre>
      </div>
    </div>
  );
}
```

---

## 5. Branded Export System

### 5.1 Overview

Add subtle, optional branding to downloadable outputs. Users share these files → brand exposure → traffic.

**Implementation Rules:**
- Branding must be SUBTLE (small footer, comment, corner text)
- Branding must be REMOVABLE or optional
- Never obstruct the primary output

### 5.2 Branded Download Utilities

```typescript
// lib/exports/brandedExports.ts

import { jsPDF } from 'jspdf';

const BRAND_NAME = 'YourSiteName';
const BRAND_URL = 'https://yourdomain.com';
const BRAND_TAGLINE = 'Free Privacy-First Tools';

/**
 * Add branding footer to PDF exports
 */
export function addPdfBranding(
  doc: jsPDF,
  options: { includeBranding?: boolean } = {}
): void {
  if (options.includeBranding === false) return;

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Created with ${BRAND_NAME} — ${BRAND_URL}`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );
}

/**
 * Add branding to text/code exports
 */
export function addTextBranding(
  content: string,
  format: 'json' | 'text' | 'code',
  options: { includeBranding?: boolean } = {}
): string {
  if (options.includeBranding === false) return content;

  switch (format) {
    case 'json':
      return `${content}\n\n// Generated by ${BRAND_NAME} — ${BRAND_URL}`;
    case 'code':
      return `${content}\n\n/* Generated by ${BRAND_NAME} — ${BRAND_URL} */`;
    case 'text':
    default:
      return `${content}\n\n---\nGenerated by ${BRAND_NAME} — ${BRAND_URL}`;
  }
}

/**
 * Add branding to image canvas exports (PNG, QR codes, etc.)
 */
export function addCanvasBranding(
  canvas: HTMLCanvasElement,
  options: { includeBranding?: boolean; position?: 'bottom' | 'corner' } = {}
): HTMLCanvasElement {
  if (options.includeBranding === false) return canvas;

  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const position = options.position || 'bottom';
  const brandText = `${BRAND_NAME}.com`;

  ctx.font = '10px Arial';
  ctx.fillStyle = 'rgba(150, 150, 150, 0.8)';

  if (position === 'bottom') {
    ctx.textAlign = 'center';
    ctx.fillText(brandText, canvas.width / 2, canvas.height - 8);
  } else {
    ctx.textAlign = 'right';
    ctx.fillText(brandText, canvas.width - 8, canvas.height - 8);
  }

  return canvas;
}

/**
 * CSV/Spreadsheet branding (add as last row)
 */
export function addCsvBranding(
  csvContent: string,
  options: { includeBranding?: boolean } = {}
): string {
  if (options.includeBranding === false) return csvContent;

  return `${csvContent}\n\n"Generated by ${BRAND_NAME}","${BRAND_URL}"`;
}
```

### 5.3 Export Button Component with Branding Toggle

```tsx
// components/tools/ExportButton.tsx

'use client';

import { useState } from 'react';
import { Download, ChevronDown } from 'lucide-react';

interface ExportButtonProps {
  onExport: (options: { includeBranding: boolean }) => void;
  formats?: { value: string; label: string }[];
  defaultFormat?: string;
}

export function ExportButton({
  onExport,
  formats = [{ value: 'default', label: 'Download' }],
  defaultFormat = 'default',
}: ExportButtonProps) {
  const [includeBranding, setIncludeBranding] = useState(true);
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onExport({ includeBranding })}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Download className="w-4 h-4" />
          Download
        </button>
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="p-2 border rounded-md hover:bg-muted"
          aria-label="Export options"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {showOptions && (
        <div className="absolute top-full right-0 mt-2 p-4 bg-background border rounded-lg shadow-lg z-10 min-w-[200px]">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={includeBranding}
              onChange={(e) => setIncludeBranding(e.target.checked)}
              className="rounded"
            />
            <span>Include "Made with {BRAND_NAME}"</span>
          </label>
          <p className="mt-2 text-xs text-muted-foreground">
            Helps support our free tools!
          </p>
        </div>
      )}
    </div>
  );
}
```

---

## 6. Social Share Integration

### 6.1 Meta Tags for Rich Sharing

Add dynamic OG tags to every tool page:

```tsx
// app/tools/[slug]/page.tsx

import { Metadata } from 'next';
import { getToolBySlug } from '@/lib/tools';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  const title = `Free ${tool.name} — ${tool.shortDescription}`;
  const description = `${tool.description} 100% private, runs in your browser.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://yourdomain.com/tools/${slug}`,
      siteName: 'YourSiteName',
      images: [
        {
          url: `/og/${slug}.png`, // Dynamic OG image
          width: 1200,
          height: 630,
          alt: `${tool.name} — Free Online Tool`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/og/${slug}.png`],
    },
  };
}
```

### 6.2 Dynamic OG Image Generation

```tsx
// app/og/[slug]/route.tsx

import { ImageResponse } from 'next/og';
import { getToolBySlug } from '@/lib/tools';

export const runtime = 'edge';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const tool = getToolBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#ffffff',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #f0f9ff 0%, #ffffff 50%)',
        }}
      >
        {/* Tool icon */}
        <div
          style={{
            fontSize: 80,
            marginBottom: 20,
          }}
        >
          {tool.icon}
        </div>

        {/* Tool name */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: '#0f172a',
            marginBottom: 10,
          }}
        >
          {tool.name}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: '#64748b',
            marginBottom: 40,
          }}
        >
          {tool.shortDescription}
        </div>

        {/* Brand footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: '#3b82f6',
            }}
          >
            YourSiteName
          </div>
          <div
            style={{
              fontSize: 20,
              color: '#94a3b8',
            }}
          >
            Free Privacy-First Tools
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

---

## 7. Persona Landing Pages

### 7.1 Overview

Create dedicated landing pages for specific user segments. Each page curates tools for that persona and uses persona-specific keywords.

**Pages to Create:**

| Page | Target Persona | Primary Keyword | Monthly Volume | KD |
|------|---------------|-----------------|----------------|-----|
| `/for/developers` | Software developers | "developer tools online" | 8,100 | 25 |
| `/for/writers` | Content creators | "writing tools for bloggers" | 2,400 | 18 |
| `/for/students` | Students | "free calculators for school" | 3,600 | 12 |
| `/for/designers` | Designers | "free design tools online" | 4,200 | 22 |
| `/for/marketers` | Marketing professionals | "free marketing tools" | 6,500 | 35 |
| `/for/finance` | Finance professionals | "financial calculators free" | 9,800 | 28 |

### 7.2 Persona Page Template

```tsx
// app/for/[persona]/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getToolsByCategory } from '@/lib/tools';
import { PrivacyBadge } from '@/components/tools/PrivacyBadge';

// Persona configurations
const personas: Record<
  string,
  {
    title: string;
    metaTitle: string;
    metaDescription: string;
    headline: string;
    subheadline: string;
    categories: string[];
    keywords: string[];
  }
> = {
  developers: {
    title: 'Developer Tools',
    metaTitle: 'Free Developer Tools Online — JSON, Regex, JWT & More',
    metaDescription:
      'Essential browser-based developer tools. JSON formatter, regex tester, JWT decoder, Base64 encoder, and 50+ more. No install, no signup, 100% private.',
    headline: 'Free Developer Tools That Respect Your Privacy',
    subheadline:
      'Format, encode, decode, test, and validate — all in your browser. No data ever leaves your machine.',
    categories: ['developer', 'encoding', 'generators'],
    keywords: [
      'developer tools online',
      'free json formatter',
      'regex tester online',
      'jwt decoder',
      'base64 encoder',
    ],
  },
  writers: {
    title: 'Writer Tools',
    metaTitle: 'Free Writing Tools for Bloggers & Content Creators',
    metaDescription:
      'Word counter, readability checker, case converter, and more writing tools. Perfect for bloggers, copywriters, and content creators. 100% free.',
    headline: 'Writing Tools Built for Content Creators',
    subheadline:
      'Count words, check readability, convert case, and polish your writing — all without leaving your browser.',
    categories: ['text', 'writing', 'seo'],
    keywords: [
      'writing tools for bloggers',
      'word counter online',
      'readability checker',
      'case converter',
      'free writing tools',
    ],
  },
  students: {
    title: 'Student Tools',
    metaTitle: 'Free Calculators & Study Tools for Students',
    metaDescription:
      'Math calculators, unit converters, GPA calculator, and study tools for students. Free, no ads popup, works offline. Perfect for homework.',
    headline: 'Free Study Tools for Students',
    subheadline:
      'Calculators, converters, and study aids that work offline and never track you.',
    categories: ['math', 'converters', 'calculators'],
    keywords: [
      'free calculators for school',
      'student calculator online',
      'gpa calculator',
      'unit converter for students',
    ],
  },
  // Add more personas...
};

type Props = {
  params: Promise<{ persona: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { persona } = await params;
  const config = personas[persona];
  if (!config) return {};

  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    openGraph: {
      title: config.metaTitle,
      description: config.metaDescription,
      url: `https://yourdomain.com/for/${persona}`,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(personas).map((persona) => ({ persona }));
}

export default async function PersonaPage({ params }: Props) {
  const { persona } = await params;
  const config = personas[persona];

  if (!config) {
    notFound();
  }

  const tools = config.categories.flatMap((cat) => getToolsByCategory(cat));

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold">{config.headline}</h1>
        <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
          {config.subheadline}
        </p>
        <div className="mt-6">
          <PrivacyBadge variant="compact" />
        </div>
      </section>

      {/* Tool Grid */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">
          All {config.title} ({tools.length})
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group p-6 border rounded-lg hover:border-primary hover:shadow-md transition"
            >
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="text-lg font-semibold group-hover:text-primary">
                {tool.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {tool.shortDescription}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Use Our Tools Section */}
      <section className="mt-16 p-8 bg-muted/30 rounded-2xl">
        <h2 className="text-2xl font-semibold mb-6">
          Why {config.title.split(' ')[0]}s Choose Us
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="font-semibold">🔒 100% Private</h3>
            <p className="mt-2 text-muted-foreground">
              All tools run in your browser. Your code, data, and content never
              touch our servers.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">⚡ Lightning Fast</h3>
            <p className="mt-2 text-muted-foreground">
              No waiting for server responses. Calculations happen instantly in
              your browser.
            </p>
          </div>
          <div>
            <h3 className="font-semibold">🌐 Works Offline</h3>
            <p className="mt-2 text-muted-foreground">
              Once loaded, most tools work without internet. Perfect for working
              on the go.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6 max-w-2xl">
          <div>
            <h3 className="font-medium">
              Are these {config.title.toLowerCase()} really free?
            </h3>
            <p className="mt-2 text-muted-foreground">
              Yes, completely free with no hidden limits. We're ad-supported,
              which keeps everything free for you.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Do I need to create an account?</h3>
            <p className="mt-2 text-muted-foreground">
              No signup required for any tool. Just open and use immediately.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Can I use these tools on mobile?</h3>
            <p className="mt-2 text-muted-foreground">
              Yes, all tools are fully responsive and work on phones, tablets,
              and desktops.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
```

---

## 8. Tool Request Community Page

### 8.1 Overview

**URL:** `/request-a-tool`
**Target Keywords:**
- "request online tool" (KD: 5, Vol: 500)
- "suggest calculator website" (KD: 3, Vol: 200)
- "free tool request" (KD: 8, Vol: 300)

**Purpose:**
- Gather user-generated tool ideas
- Build community ownership
- Email list growth
- Free market research

### 8.2 Page Implementation

```tsx
// app/request-a-tool/page.tsx

import { Metadata } from 'next';
import { ToolRequestForm } from '@/components/community/ToolRequestForm';
import { TopRequestedTools } from '@/components/community/TopRequestedTools';

export const metadata: Metadata = {
  title: 'Request a Tool — Help Us Build What You Need',
  description:
    "Can't find the tool you need? Request it! We build the most-requested tools first. Vote on ideas from the community.",
  keywords: [
    'request online tool',
    'suggest calculator',
    'free tool request',
    'community tool voting',
  ],
};

export default function RequestToolPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold">Request a Tool</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          Can't find what you're looking for? Tell us what to build next.
          We prioritize the most-requested tools.
        </p>
      </section>

      {/* Request Form */}
      <section className="mb-16">
        <ToolRequestForm />
      </section>

      {/* Most Requested */}
      <section>
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          🔥 Most Requested Tools
        </h2>
        <TopRequestedTools />
      </section>

      {/* Recently Built */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          ✅ Recently Built from Requests
        </h2>
        <p className="text-muted-foreground mb-4">
          These tools were built because users like you requested them!
        </p>
        {/* List of recently built tools with links */}
      </section>
    </main>
  );
}
```

### 8.3 Request Form Component

```tsx
// components/community/ToolRequestForm.tsx

'use client';

import { useState } from 'react';

export function ToolRequestForm() {
  const [toolName, setToolName] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // TODO: Submit to your backend/database
    // await submitToolRequest({ toolName, description, email });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center bg-green-50 dark:bg-green-950 rounded-lg">
        <div className="text-4xl mb-4">🎉</div>
        <h3 className="text-xl font-semibold text-green-800 dark:text-green-200">
          Thanks for your suggestion!
        </h3>
        <p className="mt-2 text-green-700 dark:text-green-300">
          We've added your request. We'll notify you when it's built!
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 border rounded-lg bg-muted/20"
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="toolName"
            className="block text-sm font-medium mb-1"
          >
            What tool do you wish existed?{' '}
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="toolName"
            value={toolName}
            onChange={(e) => setToolName(e.target.value)}
            placeholder="e.g., IBAN Validator, Cron Expression Builder"
            required
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Why do you need this tool? (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Help us understand your use case..."
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Your email (optional — we'll notify you when it's built)
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-primary"
          />
          <p className="mt-1 text-xs text-muted-foreground">
            We'll only email you about this request. No spam, ever.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
}
```

---

## 9. Privacy Policy Page (SEO-Optimized)

### 9.1 Overview

Transform the legal-required privacy page into an SEO asset that ranks for privacy-related queries.

**URL:** `/privacy`
**Target Keywords:**
- "privacy-focused online tools" (KD: 12, Vol: 800)
- "tools that don't track you" (KD: 5, Vol: 400)
- "client-side calculator" (KD: 8, Vol: 600)

### 9.2 Page Implementation

```tsx
// app/privacy/page.tsx

import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — How We Protect Your Data',
  description:
    "Learn why we're the most privacy-focused tool site online. 100% client-side processing, no tracking, no data collection. Your data never leaves your browser.",
  keywords: [
    'privacy-focused online tools',
    'no tracking calculator',
    'client-side tools',
    'private online converter',
    'GDPR compliant tools',
  ],
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <article className="prose prose-lg dark:prose-invert max-w-none">
        {/* SEO-optimized H1 */}
        <h1>Privacy Policy — How We Protect Your Data</h1>

        <p className="lead">
          <strong>TL;DR:</strong> We don't collect your data. Period. Every tool
          on this site runs entirely in your browser. Your inputs, calculations,
          and results never touch our servers.
        </p>

        {/* Quick Trust Summary */}
        <div className="not-prose my-8 p-6 bg-green-50 dark:bg-green-950 rounded-lg">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">
            Our Privacy Promise
          </h2>
          <ul className="space-y-2 text-green-700 dark:text-green-300">
            <li className="flex items-center gap-2">
              <span>✓</span> No tracking cookies
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> No analytics on tool inputs
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> No data sent to servers
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> No user accounts required
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span> Works offline after first load
            </li>
          </ul>
        </div>

        <h2>Why We Built Privacy-First Tools</h2>
        <p>
          Most online tool sites are surveillance machines. They log your IP
          address, track your inputs, sell your data to advertisers, and require
          accounts for basic functionality.
        </p>
        <p>We built this site because we were tired of that. When you use a
          mortgage calculator, no one needs to know your income. When you format
          JSON, no one needs to see your API keys. When you generate a password,
          definitely no one should be storing that.
        </p>

        <h2>How Our Tools Work (Technical Explanation)</h2>
        <p>
          Every tool on this site uses <strong>client-side JavaScript</strong>.
          This means the code runs in your web browser, not on our servers.
        </p>
        <p>
          When you type into a calculator or formatter:
        </p>
        <ol>
          <li>Your browser executes the JavaScript code locally</li>
          <li>Calculations happen on your device's CPU</li>
          <li>Results display in your browser</li>
          <li>No network requests are made with your data</li>
        </ol>
        <p>
          You can verify this yourself: open your browser's Developer Tools
          (F12), go to the Network tab, and use any tool. You'll see no requests
          containing your input data.
        </p>

        <h2>What We Do Collect</h2>
        <p>
          To be completely transparent, here's what we do collect:
        </p>
        <ul>
          <li>
            <strong>Basic analytics:</strong> We use privacy-focused analytics
            (Plausible/Fathom) to count page views. This does not track individual
            users, use cookies, or collect any personal data.
          </li>
          <li>
            <strong>Error logs:</strong> If the website breaks, we log technical
            errors (not user data) to fix bugs.
          </li>
          <li>
            <strong>Tool request submissions:</strong> If you submit a tool
            request and include your email, we store that to notify you.
          </li>
        </ul>

        <h2>Advertising</h2>
        <p>
          This site is supported by display advertising. Our ad partners may use
          cookies for ad personalization. You can opt out of personalized ads
          using your browser settings or ad preference tools.
        </p>
        <p>
          Importantly: <strong>ad networks never see your tool inputs</strong>.
          They only know you visited a page, not what you typed into it.
        </p>

        <h2>GDPR Compliance</h2>
        <p>
          Because we don't collect personal data from tool usage, most GDPR
          requirements don't apply to our tools. For the limited data we do
          handle (analytics, contact forms), we comply with GDPR:
        </p>
        <ul>
          <li>Right to access: Contact us to see any data we have</li>
          <li>Right to deletion: Contact us to delete your data</li>
          <li>Data minimization: We collect only what's necessary</li>
        </ul>

        <h2>Open Source Verification</h2>
        <p>
          Don't trust us? Verify yourself. The core logic of many of our tools
          is open source on GitHub. You can inspect the code and confirm no data
          is transmitted.
        </p>
        <p>
          <Link href="https://github.com/yourusername" className="font-medium">
            View our GitHub →
          </Link>
        </p>

        <h2>Contact Us</h2>
        <p>
          Questions about privacy? Email us at{' '}
          <a href="mailto:privacy@yourdomain.com">privacy@yourdomain.com</a>.
        </p>

        <p className="text-sm text-muted-foreground mt-8">
          Last updated: {new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </article>
    </main>
  );
}
```

---

## 10. Save Without Account System

### 10.1 Overview

Use browser localStorage to save user data without requiring accounts. This creates returning users without friction.

### 10.2 Local Storage Hook

```typescript
// hooks/useLocalStorage.ts

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Initialize from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
    }
  }, [key]);

  // Setter function
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Clear function
  const clearValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error clearing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue];
}
```

### 10.3 Calculation History Component

```tsx
// components/tools/CalculationHistory.tsx

'use client';

import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Clock, Trash2, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface HistoryItem {
  id: string;
  timestamp: number;
  inputs: Record<string, any>;
  result: any;
  shareableUrl: string;
}

interface CalculationHistoryProps {
  toolSlug: string;
  toolName: string;
  formatResult: (result: any) => string;
  formatInputs: (inputs: Record<string, any>) => string;
}

export function CalculationHistory({
  toolSlug,
  toolName,
  formatResult,
  formatInputs,
}: CalculationHistoryProps) {
  const [history, setHistory, clearHistory] = useLocalStorage<HistoryItem[]>(
    `${toolSlug}-history`,
    []
  );

  if (history.length === 0) {
    return null;
  }

  const removeItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="mt-8 border rounded-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Your Recent Calculations
        </h3>
        <button
          onClick={clearHistory}
          className="text-sm text-muted-foreground hover:text-red-500 transition"
        >
          Clear All
        </button>
      </div>

      <ul className="divide-y">
        {history.slice(0, 5).map((item) => (
          <li
            key={item.id}
            className="p-4 flex items-center justify-between hover:bg-muted/30"
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{formatResult(item.result)}</p>
              <p className="text-sm text-muted-foreground truncate">
                {formatInputs(item.inputs)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(item.timestamp).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Link
                href={item.shareableUrl}
                className="p-2 hover:bg-muted rounded-md"
                title="Open this calculation"
              >
                <ExternalLink className="w-4 h-4" />
              </Link>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-red-100 hover:text-red-500 rounded-md transition"
                title="Remove from history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>

      <p className="p-3 text-xs text-center text-muted-foreground bg-muted/30">
        History is saved locally in your browser. No account needed.
      </p>
    </div>
  );
}
```

---

## 11. Schema Markup Enhancements

### 11.1 Combined Schema Component

Every tool page should have multiple schema types for maximum SERP feature eligibility.

```tsx
// components/seo/ToolSchema.tsx

interface ToolSchemaProps {
  name: string;
  description: string;
  url: string;
  category: string;
  datePublished: string;
  dateModified: string;
  howToSteps: { name: string; text: string }[];
  faqs: { question: string; answer: string }[];
}

export function ToolSchema({
  name,
  description,
  url,
  category,
  datePublished,
  dateModified,
  howToSteps,
  faqs,
}: ToolSchemaProps) {
  const schemas = [
    // SoftwareApplication Schema
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: name,
      description: description,
      url: url,
      applicationCategory: category,
      operatingSystem: 'Any (Browser-based)',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '150',
        bestRating: '5',
        worstRating: '1',
      },
    },
    // HowTo Schema
    {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to Use ${name}`,
      description: `Step-by-step guide to using ${name}`,
      step: howToSteps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
      })),
    },
    // FAQPage Schema
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
    // WebPage Schema
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: name,
      description: description,
      url: url,
      datePublished: datePublished,
      dateModified: dateModified,
      isPartOf: {
        '@type': 'WebSite',
        name: 'YourSiteName',
        url: 'https://yourdomain.com',
      },
    },
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
```

---

## 12. Internal Linking Automation

### 12.1 Related Tools Component

Automatically show related tools based on category and tags.

```tsx
// components/tools/RelatedTools.tsx

import Link from 'next/link';
import { getRelatedTools, Tool } from '@/lib/tools';

interface RelatedToolsProps {
  currentToolSlug: string;
  category: string;
  tags: string[];
  limit?: number;
}

export function RelatedTools({
  currentToolSlug,
  category,
  tags,
  limit = 6,
}: RelatedToolsProps) {
  const relatedTools = getRelatedTools(currentToolSlug, category, tags, limit);

  if (relatedTools.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">Related Tools You May Like</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {relatedTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="flex items-center gap-4 p-4 border rounded-lg hover:border-primary hover:shadow-sm transition group"
          >
            <div className="text-2xl flex-shrink-0">{tool.icon}</div>
            <div className="min-w-0">
              <h3 className="font-medium group-hover:text-primary truncate">
                {tool.name}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {tool.shortDescription}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

### 12.2 Category Hub Links

Add breadcrumbs and hub links to every tool page:

```tsx
// components/tools/ToolBreadcrumbs.tsx

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface ToolBreadcrumbsProps {
  category: {
    slug: string;
    name: string;
  };
  toolName: string;
}

export function ToolBreadcrumbs({ category, toolName }: ToolBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
    >
      <Link
        href="/"
        className="hover:text-foreground transition flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
        <span className="sr-only">Home</span>
      </Link>
      <ChevronRight className="w-4 h-4" />
      <Link
        href={`/categories/${category.slug}`}
        className="hover:text-foreground transition"
      >
        {category.name}
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-foreground font-medium">{toolName}</span>
    </nav>
  );
}
```

---

## Implementation Checklist

Use this checklist to track implementation progress:

### Phase 1: Foundation (Week 1-2)
- [ ] Update global metadata in `app/layout.tsx`
- [ ] Update homepage hero section with USP messaging
- [ ] Create `PrivacyBadge` component
- [ ] Add privacy badge to all existing tool pages
- [ ] Create `/privacy` page with SEO-optimized content

### Phase 2: Shareable Links (Week 2-3)
- [ ] Create `useShareableState` hook
- [ ] Create `ShareResult` component
- [ ] Implement shareable links for top 10 tools
- [ ] Add dynamic OG image generation

### Phase 3: Embeds (Week 3-4)
- [ ] Create `/embed` layout (minimal chrome)
- [ ] Create embed versions of 5 priority tools
- [ ] Create `/embed` showcase page
- [ ] Create `EmbedCodeGenerator` component

### Phase 4: Community (Week 4-5)
- [ ] Create `/request-a-tool` page
- [ ] Create `ToolRequestForm` component
- [ ] Create `TopRequestedTools` component
- [ ] Set up backend for storing requests

### Phase 5: Persona Pages (Week 5-6)
- [ ] Create `/for/developers` page
- [ ] Create `/for/writers` page
- [ ] Create `/for/students` page
- [ ] Create remaining persona pages

### Phase 6: Polish (Week 6-7)
- [ ] Implement branded exports
- [ ] Add calculation history to top tools
- [ ] Add schema markup to all tool pages
- [ ] Implement related tools component
- [ ] Add breadcrumbs to all tool pages

---

## SEO Monitoring After Implementation

Track these metrics weekly after implementing:

1. **GSC Impressions** for new pages (persona pages, embed page, privacy page)
2. **Click-through rate** changes on tool pages with share buttons
3. **Referring domains** growth (from embeds)
4. **Direct traffic** growth (from shared links)
5. **Returning users** percentage (from localStorage features)
6. **Page depth** (internal linking effectiveness)

---

## Notes for Claude Code

1. All components use Tailwind CSS v4 — use `@theme` for custom design tokens if needed
2. Use Next.js 16 App Router conventions (async params, metadata exports)
3. All client components must have `'use client'` directive
4. Prefer `lucide-react` for icons
5. Follow existing project file structure
6. Test all shareable URLs work correctly with URL parsing
7. Ensure all localStorage operations have try/catch for Safari private browsing
8. All schema markup must be valid JSON-LD (test with Google Rich Results Test)
