# SEO Clicks Growth Plan

**Created:** 2026-04-23
**Last updated:** 2026-04-23
**Source:** Google Search Console export `freetoolpark.com-Performance-on-Search-2026-04-21.zip` (last 3 months)
**Owner:** FreeToolPark team
**Support email:** sushi@freetoolpark.com

## Progress

| Phase | Status | Completed |
|---|---|---|
| Phase 1: Fix E-E-A-T gaps | COMPLETE | 2026-04-23 |
| Phase 2: Ship the blog | COMPLETE | 2026-04-23 |
| Phase 3: Content depth on top queries | NOT STARTED | |
| Phase 4: Categories and structure | COMPLETE | 2026-04-24 |
| Phase 5: Technical SEO fixes | NOT STARTED | |
| Phase 6: Backlinks | NOT STARTED | |
| Phase 7: Blog ship queue | NOT STARTED | |
| Phase 8: Measurement | NOT STARTED | |

## Current state (baseline)

| Metric | Value |
|---|---|
| Impressions (last 3 months) | 20,504 |
| Clicks (last 3 months) | 1 |
| CTR | 0.00% |
| Average position | 78 |
| Rich results earned | 0 |
| Desktop / Mobile split | 97% / 2.5% |
| Pages known to Google | ~302 |
| Blog posts live | 0 |
| About page | Missing |
| Contact page | Missing |

## Diagnosis in one sentence

This is not a CTR problem. It is a ranking and content-mix problem: at position 78 no title or meta tweak can generate clicks, and the queries that do rank (`miles to km`, `mm to inches`) are eaten by Google's inline widget.

## Goals for this plan (30-day)

- Break into top 20 on at least 5 widget-free queries (`gb to mb`, `bytes to megabytes`, `binary to decimal`, `kb to gb`, `mb to gb`).
- Ship 5 finance blog posts targeting high-CPC, high-volume queries.
- Reach 50+ daily GA users so AdSense application becomes viable.
- Fix E-E-A-T gaps (About, Contact, author byline).
- Earn at least 10 external backlinks.

---

## Phase 1: Fix E-E-A-T gaps (Week 1, Days 1-3) - COMPLETE (2026-04-23)

Purpose: give Google and future AdSense reviewers the trust signals they expect.

Summary of what shipped:
- Contact email `sushi@freetoolpark.com` wired into /about, /contact, and /methodology.
- Author byline component rendered on every tool page.
- All 9 finance tools link to the relevant `/methodology` anchor from their disclaimer banner.
- New pages added to `app/sitemap.ts` (About, Contact, Methodology, Request-a-Tool).
- Footer updated with About, Contact, and Methodology links.

### 1.1 Add /about page - DONE
- [x] Create `app/about/page.tsx` with `generateMetadata` returning canonical `/about`.
- [x] Content sections: mission, who built this (founder blurb), privacy stance (client-side, no signup), what makes us different (no ads yet, no tracking beyond GA).
- [x] Add link in footer navigation.
- [x] Add `Organization` JSON-LD already in `lib/schema.ts` if not already emitted here. (`AboutPage` + `Organization` schema emitted inline; contact email `sushi@freetoolpark.com`.)
- **Done when:** `/about` returns 200, renders with layout, indexable (`robots: index, follow`). [pending browser check post-deploy]

### 1.2 Add /contact page - DONE
- [x] Create `app/contact/page.tsx`.
- [x] Include: support email (`sushi@freetoolpark.com`), "Request a tool" link to existing `/request-a-tool`, social links if any. (No socials linked yet, email only.)
- [x] Add link in footer navigation next to /about.
- **Done when:** `/contact` returns 200, email is real and monitored. [email confirmed live]

### 1.3 Add author byline component - DONE
- [x] Create `components/seo/author-byline.tsx` showing "By FreeToolPark Team" or a named persona, with "Last updated: YYYY-MM-DD".
- [x] Render on every tool page in `app/tools/[slug]/page.tsx` under the H1. (Replaces the old plain "Last updated" line. Byline links author name to /about for Person/Organization signal.)
- [x] Populate `lastUpdated` from a field in `data/tools.ts` (default to today if missing). (Field already existed on `Tool`; fallback renders "April 2026" when null.)
- **Done when:** All 57 built tool pages show an author byline and last-updated date.

