import Link from "next/link"
import { CalculatorCta } from "@/components/blog/calculator-cta"

export default function FourOhOneKVsRothIra() {
  return (
    <>
      <div className="not-prose my-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">TL;DR</p>
        <p className="mb-3 text-sm text-muted-foreground">
          The order almost everyone should follow in 2026:
        </p>
        <ol className="ml-5 list-decimal space-y-1 text-sm text-muted-foreground">
          <li>
            Contribute to your 401(k) up to the full employer match. Stop
            there for now.
          </li>
          <li>
            Max an HSA if you have a high-deductible health plan ($4,400
            single / $8,750 family in 2026).
          </li>
          <li>
            Max a Roth IRA at $7,500 ($8,500 if you are 50 or older), income
            permitting.
          </li>
          <li>
            Go back to the 401(k) and push contributions toward the $23,500
            limit.
          </li>
          <li>
            If you still have money left, look at a taxable brokerage or a
            mega backdoor Roth if your plan allows it.
          </li>
        </ol>
        <p className="mt-3 text-xs text-muted-foreground">
          Exception: if your current marginal tax rate is above 32%, the
          traditional 401(k) usually wins the tie against a Roth IRA. The
          math for each case is below.
        </p>
      </div>

      <p>
        The short answer: get the match, then max the Roth IRA, then fill the
        rest of the 401(k). That order beats the alternatives for the large
        majority of W-2 earners. The cases where it flips are specific and
        easy to identify once you know the numbers.
      </p>

      <p>
        This post walks through the 2026 contribution limits, the tax math
        behind the decision, two worked scenarios at different incomes, and
        the edge cases that change the answer (Roth 401(k), backdoor Roth,
        mega backdoor Roth, state tax).
      </p>

      <h2 id="order-of-operations">The order of operations, explained</h2>
      <p>
        Every dollar of retirement savings has a priority score based on how
        much free money and tax benefit it carries. Ranked from highest to
        lowest:
      </p>
      <ol>
        <li>
          <strong className="text-foreground">
            401(k) up to the employer match.
          </strong>{" "}
          A 50% match on the first 6% of your pay is an instant 50% return.
          Nothing else you do with money this year will beat that. Always
          capture the full match first.
        </li>
        <li>
          <strong className="text-foreground">
            HSA (if you have a high-deductible health plan).
          </strong>{" "}
          Triple tax advantage: pre-tax contribution, tax-free growth, tax-free
          withdrawals for medical expenses. After 65 you can withdraw for
          anything at ordinary income rates, same as a traditional 401(k).
          2026 limits: $4,400 single, $8,750 family.
        </li>
        <li>
          <strong className="text-foreground">Roth IRA, up to $7,500.</strong>{" "}
          You get more investment choice than any 401(k) plan offers, no
          mandatory distributions at 73, and tax-free withdrawals in
          retirement. You can also pull contributions (not earnings) at any
          time without penalty, which makes it a quiet emergency-fund
          backup.
        </li>
        <li>
          <strong className="text-foreground">
            Rest of the 401(k), up to $23,500.
          </strong>{" "}
          Once the Roth IRA is full, pour whatever you can back into the
          401(k). You get another chunk of pre-tax space and most plans have
          solid low-cost index funds.
        </li>
        <li>
          <strong className="text-foreground">
            Mega backdoor Roth or taxable brokerage.
          </strong>{" "}
          If your plan allows after-tax contributions with in-service
          conversions, you can move tens of thousands more into a Roth each
          year. If not, taxable brokerage is fine: long-term capital gains
          are taxed at 0, 15, or 20%, usually lower than ordinary income.
        </li>
      </ol>
      <p>
        The reason Roth IRA beats the rest of the 401(k) in step 3 has
        nothing to do with Roth vs traditional tax treatment. It is about
        flexibility and fees. Most 401(k) plans have limited fund lineups and
        sometimes add record-keeping fees. An IRA at Fidelity, Schwab, or
        Vanguard gives you every low-cost index fund on the market.
      </p>

      <h2 id="tax-treatment">How the tax math actually works</h2>
      <p>
        Traditional 401(k) and Roth IRA get you to the same finish line if
        your tax rate is identical now and in retirement. The difference
        comes from the gap between your current bracket and your future
        bracket.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Account</th>
              <th className="py-2 pr-4 font-medium">Contribution</th>
              <th className="py-2 pr-4 font-medium">Growth</th>
              <th className="py-2 font-medium">Withdrawal</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">Traditional 401(k)</td>
              <td className="py-2 pr-4">Pre-tax</td>
              <td className="py-2 pr-4">Tax-deferred</td>
              <td className="py-2">Ordinary income</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Roth 401(k)</td>
              <td className="py-2 pr-4">Post-tax</td>
              <td className="py-2 pr-4">Tax-free</td>
              <td className="py-2">Tax-free</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Traditional IRA</td>
              <td className="py-2 pr-4">Pre-tax (with limits)</td>
              <td className="py-2 pr-4">Tax-deferred</td>
              <td className="py-2">Ordinary income</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Roth IRA</td>
              <td className="py-2 pr-4">Post-tax</td>
              <td className="py-2 pr-4">Tax-free</td>
              <td className="py-2">Tax-free</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The rule of thumb: if your current marginal rate is higher than the
        rate you expect in retirement, traditional wins. If your current
        rate is lower, Roth wins. If you honestly do not know, split the
        difference and do both.
      </p>
      <p>
        Most people in retirement live on less gross income than they earned
        during peak years, which pushes them into a lower bracket. That is
        the argument for traditional. Working against that argument: federal
        tax rates are scheduled to rise in 2026 unless Congress extends the
        current brackets, and long-run fiscal pressure makes higher rates
        more likely than lower ones over a 30-year horizon. Roth hedges that
        risk.
      </p>

      <h2 id="2026-limits">2026 contribution limits, all in one place</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Account</th>
              <th className="py-2 pr-4 font-medium">Base limit</th>
              <th className="py-2 pr-4 font-medium">Catch-up (50+)</th>
              <th className="py-2 font-medium">Super catch-up (60 to 63)</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">401(k), 403(b), most 457</td>
              <td className="py-2 pr-4">$23,500</td>
              <td className="py-2 pr-4">+$7,500</td>
              <td className="py-2">+$11,250</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Roth IRA / Traditional IRA</td>
              <td className="py-2 pr-4">$7,500</td>
              <td className="py-2 pr-4">+$1,000</td>
              <td className="py-2">n/a</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">HSA (family)</td>
              <td className="py-2 pr-4">$8,750</td>
              <td className="py-2 pr-4">+$1,000 (55+)</td>
              <td className="py-2">n/a</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">HSA (single)</td>
              <td className="py-2 pr-4">$4,400</td>
              <td className="py-2 pr-4">+$1,000 (55+)</td>
              <td className="py-2">n/a</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The 401(k) super catch-up for ages 60 to 63 is a SECURE 2.0 feature
        and only runs during those four years. At 64 you drop back to the
        regular $7,500 catch-up. If you are in that window, it is the single
        best period to load the account.
      </p>

      <h2 id="roth-income-limits">
        Roth IRA income limits in 2026 (and the backdoor workaround)
      </h2>
      <p>
        Direct Roth IRA contributions phase out at higher incomes. The 2026
        numbers:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Filing status</th>
              <th className="py-2 pr-4 font-medium">Full contribution</th>
              <th className="py-2 pr-4 font-medium">Phase-out range</th>
              <th className="py-2 font-medium">No direct contribution</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">Single / Head of household</td>
              <td className="py-2 pr-4">Up to $150,000</td>
              <td className="py-2 pr-4">$150,000 to $165,000</td>
              <td className="py-2">Above $165,000</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Married filing jointly</td>
              <td className="py-2 pr-4">Up to $236,000</td>
              <td className="py-2 pr-4">$236,000 to $246,000</td>
              <td className="py-2">Above $246,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        Above the phase-out cutoffs you cannot contribute directly, but you
        can still get money into a Roth through the{" "}
        <strong className="text-foreground">backdoor Roth IRA</strong>: put
        $7,500 into a traditional IRA (non-deductible since you are over the
        income limit), then convert it to a Roth IRA. The conversion is
        tax-free as long as you have no other pre-tax IRA money sitting
        around. If you do, the pro-rata rule applies and part of your
        conversion becomes taxable.
      </p>
      <p>
        The fix for the pro-rata problem: roll any existing traditional IRA
        balances into your current 401(k) before you start the backdoor
        routine. 401(k) balances do not count for pro-rata.
      </p>

      <CalculatorCta
        toolSlug="401k-calculator"
        headline="Project your 401(k) balance at retirement"
        ctaLabel="Open the 401(k) calculator"
      />

      <h2 id="scenario-middle">
        Scenario 1: 32 year old, $85k salary, 22% bracket
      </h2>
      <p>
        Alex is 32, earns $85,000, and pays federal taxes in the 22%
        bracket. Their employer matches 100% of the first 4% of salary
        ($3,400 per year). They can afford to save roughly $15,000 a year
        across all retirement accounts.
      </p>
      <p>
        <strong className="text-foreground">The right plan:</strong>
      </p>
      <ul>
        <li>
          Contribute 4% of salary ($3,400) to the traditional 401(k) to
          capture the full match. Employer adds another $3,400. Total into
          401(k): $6,800.
        </li>
        <li>
          Max the Roth IRA at $7,500. Alex is well under the $150,000
          phase-out, so direct contributions are easy.
        </li>
        <li>
          Put the remaining $4,100 back into the 401(k). Total personal
          contribution: $3,400 + $7,500 + $4,100 = $15,000.
        </li>
      </ul>
      <p>
        Why Roth over traditional at 22%? Alex is early in their career.
        Peak earning years are probably ahead, which means a higher bracket
        later. Locking in today&apos;s 22% rate on the Roth portion is
        cheap tax insurance. The traditional 401(k) match and the extra
        $4,100 still give a meaningful pre-tax deduction.
      </p>

      <h2 id="scenario-high">
        Scenario 2: 45 year old couple, $240k combined, 32% bracket
      </h2>
      <p>
        Jordan and Sam are married, 45, with a combined W-2 income of
        $240,000. They are in the 32% federal bracket and their state adds
        another 5%. Both have 401(k) plans with a 4% match. They can save
        around $60,000 a year.
      </p>
      <p>
        <strong className="text-foreground">The right plan:</strong>
      </p>
      <ul>
        <li>
          Each contributes 4% to capture the full match. Combined employer
          contributions add roughly $9,600.
        </li>
        <li>
          They are in the Roth IRA phase-out ($236,000 to $246,000 for
          joint filers). Each can make a partial direct contribution, or
          simpler, they both do backdoor Roth contributions for the full
          $7,500 each ($15,000 combined).
        </li>
        <li>
          Both max the traditional 401(k) at $23,500 each ($47,000 combined).
          At a 32% federal + 5% state bracket, that saves them roughly
          $17,400 in current-year taxes.
        </li>
        <li>
          If Jordan&apos;s plan allows after-tax contributions with
          in-service conversions, they can use the mega backdoor Roth to
          push another $20,000 to $30,000 into a Roth 401(k) subaccount
          each year.
        </li>
      </ul>
      <p>
        At this bracket, traditional 401(k) beats Roth 401(k) for new
        contributions. A 37% combined marginal rate is high enough that
        almost any plausible retirement bracket will be lower. They should
        still have Roth money in the mix through the backdoor IRA, because
        having both buckets gives them tax flexibility in retirement.
      </p>

      <h2 id="when-roth-wins">When Roth beats traditional</h2>
      <ul>
        <li>
          <strong className="text-foreground">
            You are in the 12% bracket or below.
          </strong>{" "}
          A 12% rate is historically low. Almost any future tax scenario
          leaves you paying more, so pay now.
        </li>
        <li>
          <strong className="text-foreground">
            You are early in your career.
          </strong>{" "}
          Your 20s and early 30s are usually your lowest earning years. Roth
          locks in that low rate.
        </li>
        <li>
          <strong className="text-foreground">
            You expect large taxable income in retirement.
          </strong>{" "}
          Rental properties, a pension, a large traditional IRA balance, or
          a business sale can push you into a higher bracket than you had
          while working.
        </li>
        <li>
          <strong className="text-foreground">
            You want to leave the account to heirs.
          </strong>{" "}
          Roth IRAs have no required minimum distributions during your
          lifetime and pass to heirs tax-free (subject to the 10-year
          drawdown rule).
        </li>
        <li>
          <strong className="text-foreground">
            You believe tax rates will rise.
          </strong>{" "}
          A defensible view given federal debt trajectory. Roth is the
          hedge.
        </li>
      </ul>

      <h2 id="when-traditional-wins">When traditional beats Roth</h2>
      <ul>
        <li>
          <strong className="text-foreground">
            You are in the 32%, 35%, or 37% bracket.
          </strong>{" "}
          The current tax savings are so large that even a modest drop in
          retirement makes traditional the winner.
        </li>
        <li>
          <strong className="text-foreground">
            You live in a high-tax state and plan to retire somewhere
            cheaper.
          </strong>{" "}
          Deducting in California (up to 13.3% state) and withdrawing in
          Florida (0%) is a clean arbitrage worth several percentage points
          per contribution.
        </li>
        <li>
          <strong className="text-foreground">
            You are within 10 years of retirement with a clear picture of
            your spending.
          </strong>{" "}
          If you know you will need $70,000 a year in retirement and that
          puts you in the 12% bracket, traditional wins easily.
        </li>
        <li>
          <strong className="text-foreground">
            You need the tax deduction to afford the contribution.
          </strong>{" "}
          A traditional 401(k) contribution of $23,500 in the 24% bracket
          only reduces your take-home by $17,860. The Roth version costs
          the full $23,500. If cashflow is tight, traditional lets you save
          more.
        </li>
      </ul>

      <CalculatorCta
        toolSlug="retirement-calculator"
        headline="Model your full retirement plan with Roth and traditional buckets"
        ctaLabel="Open the retirement calculator"
      />

      <h2 id="roth-401k">Should you use Roth 401(k) instead of Roth IRA?</h2>
      <p>
        Roth 401(k) is an increasingly common option. Contributions go in
        post-tax, but you stay in the same 401(k) plan with the same
        investment menu.
      </p>
      <p>
        The case for Roth 401(k): you can put $23,500 in ($31,000 at 50+),
        far more than the $7,500 Roth IRA limit. If you want a large Roth
        balance and you are a high earner, this is the simplest path.
        Employer match goes into a traditional subaccount, so you still get
        some pre-tax diversification.
      </p>
      <p>
        The case against: 401(k) plans have limited investment menus,
        sometimes higher fees, and required minimum distributions at 73
        (unlike Roth IRA, which has none). If your plan fees are above 0.5%
        of assets, a Roth IRA is almost always better for the first $7,500.
      </p>
      <p>
        Practical middle ground: do the Roth IRA first for the investment
        flexibility, then use traditional 401(k) for the pre-tax deduction
        on the rest. Only switch 401(k) contributions to Roth if you are
        already maxing both and want more Roth space.
      </p>

      <h2 id="mega-backdoor">Mega backdoor Roth: the advanced move</h2>
      <p>
        If your 401(k) plan allows{" "}
        <strong className="text-foreground">
          after-tax contributions
        </strong>{" "}
        and{" "}
        <strong className="text-foreground">
          in-service conversions or withdrawals
        </strong>
        , you can push significantly more into a Roth account each year.
      </p>
      <p>
        The 2026 total 401(k) contribution limit (employee + employer + after-tax)
        is $72,000. Subtract your $23,500 employee contribution and whatever
        the employer puts in, and the remaining space can be filled with
        after-tax contributions that you then convert to Roth. For someone
        with a $6,000 employer match, that is roughly $42,500 of extra Roth
        space per year.
      </p>
      <p>
        Check your plan&apos;s Summary Plan Description for the phrases
        &quot;after-tax contributions&quot; and &quot;in-plan Roth
        conversions.&quot; If both are available, this is the highest-impact
        retirement move a high earner can make.
      </p>

      <h2 id="state-tax">State tax considerations</h2>
      <p>
        Your state tax rate matters more than most people realize. If you
        live in a 0% state (Florida, Texas, Tennessee, Washington, and a few
        others), the Roth vs traditional tradeoff is federal-only. If you
        live in California (up to 13.3%), New York (up to 10.9%), or Oregon
        (9.9%), traditional contributions also shield you from state tax.
      </p>
      <p>
        The biggest wins come from deducting in a high-tax state and
        withdrawing in a low-tax state. Retirees moving from California to
        Nevada can save 9% or more per dollar of traditional 401(k)
        withdrawal. If you are confident about your retirement state, factor
        it into the decision.
      </p>

      <h2 id="cannot-max-both">What if you cannot afford to max both?</h2>
      <p>
        Most people cannot. Maxing a 401(k) and a Roth IRA takes $31,000 a
        year, which is about 36% of an $85,000 gross salary. Here is the
        rank order when you have less:
      </p>
      <ol>
        <li>
          <strong className="text-foreground">
            $0 to match amount:
          </strong>{" "}
          hit the full employer match. Nothing else.
        </li>
        <li>
          <strong className="text-foreground">Match + up to $7,500:</strong>{" "}
          fill the Roth IRA after capturing the match.
        </li>
        <li>
          <strong className="text-foreground">
            Match + full Roth IRA + extra:
          </strong>{" "}
          put the extra back into the 401(k).
        </li>
        <li>
          <strong className="text-foreground">
            Going above $31,000 total:
          </strong>{" "}
          HSA if eligible, mega backdoor Roth if your plan allows it,
          taxable brokerage otherwise.
        </li>
      </ol>
      <p>
        Saving 10 to 15% of gross pay for retirement from your mid-20s
        onward is usually enough to hit the standard 10x-by-67 target.
        Getting to 10% matters far more than optimizing the exact account
        mix. Start with the match, add the Roth IRA, and increase the rate
        by 1 percentage point at every raise.
      </p>

      <h2 id="decision-framework">Quick decision framework</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Your situation</th>
              <th className="py-2 font-medium">Order</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">
                20s, 12 or 22% bracket, decent match
              </td>
              <td className="py-2">Match, Roth IRA, rest of 401(k)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">
                30s, 24% bracket, mid-career
              </td>
              <td className="py-2">Match, Roth IRA, rest of 401(k)</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">
                High earner, 32%+ bracket, under Roth phase-out
              </td>
              <td className="py-2">
                Match, Roth IRA, max traditional 401(k), mega backdoor
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">
                High earner, above Roth phase-out
              </td>
              <td className="py-2">
                Match, backdoor Roth IRA, max traditional 401(k), mega
                backdoor
              </td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">
                Near retirement, clear picture, lower future bracket
              </td>
              <td className="py-2">
                Match, max traditional 401(k) with catch-up, Roth IRA last
              </td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Self-employed, variable income</td>
              <td className="py-2">
                Solo 401(k) or SEP-IRA, plus Roth IRA in low-income years
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 id="next-steps">What to do this week</h2>
      <p>
        Log into your 401(k) portal and confirm two numbers: your current
        contribution percentage and your employer match formula. If your
        contribution is below the match threshold, raise it today. That is
        the one action with a guaranteed return.
      </p>
      <p>
        Open a Roth IRA at Fidelity, Schwab, or Vanguard if you do not have
        one. It takes 15 minutes. Fund it with whatever you can spare up to
        $7,500. Pick a target-date fund or a three-fund index portfolio and
        ignore it.
      </p>
      <p>
        The calculators below let you project what the combined plan looks
        like at 65 or 67. They run in your browser, so nothing you enter is
        sent anywhere.
      </p>

      <ul className="not-prose my-6 space-y-2">
        <li>
          <Link
            href="/tools/401k-calculator"
            className="font-medium text-primary hover:underline"
          >
            401(k) Calculator
          </Link>{" "}
          for projecting your 401(k) balance at retirement with match and
          contribution changes.
        </li>
        <li>
          <Link
            href="/tools/retirement-calculator"
            className="font-medium text-primary hover:underline"
          >
            Retirement Calculator
          </Link>{" "}
          for a full retirement projection including 401(k), Roth IRA, and
          taxable accounts.
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>{" "}
          for testing contribution scenarios on a Roth IRA over 20 or 30
          years.
        </li>
        <li>
          <Link
            href="/tools/investment-return-calculator"
            className="font-medium text-primary hover:underline"
          >
            Investment Return Calculator
          </Link>{" "}
          for comparing different return assumptions on your combined
          portfolio.
        </li>
      </ul>
    </>
  )
}
