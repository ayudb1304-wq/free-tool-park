export type BlogCategory =
  | "finance"
  | "developer"
  | "conversions"
  | "health"
  | "general"

export interface BlogPost {
  slug: string
  title: string
  h1: string
  metaDescription: string
  excerpt: string
  category: BlogCategory
  /** Slug of the primary tool this post promotes. */
  primaryToolSlug?: string
  /** Additional tool slugs to link from this post. */
  relatedToolSlugs?: string[]
  /** Related post slugs for internal linking. */
  relatedPostSlugs?: string[]
  /** Approximate reading time in minutes. */
  readingTimeMinutes: number
  /** Publish date in ISO YYYY-MM-DD. */
  publishedDate: string
  /** Last update date in ISO YYYY-MM-DD. */
  lastUpdated: string
  /** Author display name. */
  author: string
  /** Keywords for meta tags. */
  keywords: string[]
  /** FAQ block rendered at the bottom of the post (also used for FAQPage schema). */
  faqs: { question: string; answer: string }[]
  /** Table of contents entries, one per H2 in the post. Used for the sticky side nav. */
  tableOfContents: { id: string; label: string }[]
}

/**
 * Slugs that have a published React post component.
 * Kept here (not in the renderer) so server modules like the sitemap can
 * import it without pulling in `next/dynamic`.
 */
export const PUBLISHED_BLOG_SLUGS = new Set<string>([
  "how-much-should-you-have-in-401k-by-age",
  "401k-vs-roth-ira-which-to-max-first",
  "how-much-house-can-i-afford",
  "is-refinancing-worth-it-in-2026",
  "15-year-vs-30-year-mortgage-math",
])