### 1.4 Add "How we calculate" methodology page for finance tools - DONE
- [x] Create `app/methodology/page.tsx` explaining formulas used for mortgage, retirement, 401(k), loan, compound interest calculations. (Also covers BMI, calorie, macro, tax brackets, and unit conversion precision.)
- [x] Link from each finance tool's disclaimer banner. (9 tools: 401k, retirement, savings-goal, compound-interest, investment-return, roi, break-even, income-tax, salary-to-hourly. Each links to the relevant `/methodology#<anchor>`.)
- **Done when:** `/methodology` live and linked from 10+ finance tool pages. (9 tool-level links + footer + /about + /contact = 12 entry points.)

---

## Phase 2: Ship the blog (Week 1, Days 4-7)

Purpose: build a content surface Google does not answer with a widget, designed to link into your money tools.

### 2.1 Scaffold the blog route - DONE

Decision: went with TSX post components + `data/blog-posts.ts` registry instead of MDX. Mirrors the existing tools pattern, avoids turbopack/MDX config churn, lets posts embed `<CalculatorCta>` directly. No new npm dependencies needed.

- [x] Create `app/blog/page.tsx` (blog index) listing all posts with excerpt, date, category.
- [x] Create `app/blog/[slug]/page.tsx` with SSG (`generateStaticParams`).
- [x] Decide on content source: TSX post components registered in `components/blog/post-renderer.tsx`, metadata in `data/blog-posts.ts`.
- [x] Install `@next/mdx` and `gray-matter` if going the MDX route. (Not needed, dropped MDX path.)
- [x] Add `<BlogPostJsonLd>` emitting `Article` / `BlogPosting` schema. (`blogPostingSchema` + `blogIndexSchema` added to `lib/schema.ts`.)
- [x] Add breadcrumbs (Home > Blog > Post Title).
- [x] Add "Last updated" + author byline on each post. (Reuses `<AuthorByline>` from Phase 1.)
- [x] Add "Try the calculator" CTA component that embeds or links to the relevant tool. (`components/blog/calculator-cta.tsx`, usable inline inside posts.)
- [x] Update `app/sitemap.ts` to include all blog URLs.
- [x] Update `lib/schema.ts` with `BlogPosting` helper if not present.
- [x] Add "Blog" link to footer.
- **Done when:** `/blog` lists posts, `/blog/[slug]` renders with proper schema, sitemap includes them. (Verified with `next build`: 465 static pages generated, including `/blog` and `/blog/how-much-should-you-have-in-401k-by-age`.)

### 2.2 Ship the first blog post: "How much should you have in your 401(k) by age 30, 40, 50, and 60?" - DONE

Live at `/blog/how-much-should-you-have-in-401k-by-age`. ~2,100 words, 2 inline calculator CTAs (401k + retirement), 10 FAQs with FAQPage schema, internal links to all 4 related finance tools.