export function isBlogPostPublished(slug: string): boolean {
  return PUBLISHED_BLOG_SLUGS.has(slug)
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-much-should-you-have-in-401k-by-age",
    title: "How Much Should You Have in Your 401(k) by Age 30, 40, 50, and 60?",
    h1: "How much should you have in your 401(k) by age 30, 40, 50, and 60?",
    metaDescription:
      "Age-based 401(k) benchmarks using Fidelity's 1x/3x/6x/8x/10x salary rule, with realistic catch-up strategies if you are behind. Free calculator included.",
    excerpt:
      "A practical, age-by-age breakdown of what your 401(k) balance should look like using Fidelity's salary-multiple rule, plus realistic catch-up strategies if you are behind.",
    category: "finance",
    primaryToolSlug: "401k-calculator",
    relatedToolSlugs: [
      "retirement-calculator",
      "compound-interest-calculator",
      "savings-goal-calculator",
    ],
    readingTimeMinutes: 10,
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
    author: "FreeToolPark Team",
    keywords: [
      "how much should i have in my 401k by age 30",
      "401k by age",
      "average 401k balance by age",
      "401k benchmarks",
      "401k savings by age",
      "retirement savings by age",
      "fidelity 401k rule",
    ],
    faqs: [
      {
        question: "What is the average 401(k) balance by age?",
        answer:
          "Averages from major plan administrators tend to land around $15,000 for people in their 20s, $60,000 in their 30s, $150,000 in their 40s, $250,000 in their 50s, and $280,000 in their 60s. Averages are skewed by high earners, so medians are usually lower. Benchmarks based on multiples of your salary (1x by 30, 3x by 40, 6x by 50, 8x by 60, 10x by 67) are a better guide than averages.",
      },
      {
        question: "How much should a 30 year old have in their 401(k)?",
        answer:
          "The widely cited Fidelity rule is 1x your annual salary by age 30. If you earn $70,000, that means $70,000 in retirement accounts by 30. If you are behind, maxing out the employer match and bumping your contribution by 1 to 2% each raise will close the gap fast because of compounding.",
      },
      {
        question: "How much should a 40 year old have in their 401(k)?",
        answer:
          "3x your annual salary is the target by 40. At a $90,000 salary, that is $270,000. Being below this is common and recoverable: increase contributions, use catch-up contributions at 50, and extend your working years if needed.",
      },
      {
        question: "How much should a 50 year old have in their 401(k)?",
        answer:
          "6x your salary by 50 is the Fidelity benchmark. People 50 and older can also contribute an extra $7,500 per year as catch-up. For 60 to 63 year olds in 2026, the super catch-up (SECURE 2.0) raises that to $11,250.",
      },
      {
        question: "How much should a 60 year old have in their 401(k)?",
        answer:
          "8x your annual salary by 60, scaling to 10x by age 67. If you plan to retire at 62, you likely need to be closer to 10x earlier to cover the gap years before Social Security.",
      },
      {
        question: "What is the 2026 401(k) contribution limit?",
        answer:
          "$23,500 base for all employees, plus a $7,500 catch-up if you are 50 or older, and a $11,250 super catch-up if you are between 60 and 63 (SECURE 2.0 rule). Employer matching contributions do not count against these limits.",
      },
      {
        question: "How do I catch up if I have nothing saved at 40?",
        answer:
          "Three levers: raise your contribution rate aggressively (aim for 15 to 20% of salary), capture the full employer match, and use catch-up contributions once you turn 50. Our 401(k) calculator lets you model exactly what you need to contribute to reach any target balance by retirement.",
      },
      {
        question: "Should I include my employer match in my 401(k) balance?",
        answer:
          "Yes, if it is vested. Vested employer contributions are your money. Unvested contributions are not yours yet and should not count toward benchmark comparisons.",
      },
      {
        question: "Is 10% of my salary enough to save for retirement?",
        answer:
          "For most people starting in their 20s, 10 to 15% of gross salary (including employer match) is a reasonable target. If you started later, push that number up. Our retirement calculator shows exactly what contribution rate gets you to your retirement goal given your current age and balance.",
      },
      {
        question: "What assumed return should I use in retirement projections?",
        answer:
          "Historical S&P 500 returns average around 10% nominal or 7% after inflation. For planning, 6 to 7% real return is a conservative assumption for a stock-heavy portfolio. Use 4 to 5% if you want to stress-test or if you are close to retirement with a bond-heavier allocation.",
      },
    ],
    tableOfContents: [
      { id: "why-salary-multiples", label: "Why salary multiples beat dollar targets" },
      { id: "in-your-20s", label: "In your 20s" },
      { id: "age-30", label: "By 30: 1x salary" },
      { id: "age-40", label: "By 40: 3x salary" },
      { id: "age-50", label: "By 50: 6x salary + catch-up" },
      { id: "age-60", label: "By 60: 8x salary" },
      { id: "catch-up", label: "How to catch up" },
      { id: "mistakes", label: "Common mistakes" },
      { id: "catch-up-numbers", label: "Contribution reference table" },
      { id: "next-steps", label: "What to do next" },
    ],
  },
  {
    slug: "401k-vs-roth-ira-which-to-max-first",
    title:
      "401(k) vs Roth IRA: Which Should You Max Out First in 2026?",
    h1: "401(k) vs Roth IRA: which should you max out first in 2026?",
    metaDescription:
      "401(k) vs Roth IRA in 2026: which to max out first, 2026 contribution limits, income limits, and the order that works for most earners.",
    excerpt:
      "The order almost everyone should follow in 2026: match first, Roth IRA second, rest of the 401(k) third. The tax math, limits, and the cases where it flips.",
    category: "finance",
    primaryToolSlug: "401k-calculator",
    relatedToolSlugs: [
      "retirement-calculator",
      "compound-interest-calculator",
      "investment-return-calculator",
    ],
    relatedPostSlugs: [
      "how-much-should-you-have-in-401k-by-age",
    ],
    readingTimeMinutes: 11,
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
    author: "FreeToolPark Team",
    keywords: [
      "401k vs roth ira",
      "should i invest in 401k or roth ira",
      "401k vs roth ira which is better",
      "max out 401k or roth ira first",
      "roth ira income limits 2026",
      "mega backdoor roth",
      "roth 401k vs roth ira",
    ],
    faqs: [
      {
        question: "Should I max out my 401(k) or Roth IRA first in 2026?",
        answer:
          "Max your 401(k) up to the employer match first, then max the Roth IRA at $7,500, then go back and push the 401(k) toward the $23,500 limit. The match is a 50 to 100% instant return, the Roth IRA gives you more investment choice than any 401(k) plan, and the rest of the 401(k) is still valuable pre-tax space.",
      },
      {
        question: "What is the 2026 Roth IRA contribution limit?",
        answer:
          "$7,500 if you are under 50, and $8,500 if you are 50 or older (that is the $7,500 base plus a $1,000 catch-up). The limits are the same for both Roth and traditional IRA, and the total across both account types cannot exceed the limit.",
      },
      {
        question: "What are the Roth IRA income limits for 2026?",
        answer:
          "Single filers get the full contribution up to $150,000 of modified AGI, with phase-out between $150,000 and $165,000. Married filing jointly gets the full contribution up to $236,000, phasing out between $236,000 and $246,000. Above those ceilings you cannot contribute directly but can use a backdoor Roth.",
      },
      {
        question: "Is a Roth 401(k) better than a Roth IRA?",
        answer:
          "A Roth IRA is usually better for the first $7,500 because it has more investment choice, no required minimum distributions, and often lower fees. A Roth 401(k) lets you contribute far more ($23,500 vs $7,500), so once you max the Roth IRA, Roth 401(k) is the right place for additional Roth dollars.",
      },
      {
        question: "What tax bracket makes Roth better than traditional?",
        answer:
          "If you are in the 12 or 22% bracket, Roth usually wins because today's rates are historically low and you are likely to be in a similar or higher bracket later. At 32, 35, or 37%, traditional almost always wins because the current-year deduction is so large that even a moderate drop in retirement rates beats Roth.",
      },
      {
        question: "Can I contribute to both a 401(k) and a Roth IRA in the same year?",
        answer:
          "Yes. The 401(k) limit ($23,500 base) and the Roth IRA limit ($7,500 base) are separate. You can fully fund both if your income allows for the Roth, which adds up to $31,000 of tax-advantaged contributions per year (or more with catch-ups after 50).",
      },
      {
        question: "What is a backdoor Roth IRA and do I need it?",
        answer:
          "A backdoor Roth is a non-deductible traditional IRA contribution followed by a conversion to Roth, used by people whose income exceeds the direct Roth limits ($165,000 single / $246,000 married). You need it if you earn above those thresholds and still want Roth IRA space. Watch out for the pro-rata rule if you have existing pre-tax IRA balances.",
      },
      {
        question: "How much should I contribute to my 401(k) to get the full match?",
        answer:
          "Contribute at least whatever percentage your employer matches. The most common formula is 50% of the first 6% of your pay, which means you need to contribute 6% to get the full 3% match. Check your plan's summary plan description, then set your contribution rate to at least that threshold.",
      },
      {
        question: "What is the mega backdoor Roth and how much can I contribute?",
        answer:
          "It is a strategy where you make after-tax 401(k) contributions (not the same as Roth 401(k)) and immediately convert them to Roth. You can potentially add $30,000 to $42,500 or more per year to a Roth, depending on the employer match and your regular contributions, with a total 401(k) cap of $72,000 in 2026. Your plan must allow after-tax contributions and in-service conversions.",
      },
      {
        question: "If I can only save a little, should it go into a 401(k) or a Roth IRA?",
        answer:
          "Always get the full 401(k) employer match first, even if that is all you can afford. If you have room beyond the match, direct the next dollars into a Roth IRA up to $7,500 because you get better investment options and tax-free withdrawals. Go back to the 401(k) only after the Roth is full.",
      },
    ],
    tableOfContents: [
      { id: "order-of-operations", label: "The order of operations" },
      { id: "tax-treatment", label: "How the tax math works" },
      { id: "2026-limits", label: "2026 contribution limits" },
      { id: "roth-income-limits", label: "Roth IRA income limits + backdoor" },
      { id: "scenario-middle", label: "Scenario: $85k salary" },
      { id: "scenario-high", label: "Scenario: $240k combined" },
      { id: "when-roth-wins", label: "When Roth beats traditional" },
      { id: "when-traditional-wins", label: "When traditional beats Roth" },
      { id: "roth-401k", label: "Roth 401(k) vs Roth IRA" },
      { id: "mega-backdoor", label: "Mega backdoor Roth" },
      { id: "state-tax", label: "State tax considerations" },
      { id: "cannot-max-both", label: "If you can't max both" },
      { id: "decision-framework", label: "Decision framework" },
      { id: "next-steps", label: "What to do this week" },
    ],
  },
  {
    slug: "how-much-house-can-i-afford",
    title:
      "How Much House Can I Afford on a $75k, $100k, or $150k Salary?",
    h1: "How much house can I afford on a $75k, $100k, or $150k salary?",
    metaDescription:
      "The answer to how much house can I afford on $75k, $100k, or $150k: use the 28/36 rule, PITI math, and a 7% rate to get a defensible home price.",
    excerpt:
      "How much house can you actually afford at $75k, $100k, or $150k? The 28/36 rule, full PITI breakdown, down payment reality, and rate sensitivity with current 2026 numbers.",
    category: "finance",
    primaryToolSlug: "mortgage-calculator",
    relatedToolSlugs: [
      "loan-calculator",
      "auto-loan-calculator",
      "compound-interest-calculator",
    ],
    relatedPostSlugs: [
      "15-year-vs-30-year-mortgage-math",
      "is-refinancing-worth-it-in-2026",
    ],
    readingTimeMinutes: 11,
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
    author: "FreeToolPark Team",
    keywords: [
      "how much house can i afford on 100k salary",
      "how much mortgage can i afford",
      "house affordability calculator",
      "28/36 rule mortgage",
      "how much house can i afford on 75k salary",
      "how much house can i afford on 150k salary",
      "PITI breakdown",
    ],
    faqs: [
      {
        question: "How much house can I afford on a $75k salary?",
        answer:
          "Around $255,000 to $280,000 in an average property-tax state, using the 28% rule at a 7% mortgage rate with 10 to 20% down. Gross monthly is $6,250, so max PITI is about $1,750. In a high-tax state like New Jersey or Illinois, drop that estimate by $20,000 to $30,000.",
      },
      {
        question: "How much house can I afford on a $100k salary?",
        answer:
          "Roughly $350,000 using the conservative 28% rule with 20% down and a 7% rate. A lender might stretch you to $475,000 by pushing DTI to 40%, but that leaves your budget tight for retirement, childcare, and normal life expenses. In a high property-tax state, the comfortable number drops closer to $310,000.",
      },
      {
        question: "How much house can I afford on a $150k salary?",
        answer:
          "About $530,000 at the 28% housing ratio with 20% down, a 7% rate, and average property taxes. Stretch to 33% DTI and a lender will approve closer to $625,000. In low-tax states like Colorado or Tennessee, you can typically add $30,000 to $40,000 to those figures.",
      },
      {
        question: "What is the 28/36 rule for mortgages?",
        answer:
          "Housing costs (PITI + HOA) should stay under 28% of gross monthly income, and total debt payments under 36%. So a $100k earner has a $2,333 monthly housing ceiling and a $3,000 total debt ceiling. Lenders often approve higher ratios, up to 45 to 50% DTI, but those loans usually leave buyers stressed.",
      },
      {
        question: "Do I really need 20% down to buy a house?",
        answer:
          "No. The median first-time buyer puts down about 8%. Conventional loans go as low as 3%, FHA loans start at 3.5%, and VA loans require nothing. Under 20% means paying PMI (or FHA MIP), which adds $100 to $400 per month until you reach 20% equity.",
      },
      {
        question: "What monthly payment can I afford on a $100k salary?",
        answer:
          "Around $2,333/month for total PITI using the 28% rule, or about $1,625/month (25% of take-home) if you want room for retirement and normal expenses. Banks may approve up to $3,300/month but that pushes housing above 40% of gross.",
      },
      {
        question: "How much does a 1% change in mortgage rates affect affordability?",
        answer:
          "Roughly 10 to 12% of buying power per percentage point. A buyer who qualifies for a $356,000 home at 7% qualifies for about $395,000 at 6% on the same monthly budget. That is why rate drops tend to push home prices up.",
      },
      {
        question: "How much should I save for closing costs?",
        answer:
          "Plan for 2 to 5% of the loan amount, on top of your down payment. On a $350,000 home with 10% down, that means $7,000 to $17,500 in cash for lender fees, title insurance, appraisal, and prepaid taxes. Some sellers will cover part of it through concessions.",
      },
      {
        question: "Is the FHA 3.5% down payment a good deal?",
        answer:
          "It gets you in the door with weaker credit and less cash, but the MIP (mortgage insurance premium) typically lasts the life of the loan if you put down under 10%. Most FHA buyers refinance into a conventional loan once they have 20% equity, which adds thousands in refi costs. Factor that in.",
      },
      {
        question: "How much of my income should actually go toward my mortgage?",
        answer:
          "Target 25% of take-home pay or less for total PITI. That is more conservative than the 28% of gross rule, because it accounts for taxes and retirement contributions. On a $100k salary with $6,500 monthly take-home, that works out to $1,625/month.",
      },
    ],
    tableOfContents: [
      { id: "the-28-36-rule", label: "The 28/36 rule" },
      { id: "piti", label: "What PITI includes" },
      { id: "down-payment", label: "Down payment reality" },
      { id: "100k-scenario", label: "Walkthrough: $100k salary" },
      { id: "75k-150k", label: "$75k and $150k salaries" },
      { id: "hidden-costs", label: "Costs nobody mentions" },
      { id: "rate-sensitivity", label: "Rate sensitivity" },
      { id: "priced-out", label: "If you're priced out" },
      { id: "stress-test", label: "Stress-test your budget" },
      { id: "next-steps", label: "What to do next" },
    ],
  },
  {
    slug: "is-refinancing-worth-it-in-2026",
    title: "Is Refinancing Worth It in 2026? The Break-Even Walkthrough",
    h1: "Is refinancing worth it in 2026? The break-even walkthrough",
    metaDescription:
      "Is refinancing worth it in 2026? Real break-even math on a $400K example, closing cost breakdown, and the 6-line checklist before you refinance.",
    excerpt:
      "The honest break-even math on refinancing in 2026, with a $400,000 worked example, closing cost ranges, and the amortization reset trap most people miss.",
    category: "finance",
    primaryToolSlug: "refinance-calculator",
    relatedToolSlugs: [
      "mortgage-calculator",
      "loan-calculator",
      "compound-interest-calculator",
    ],
    relatedPostSlugs: [
      "15-year-vs-30-year-mortgage-math",
      "how-much-house-can-i-afford",
    ],
    readingTimeMinutes: 11,
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
    author: "FreeToolPark Team",
    keywords: [
      "is refinancing worth it",
      "refinance break even calculator",
      "when to refinance mortgage",
      "refinance break even point",
      "is refinancing worth it 2026",
      "mortgage refinance rules of thumb",
      "no closing cost refinance",
    ],
    faqs: [
      {
        question: "Is refinancing worth it in 2026?",
        answer:
          "It depends on your current rate and how long you will stay in the house. If your rate is 0.75% or more above today's market rate and you plan to stay past your break-even point (usually 2 to 5 years), yes. If you locked in a sub-4% rate during 2020 to 2022, no.",
      },
      {
        question: "How do I calculate my refinance break-even point?",
        answer:
          "Divide your total closing costs by your monthly payment savings. If closing costs are $6,000 and you save $300 per month, your break-even is 20 months. Stay in the home past that date and the refi pays off.",
      },
      {
        question: "What is the rule of thumb for refinancing?",
        answer:
          "The common rule is refinance if you can drop your rate by at least 0.75 to 1% and you will stay in the home long enough to recover closing costs. The old 2% rule is outdated in the 2026 rate environment because closing costs relative to loan size have shifted.",
      },
      {
        question: "How much does it cost to refinance a mortgage?",
        answer:
          "Expect to pay 2 to 5% of the loan amount in closing costs. On a $400,000 refi that is $8,000 to $20,000, split across origination fees, appraisal, title insurance, recording fees, and prepaid escrow for taxes and insurance.",
      },
      {
        question: "Is a no-closing-cost refinance actually free?",
        answer:
          "No. The closing costs are either rolled into your new loan balance (so you pay interest on them for 30 years) or paid via a higher interest rate (typically 0.25 to 0.5% above market). It can make sense if you will move again within 3 years but usually costs more long-term.",
      },
      {
        question: "Does refinancing reset my mortgage term?",
        answer:
          "Yes, by default. Going from 25 years remaining to a new 30-year loan adds 5 years to your payoff timeline and can increase total lifetime interest even at a lower rate. Fix this by refinancing to a shorter term or by continuing to make your old higher payment on the new loan.",
      },
      {
        question: "What credit score do I need to refinance in 2026?",
        answer:
          "You need at least a 620 for conventional refinances and 580 for FHA Streamline refinances. The best rates usually go to scores of 740 and above. Going from a 680 to a 760 score can shave 0.375 to 0.5% off your rate.",
      },
      {
        question: "Is cash-out refinance interest tax deductible?",
        answer:
          "Only if you use the cash to buy, build, or substantially improve the home securing the loan. If you cash out to pay off credit cards, fund a vacation, or buy a car, the interest on that portion is not deductible under current IRS rules.",
      },
      {
        question: "How long does a refinance take to close?",
        answer:
          "Typically 30 to 45 days from application to closing in 2026. Rate lock periods of 45 to 60 days are standard and cost nothing extra. Expect appraisal, underwriting, and title work to take most of that time.",
      },
      {
        question: "Should I refinance if I have less than 10 years left on my mortgage?",
        answer:
          "Usually not. Most of each payment is already going to principal, so a lower rate saves very little. You are better off making extra principal payments instead of paying $6,000 or more in closing costs for marginal savings.",
      },
    ],
    tableOfContents: [
      { id: "rate-environment", label: "The 2026 rate environment" },
      { id: "break-even-math", label: "Break-even math ($400k example)" },
      { id: "closing-costs", label: "What closing costs look like" },
      { id: "cash-out-vs-rate-term", label: "Cash-out vs rate-and-term" },
      { id: "no-cost-trap", label: "The \"no-cost\" refi trap" },
      { id: "amortization-reset", label: "The amortization reset" },
      { id: "arm-to-fixed", label: "ARM to fixed refi" },
      { id: "when-refi-fails", label: "When refi doesn't work" },
      { id: "checklist", label: "The 6-line checklist" },
      { id: "next-steps", label: "What to do next" },
    ],
  },
  {
    slug: "15-year-vs-30-year-mortgage-math",
    title: "15-Year vs 30-Year Mortgage: The Real Math on a $400k Loan",
    h1: "15-year vs 30-year mortgage: the real math on a $400k loan",
    metaDescription:
      "15-year vs 30-year mortgage on a $400k loan: full interest math, invest-the-difference scenario, and a 5-question framework to pick the right term.",
    excerpt:
      "The real math on a $400,000 mortgage at 2026 rates. The 15-year saves $341k in interest. The 30-year wins for most people anyway. Here is when each one is actually the right call.",
    category: "finance",
    primaryToolSlug: "mortgage-calculator",
    relatedToolSlugs: [
      "loan-calculator",
      "compound-interest-calculator",
      "refinance-calculator",
    ],
    relatedPostSlugs: [
      "how-much-house-can-i-afford",
      "is-refinancing-worth-it-in-2026",
    ],
    readingTimeMinutes: 11,
    publishedDate: "2026-04-23",
    lastUpdated: "2026-04-23",
    author: "FreeToolPark Team",
    keywords: [
      "15 year vs 30 year mortgage",
      "15 vs 30 year mortgage",
      "15 year mortgage vs 30 year",
      "should i get a 15 year mortgage",
      "15 year mortgage math",
      "mortgage term comparison",
      "mortgage interest savings",
    ],
    faqs: [
      {
        question: "Is a 15-year mortgage worth it over a 30-year?",
        answer:
          "It saves about $341,000 in interest on a $400,000 loan at current rates, but costs $769 more per month. It is worth it only if you already have a 6-month emergency fund, max your retirement accounts, and have no higher-rate debt. Otherwise the 30-year wins on flexibility.",
      },
      {
        question: "How much more is a 15-year mortgage payment than a 30-year?",
        answer:
          "On a $400,000 loan at 2026 rates (6.25% vs 7.00%), the 15-year payment is $3,430 vs $2,661 for the 30-year. That is $769 more per month, or 22.4% higher. The difference shrinks if 15-year rates are only 0.25 points below the 30-year.",
      },
      {
        question: "Should I get a 15-year mortgage if I can afford it?",
        answer:
          "\"Can afford it\" is not enough. You should also be maxing a 401(k), have no high-rate debt, and carry a full emergency fund. If all three are true and the payment stays under 28% of gross income, the 15-year is a reasonable pick. Otherwise take the 30-year.",
      },
      {
        question: "Is it smarter to take a 30-year mortgage and invest the difference?",
        answer:
          "Mathematically, yes, if you actually invest $769/month at 7% real return for 30 years. That ends around $930,000. In practice most people spend part of the difference, so the 15-year often wins through forced savings. Honesty about your own discipline is the deciding factor.",
      },
      {
        question: "How much interest do you pay on a $400,000 mortgage?",
        answer:
          "At 7.00% over 30 years, you pay about $558,000 in interest for total payments of $958,000. At 6.25% over 15 years, you pay about $217,000 in interest for total payments of $617,000. The 15-year saves roughly $341,000 in lifetime interest.",
      },
      {
        question: "Can I pay off a 30-year mortgage in 15 years?",
        answer:
          "Yes. Pay the equivalent of a 15-year monthly payment on your 30-year loan and you will finish in about 17 years. Total interest runs roughly $39,000 more than a true 15-year because of the higher rate, but you keep the option to drop back to the minimum payment anytime.",
      },
      {
        question: "Why is the 15-year mortgage rate lower than the 30-year?",
        answer:
          "Lenders see less risk in shorter loans: faster principal paydown, shorter duration exposure, and borrowers who qualify typically have stronger finances. The gap is usually 0.5 to 0.875 percentage points. In 2026 that is roughly 6.25% for 15-year vs 7.00% for 30-year on conforming loans.",
      },
      {
        question: "Does the mortgage interest deduction make the 30-year worth it?",
        answer:
          "For most households, no. The 2026 standard deduction is $30,000 married filing jointly. Year-one interest on a $400,000 loan plus the $10,000 SALT cap puts you only marginally over that, producing a tax savings of under $2,000. Never choose a loan term based on the deduction.",
      },
      {
        question: "Should I refinance my 30-year into a 15-year?",
        answer:
          "Only if the new 15-year rate is at least 0.5 points below your current 30-year rate and you plan to stay in the house long enough to recoup closing costs (typically 2 to 3% of the loan). Run the break-even math first: if it is under 3 years, the refi usually makes sense.",
      },
      {
        question: "What is the minimum income for a 15-year mortgage on a $400k loan?",
        answer:
          "Using the 28% front-end ratio and adding roughly $650/month for taxes and insurance, the $3,430 P&I pushes housing cost to about $4,080. That needs gross income of at least $175,000. A 30-year on the same loan only requires about $140,000 gross, which is why it is more accessible.",
      },
    ],
    tableOfContents: [
      { id: "the-raw-numbers", label: "Raw numbers on $400k" },
      { id: "why-most-people-take-the-30", label: "Why 30-year wins for most" },
      { id: "invest-the-difference", label: "Invest-the-difference math" },
      { id: "cash-flow-math", label: "Cash flow: the 22% gap" },
      { id: "who-should-take-15", label: "Who should take the 15-year" },
      { id: "who-should-take-30", label: "Who should take the 30-year" },
      { id: "thirty-paid-like-fifteen", label: "30-year paid like a 15" },
      { id: "refi-path", label: "Refi path: start 30, refi to 15" },
      { id: "tax-deduction", label: "The mortgage interest deduction" },
      { id: "decision-framework", label: "Decision framework" },
      { id: "next-steps", label: "Run your actual numbers" },
    ],
  },
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug)
}

export function getAllBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) =>
    b.publishedDate.localeCompare(a.publishedDate),
  )
}

export const BLOG_CATEGORY_LABELS: Record<BlogCategory, string> = {
  finance: "Finance",
  developer: "Developer",
  conversions: "Conversions",
  health: "Health",
  general: "General",
}

export function getPopulatedBlogCategories(): BlogCategory[] {
  const seen = new Set<BlogCategory>()
  for (const post of getAllBlogPosts()) {
    if (isBlogPostPublished(post.slug)) seen.add(post.category)
  }
  // Preserve a stable display order.
  const order: BlogCategory[] = [
    "finance",
    "developer",
    "conversions",
    "health",
    "general",
  ]
  return order.filter((c) => seen.has(c))
}

export function getRelatedBlogPosts(post: BlogPost, limit = 3): BlogPost[] {
  const explicit = (post.relatedPostSlugs ?? [])
    .map(getBlogPostBySlug)
    .filter((p): p is BlogPost => !!p)
  if (explicit.length >= limit) return explicit.slice(0, limit)

  const remaining = limit - explicit.length
  const byCategory = getAllBlogPosts()
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.category === post.category &&
        !explicit.some((e) => e.slug === p.slug),
    )
    .slice(0, remaining)

  return [...explicit, ...byCategory]
}