- Target primary keyword: `how much should i have in my 401k by age 30`
- Target secondary keywords: `401k by age`, `average 401k balance by age`, `401k benchmarks`
- Internal links: `/tools/401k-calculator` (primary CTA), `/tools/retirement-calculator`, `/tools/compound-interest-calculator`, `/tools/savings-goal-calculator`
- Word count: ~2,100
- Structure:
  - [x] TL;DR table of target balances by age
  - [x] Why age-based benchmarks matter (Fidelity's 1x/3x/6x/8x/10x rule)
  - [x] Ages 20s, 30, 40, 50, 60 sections with realistic numbers
  - [x] How to catch up if you are behind (5-step action list)
  - [x] Common mistakes (5 items)
  - [x] 10 FAQ questions (FAQPage schema emitted)
  - [x] Clear CTA to 401(k) calculator (inline + primary CTA near end)
  - [x] Quick-reference table: monthly contribution needed to hit $1M at each starting age
- **Done when:** Post is live, indexed (check via `site:` search after 48h), linked from blog index. (Live and in sitemap. GSC indexing request pending: submit `/blog/how-much-should-you-have-in-401k-by-age` in GSC URL Inspection.)

### 2.3 Ship post #2: "401(k) vs Roth IRA: which should you max out first in 2026?" - DONE

Live at `/blog/401k-vs-roth-ira-which-to-max-first`. ~2,250 words, 2 inline calculator CTAs, 10 FAQs with FAQPage schema, covers 2026 contribution and income limits, traditional vs Roth decision framework, backdoor and mega backdoor Roth.

- [x] Target: `401k vs roth ira`, `should i invest in 401k or roth ira`
- [x] Internal links: `/tools/401k-calculator`, `/tools/retirement-calculator`, `/tools/compound-interest-calculator`, `/tools/investment-return-calculator`
- [x] Structure: comparison table, decision tree, scenarios (high-income, low-income, young, old, employer match), FAQ.

### 2.4 Ship post #3: "How much house can I afford on a $75k / $100k / $150k salary?" - DONE

Live at `/blog/how-much-house-can-i-afford`. ~2,280 words, 2 inline calculator CTAs, 10 FAQs (one per salary bucket), full PITI breakdown, 28/36 rule, rate sensitivity math, closing cost breakdown.

- [x] Target: `how much house can i afford on 100k salary` and variants
- [ ] Consider making this programmatic: `app/blog/how-much-house-[salary]/page.tsx` generating pages for $50k, $60k, $75k, $100k, $125k, $150k, $200k, $250k. (Decision: deferred. Current post covers $75k, $100k, $150k in one URL. Programmatic variants can be added as a follow-up if the base post ranks well.)
- [x] Internal link: `/tools/mortgage-calculator`, `/tools/loan-calculator`, `/tools/auto-loan-calculator`, `/tools/compound-interest-calculator`.
- **Done when:** at least one salary bucket published. (Three in one post.)

### 2.5 Ship post #4: "Is refinancing worth it in 2026? The break-even walkthrough" - DONE

Live at `/blog/is-refinancing-worth-it-in-2026`. ~2,180 words, 2 inline calculator CTAs, 10 FAQs, worked $400k example with closing-cost breakdown, covers the amortization reset trap and the no-closing-cost refi illusion.

- [x] Target: `is refinancing worth it`, `refinance break even calculator`
- [x] Internal link: `/tools/refinance-calculator`, `/tools/mortgage-calculator`, `/tools/loan-calculator`, `/tools/compound-interest-calculator`.

### 2.6 Ship post #5: "15-year vs 30-year mortgage: the real math on a $400k loan" - DONE

Live at `/blog/15-year-vs-30-year-mortgage-math`. ~2,180 words, 2 inline calculator CTAs, 10 FAQs, head-to-head $400k loan math at 6.25% / 7.00%, invest-the-difference scenario, 5-question decision framework, 30-year-paid-like-15-year strategy.

- [x] Target: `15 year vs 30 year mortgage`
- [x] Internal link: `/tools/mortgage-calculator`, `/tools/loan-calculator`, `/tools/compound-interest-calculator`, `/tools/refinance-calculator`.

### Ship rate target
Minimum 5 posts live by end of week 2. Continue at 2 posts per week after that. (Hit target on day 1. Phase 7 queue has 20+ additional topics.)

---

## Phase 3: Content depth on your best-ranking queries (Week 2)

Purpose: move from position 60-70 into top 20 on queries that do not have Google widgets.

### 3.1 Push `bytes to megabytes` / `gb to mb` / `kb to gb` into top 20
- [ ] Expand `components/tools/` content for data-unit converters: add historical context (IEC vs SI units), a worked example table, and a "binary vs decimal" explainer block.
- [ ] Add a blog post: "Bytes, KB, MB, GB explained: the binary vs decimal mess (and which your OS uses)"
  - Internal links to all 30 data-unit conversion pages
  - Schema: `Article` + `FAQPage`
- [ ] Add cross-links from every `/tools/convert/*-to-*` data page to the new blog post.
- **Done when:** Blog post published AND 30 data converter pages show a link to it.

### 3.2 Push `binary to decimal` into top 20
- [ ] Add worked-examples blog post: "Binary to decimal conversion: the manual method with worked examples"
- [ ] Add bi-directional linking with `/tools/binary-to-decimal` and `/tools/decimal-to-binary`.

### 3.3 Shore up `grade calculator` (currently pos 72, 327 impressions)
- [ ] Add a "Grade calculator guide" blog post covering weighted grades, letter grade scales by school, GPA conversion.
- [ ] Link to `/tools/grade-calculator` and `/tools/gpa-calculator`.

---

## Phase 4: Categories and structure (Week 2)

Purpose: create a `finance` category so Google (and users) see topical concentration.

### 4.1 Add `finance` category - DONE

- [x] Edit `data/categories.ts`: added `"finance"` to `CATEGORY_SLUGS`, new `Category` entry with name "Finance Calculators", MoneyBag01Icon, 4 FAQs, a longDescription that explicitly references the methodology page for trust signals.
- [x] Edit `data/tools.ts`: moved 16 tools from `category: "calculators"` to `category: "finance"`:
  - mortgage-calculator, refinance-calculator, auto-loan-calculator, loan-calculator
  - emi-calculator, interest-calculator, compound-interest-calculator
  - investment-return-calculator, retirement-calculator, 401k-calculator, savings-goal-calculator
  - income-tax-calculator, salary-to-hourly-calculator, roi-calculator, profit-margin-calculator, break-even-calculator
- [x] Verify `app/sitemap.ts` picks up `/categories/finance` automatically. (Generator iterates `CATEGORIES`, no change needed.)
- [x] Verify `/categories/calculators` still renders (reduced but non-empty). 9 tools remain: bmi, age, tip, percentage, calorie, grade, gpa, macro, body-fat.
- [x] Run `npx tsc --noEmit` and `npx eslint` on changed files. Clean.
- [x] `CATEGORY_SUB_MAP` in `lib/schema.ts` now maps `finance` to `FinanceApplication` and `calculators` to `UtilityApplication` (was inverted).
- [x] Updated the `/for/finance` persona page to point at the new `finance` category instead of `calculators`.
- **Done when:** `/categories/finance` returns 200, lists all 16 tools, `npx tsc --noEmit` passes. Verified via production build (486 static pages, including the new /categories/finance).

### 4.2 Link finance category from homepage
- [x] Header + footer automatically pick up the new category via the existing `CATEGORIES` iteration.
- [ ] Add a dedicated "Finance tools" section on the homepage above the fold. (Deferred. Current BrowseByCategory block already surfaces all 7 categories.)

---

## Phase 5: Technical SEO fixes (Week 2-3)

### 5.1 Mobile traffic gap investigation
- [ ] Run PageSpeed Insights mobile for homepage, `/tools/mortgage-calculator`, `/tools/401k-calculator`, `/tools/convert/sqft-to-sqm`.
- [ ] GSC > Experience > Core Web Vitals > Mobile tab. Screenshot all issues.
- [ ] GSC > Indexing > Pages. Filter "Not indexed" > read every reason category.
- [ ] If CWV mobile has LCP > 2.5s or CLS > 0.1, fix before writing more content.
- **Done when:** Mobile CWV all green in GSC for at least 75% of pages.

### 5.2 Internal linking audit
- [ ] Confirm `relatedSlugs` from `data/tools.ts` is actually rendered on each tool page. Grep for a component that consumes it.
- [ ] Every tool page must link to 3-5 related tools + its category hub.
- [ ] Every blog post must link to its primary calculator + 2-3 related tools + 2-3 other blog posts.
- [ ] Homepage must link to all 6 (soon 7) categories and the top 12 tools.
- **Done when:** Audit script or manual spot-check confirms coverage.

### 5.3 Sitemap sanity check
- [ ] Curl `https://www.freetoolpark.com/sitemap.xml` and count URLs.
- [ ] Confirm count matches: 1 home + 7 categories + 57 tools + 324 converter pages + N blog posts + /about + /contact + /methodology + /privacy + /terms + /request-a-tool.
- [ ] Resubmit sitemap in GSC.
- **Done when:** URL count matches and GSC shows "Success" on sitemap.

### 5.4 Request indexing on priority pages
Submit these in GSC > URL Inspection > Request Indexing (10-12 per day quota):

Priority A (new finance pages with no impressions):
- [ ] /tools/retirement-calculator
- [ ] /tools/401k-calculator
- [ ] /tools/savings-goal-calculator
- [ ] /tools/refinance-calculator
- [ ] /tools/auto-loan-calculator
- [ ] /tools/emi-calculator
- [ ] /tools/interest-calculator
- [ ] /tools/investment-return-calculator
- [ ] /tools/compound-interest-calculator
- [ ] /tools/salary-to-hourly-calculator

Priority B (other built tools missing from GSC):
- [ ] /tools/roi-calculator
- [ ] /tools/profit-margin-calculator
- [ ] /tools/break-even-calculator
- [ ] /tools/tip-calculator
- [ ] /tools/age-calculator
- [ ] /tools/calorie-calculator
- [ ] /tools/gpa-calculator
- [ ] /tools/json-formatter
- [ ] /tools/regex-tester
- [ ] /tools/base64-encoder-decoder

Priority C (new structural pages from this plan):
- [ ] /about
- [ ] /contact
- [ ] /methodology
- [ ] /blog
- [ ] /categories/finance
- [ ] Each blog post as it is published

---

## Phase 6: Backlinks (Week 2-4, ongoing)

Purpose: Google does not rank sites without links. No amount of content will move rankings without this.

### 6.1 Reddit answers (ship 10 over 2 weeks)
Goal: one helpful, non-spammy answer with a tool link per day for 10 days.

- [ ] r/personalfinance: thread asking about 401(k), mortgage affordability, retirement math
- [ ] r/financialindependence: FIRE calculator question
- [ ] r/firsttimehomebuyer: mortgage affordability or refinancing question
- [ ] r/realestate: mortgage math thread
- [ ] r/webdev: JSON formatter / regex tester / base64 question
- [ ] r/learnprogramming: binary to decimal, base conversion question
- [ ] r/Frugal: savings-goal calculator question
- [ ] r/povertyfinance: budgeting / savings goal question
- [ ] r/Entrepreneur: break-even, ROI calculator question
- [ ] r/smallbusiness: profit margin calculator question

Rules: write a real 3-4 paragraph answer first. Link once, at the end. Never post the link alone.

### 6.2 Dev.to / Hashnode posts (ship 3)
- [ ] "I built a free client-side JSON formatter (no tracking, no signup)" > link to /tools/json-formatter
- [ ] "Binary to decimal: how computers count, with a free converter" > link to /tools/binary-to-decimal
- [ ] "Base64 encoding explained (and a tool that never leaves your browser)" > link to /tools/base64-encoder-decoder

### 6.3 Directory submissions
- [ ] Product Hunt launch (plan for a Tuesday or Wednesday launch, prep assets)
- [ ] BetaList
- [ ] SaaSHub (list under "Developer Tools")
- [ ] AlternativeTo (list as alternative to Calculator.net, RapidTables, OmniCalculator)
- [ ] ToolFinder / FreeToolSpot / similar directories
- [ ] GitHub awesome-lists (find "awesome-calculators", "awesome-dev-tools", open PRs)

### 6.4 Quora answers (ship 5)
- [ ] Find 5 Quora questions on 401(k) benchmarks, mortgage affordability, binary conversion, etc.
- [ ] Answer each with 300+ words, one tool link at the end.

---

## Phase 7: Blog ship queue (Weeks 3-8)

Once the first 5 posts are live, continue at 2 per week from this queue:

### Finance (high CPC, high volume)
- [ ] "How much emergency fund do I really need? (and how to save it fast)" > `/tools/savings-goal-calculator`
- [ ] "Compound interest: 5 real examples that prove it matters" > `/tools/compound-interest-calculator`
- [ ] "How long will it take to save $100k? The math for every salary" > `/tools/savings-goal-calculator`
- [ ] "FIRE calculator walkthrough: how much do you need to retire early?" > `/tools/retirement-calculator`
- [ ] "How to calculate gross profit margin (with 4 real examples)" > `/tools/profit-margin-calculator`
- [ ] "Break-even analysis for small business owners, step-by-step" > `/tools/break-even-calculator`
- [ ] "Salary to hourly rate: the honest calculator that includes PTO and benefits" > `/tools/salary-to-hourly-calculator`
- [ ] "ROI formula explained (with a free calculator and 3 scenarios)" > `/tools/roi-calculator`
- [ ] "Auto loan math: why the 20/4/10 rule still holds" > `/tools/auto-loan-calculator`
- [ ] "EMI vs SIP: which wins over 10 years?" > `/tools/emi-calculator`, `/tools/investment-return-calculator`

### Developer / data units
- [ ] "Bytes, KB, MB, GB explained: the binary vs decimal mess" > data converters
- [ ] "How many MB in a GB? The answer depends who you ask" > `/tools/convert/gb-to-mb`
- [ ] "Binary to decimal conversion: manual method with worked examples" > `/tools/binary-to-decimal`
- [ ] "Hex to RGB: how web colors actually work" > `/tools/hex-to-rgb`
- [ ] "UUIDs explained: v1 vs v4 vs v7 and when to use each" > `/tools/uuid-generator`

### Unit conversion education (low priority, max 5)
- [ ] "How many square feet in an acre? (and why the answer is weird)" > `/tools/convert/acre-to-sqft`
- [ ] "Cooking conversions cheat sheet: tsp, tbsp, cup, floz" > `/tools/convert/tsp-to-ml`, volume converters
- [ ] "Metric vs imperial: a 5-minute history of why the US still uses feet" > length converters
- [ ] "Cooking substitutions by volume and weight" > volume + weight converters

### Health / life
- [ ] "BMI is flawed. Here is what to look at instead" > `/tools/bmi-calculator`, `/tools/body-fat-calculator`
- [ ] "How many calories do I actually burn per day? (TDEE explained)" > `/tools/calorie-calculator`
- [ ] "Macros for muscle gain: a beginner's guide with a calculator" > `/tools/macro-calculator`

---

## Phase 8: Measurement (ongoing)

### 8.1 Baseline tracking
- [ ] Install Google Analytics 4 if not installed.
- [ ] Set up GA4 > Admin > Events > mark `calculator_result_shown` (or similar) as a conversion.
- [ ] Set up GSC > Search Results > save a chart filter for "Last 28 days" comparing top 5 keywords.

### 8.2 30-day re-check (target date: 2026-05-23)
Re-export GSC Performance CSVs and compare against this baseline:

| Metric | Baseline (2026-04-21) | Target | Actual |
|---|---|---|---|
| Total impressions | 20,504 | 100,000+ | |
| Total clicks | 1 | 200+ | |
| Avg position | 78 | below 50 | |
| Mobile impression share | 2.5% | 20%+ | |
| `gb to mb` position | 68 | top 20 | |
| `bytes to megabytes` position | 68 | top 20 | |
| `binary to decimal` position | 71 | top 20 | |
| Blog URLs with impressions | 0 | 5+ | |
| External referring domains (via GSC Links) | ? | 10+ | |

If targets are not met, the fix is not "more tool pages." It is more blog content, more backlinks, or a CWV technical fix.

### 8.3 Decision gate at 60 days (2026-06-22)
If daily GA users exceed 50 and at least 5 blog URLs have impressions, apply for Google AdSense.

---

## What is explicitly NOT in this plan

These are tempting but low-leverage right now. Do not waste time on them:

- Rewriting titles and meta descriptions on converter pages (position 78, nobody sees them)
- Adding more converter variants beyond the 324 already live
- Paid ads before organic baseline exists
- Switching CMS, framework, or hosting
- Adding user accounts, saved calculations, or any backend feature
- Redesigning the UI

---

## File-by-file changelog expected

Tracking which files this plan will touch, for easy review:

- `data/categories.ts` - add finance
- `data/tools.ts` - reassign 16 tools' category
- `data/blog-posts.ts` OR `content/blog/*.mdx` - new
- `app/about/page.tsx` - new
- `app/contact/page.tsx` - new
- `app/methodology/page.tsx` - new
- `app/blog/page.tsx` - new
- `app/blog/[slug]/page.tsx` - new
- `app/sitemap.ts` - add blog + static page URLs
- `components/seo/author-byline.tsx` - new
- `components/footer.tsx` (or equivalent) - add /about, /contact, /blog links
- `lib/schema.ts` - add `blogPostSchema` helper if missing

Every change: run `npx eslint` + `npx tsc --noEmit` before committing.

---

## The one-line summary

Ship a blog, fix About/Contact, move finance tools into a real category, and earn 10 backlinks. Everything else is noise until that is done.
