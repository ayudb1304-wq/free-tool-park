import Link from "next/link"
import { CalculatorCta } from "@/components/blog/calculator-cta"

export default function HowMuchInFourOhOneKByAge() {
  return (
    <>
      <div className="not-prose my-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">TL;DR</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-medium">Age</th>
                <th className="py-2 pr-4 font-medium">Target balance</th>
                <th className="py-2 font-medium">Example at $80k salary</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">30</td>
                <td className="py-2 pr-4">1x salary</td>
                <td className="py-2">$80,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">35</td>
                <td className="py-2 pr-4">2x salary</td>
                <td className="py-2">$160,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">40</td>
                <td className="py-2 pr-4">3x salary</td>
                <td className="py-2">$240,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">45</td>
                <td className="py-2 pr-4">4x salary</td>
                <td className="py-2">$320,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">50</td>
                <td className="py-2 pr-4">6x salary</td>
                <td className="py-2">$480,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">55</td>
                <td className="py-2 pr-4">7x salary</td>
                <td className="py-2">$560,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">60</td>
                <td className="py-2 pr-4">8x salary</td>
                <td className="py-2">$640,000</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">67</td>
                <td className="py-2 pr-4">10x salary</td>
                <td className="py-2">$800,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Source: Fidelity salary-multiple retirement framework. Figures
          include all retirement accounts (401k, IRA, Roth), not just your
          401(k).
        </p>
      </div>

      <p>
        You have probably seen headlines quoting the &quot;average 401(k)
        balance by age&quot; and felt either smug or alarmed depending on where
        you land. Averages are a bad benchmark. They are skewed by a handful
        of very high earners with million-dollar accounts, which makes the
        numbers look good and leaves most people quietly behind.
      </p>

      <p>
        A better benchmark is Fidelity&apos;s salary-multiple rule: by each
        age, your retirement balance should equal a multiple of your current
        salary. This guide walks through the targets, shows realistic numbers
        at common salaries, and explains exactly how to catch up if you are
        behind.
      </p>

      <h2 id="why-salary-multiples">
        Why salary multiples beat dollar targets
      </h2>
      <p>
        &quot;Have $1 million by 65&quot; is a popular rule of thumb. It is
        also almost useless, because the right number depends on the lifestyle
        you want to maintain. Someone earning $60,000 needs a much smaller
        nest egg than someone earning $200,000 to maintain their standard of
        living.
      </p>
      <p>
        Salary multiples handle that automatically. If you earn $80,000, you
        are trying to replace roughly 80% of that ($64,000) per year in
        retirement. Using the 4% safe withdrawal rule, that takes about $1.6
        million, which is 20x your salary. You will not hit 20x by working
        alone: Social Security replaces some of it, and your portfolio keeps
        growing after you stop contributing. Fidelity&apos;s 10x-by-67 target
        is what gets the math to work out if you start withdrawing 4% per year
        and keep earning modest returns.
      </p>

      <h2 id="in-your-20s">In your 20s: start the habit, not the balance</h2>
      <p>
        There is no dollar target for your 20s because time matters more than
        the current balance. Someone who saves $5,000 a year from 22 to 30 and
        stops will usually end up with more at 65 than someone who saves
        $5,000 a year from 30 to 65. Compounding is that unfair.
      </p>
      <p>
        <strong className="text-foreground">Action for your 20s:</strong>{" "}
        contribute at least enough to get the full employer match. That is a
        100% return on your money, guaranteed. If your match is 50% on the
        first 6%, contribute at least 6%. Push for 10% if you can. Pick the
        target-date fund for your retirement year and do nothing else.
      </p>

      <h2 id="age-30">By 30: 1x your salary</h2>
      <p>
        The target is 1x your annual salary in retirement accounts by the time
        you turn 30. At $70,000 that is $70,000. At $90,000 that is $90,000.
        Across all retirement accounts combined, not just the 401(k) at your
        current job.
      </p>
      <p>
        If you are on track, the simplest play is to keep contributing 10 to
        15% of gross pay including employer match and ignore the balance.
      </p>
      <p>
        If you are behind, the gap is recoverable. You still have 35 years of
        compounding ahead. Raise your contribution rate by 1 to 2 percentage
        points at every raise until you hit 15%. You will not miss the money
        because you never had it.
      </p>

      <CalculatorCta
        toolSlug="401k-calculator"
        headline="Project your 401(k) at retirement"
        ctaLabel="Open the 401(k) calculator"
      />

      <h2 id="age-40">By 40: 3x your salary</h2>
      <p>
        This is where the gap between benchmark and reality is the widest.
        Most people in their 40s are juggling mortgages, childcare, and
        aging parents. It is also the decade where catch-up starts to get
        expensive because you have fewer years of compounding left.
      </p>
      <p>
        At a $90,000 salary, 3x is $270,000. If you are closer to $100,000 and
        feel behind, here is what closing that gap looks like in practice:
        contribute 15 to 18% of salary, max the employer match, and avoid any
        lifestyle creep for the next 2 to 3 years. Over a decade that
        aggressive contribution rate combined with market growth typically
        puts the 50-year target within reach.
      </p>

      <h2 id="age-50">By 50: 6x your salary, plus catch-up contributions</h2>
      <p>
        The 6x target at 50 is where the math gets serious. At a $100,000
        salary that is $600,000. If you are not there yet, two things work in
        your favor:
      </p>
      <ol>
        <li>
          Starting the year you turn 50, you can contribute an extra $7,500 on
          top of the regular $23,500 limit (2026 figures). That is $31,000
          total per year into your 401(k).
        </li>
        <li>
          For people aged 60 to 63, SECURE 2.0 added a super catch-up of
          $11,250 instead of $7,500. You get a 4-year window to dump more
          money in late in your career.
        </li>
      </ol>
      <p>
        Combined with employer match, someone earning $120,000 with a generous
        match could comfortably put $40,000 or more per year into retirement
        during their 50s.
      </p>

      <h2 id="age-60">By 60: 8x your salary (and planning the bridge)</h2>
      <p>
        At 60, your target is 8x your salary, rising to 10x by 67. If you
        plan to retire before 67, you need to land closer to 10x earlier to
        cover the gap years before Social Security kicks in. Retiring at 62
        instead of 67 typically costs about 30% of your lifetime Social
        Security benefit because of reduced monthly payments, so those bridge
        years need to come mostly from your portfolio.
      </p>
      <p>
        This is also when asset allocation starts to matter more than
        contribution rate. A 60 year old with 90% stocks is exposed to
        sequence-of-returns risk: a bear market in the year you retire can
        permanently damage your withdrawal plan. Most target-date funds handle
        this automatically. If you manage your own allocation, a common rule
        of thumb is 60% stocks / 40% bonds by 60, shifting toward 50/50 by 70.
      </p>

      <CalculatorCta
        toolSlug="retirement-calculator"
        headline="Model your full retirement plan"
        ctaLabel="Open the retirement calculator"
      />

      <h2 id="catch-up">
        Behind the curve? Here is how to catch up
      </h2>
      <p>
        Most people are behind. The benchmarks are aspirational, not
        descriptive. If you are well under the target for your age, these are
        the highest-leverage moves, ranked by impact:
      </p>
      <ol>
        <li>
          <strong className="text-foreground">
            Capture every dollar of employer match.
          </strong>{" "}
          It is the highest return you will ever get. If your match is 50% of
          the first 6% of your pay, that is a 50% return on your
          contributions.
        </li>
        <li>
          <strong className="text-foreground">
            Raise your contribution rate by 1% every year.
          </strong>{" "}
          Automatic escalation features make this painless. Most 401(k) plans
          support it. Set it, forget it, and let raises do the work.
        </li>
        <li>
          <strong className="text-foreground">
            Max out catch-up contributions once you turn 50.
          </strong>{" "}
          $7,500 per year extra ($11,250 if you are 60 to 63) is a substantial
          boost late in your career.
        </li>
        <li>
          <strong className="text-foreground">
            Work 1 to 3 more years.
          </strong>{" "}
          Not glamorous, but it has outsized impact: extra contribution years,
          extra compounding years, higher Social Security benefit, and fewer
          retirement years to fund. Delaying retirement from 65 to 68 can
          close a meaningful gap.
        </li>
        <li>
          <strong className="text-foreground">
            Open a Roth IRA or Traditional IRA for extra tax-advantaged
            space.
          </strong>{" "}
          The 2026 IRA contribution limit is $7,500 ($8,500 with catch-up at
          50+). If you are a high earner, you may need to use the backdoor Roth
          technique.
        </li>
      </ol>

      <h2 id="mistakes">Common mistakes that wreck the math</h2>
      <ul>
        <li>
          <strong className="text-foreground">
            Cashing out when you change jobs.
          </strong>{" "}
          This is the single most destructive thing you can do to a retirement
          account. You pay income tax plus a 10% early withdrawal penalty if
          under 59.5, and you lose every future dollar of compounding on the
          balance. Roll it over to an IRA or your new 401(k) instead.
        </li>
        <li>
          <strong className="text-foreground">
            Ignoring the employer match.
          </strong>{" "}
          Roughly 1 in 4 workers leaves match money on the table each year.
          Contribute at least up to the match.
        </li>
        <li>
          <strong className="text-foreground">
            Being too conservative too early.
          </strong>{" "}
          A 25 year old in a stable-value fund is worse off than a 25 year old
          in a target-date fund, because inflation eats returns below 3%.
        </li>
        <li>
          <strong className="text-foreground">
            Forgetting to rebalance.
          </strong>{" "}
          If you pick your own allocation, it drifts over time. A 60/40
          portfolio can become 80/20 after a long bull market, which means you
          are taking more risk than you think. Target-date funds rebalance
          automatically.
        </li>
        <li>
          <strong className="text-foreground">
            Treating 401(k) loans as free money.
          </strong>{" "}
          The interest you pay goes back to you, but the money stops
          compounding while it is out. Worse, if you leave the job, you may
          have to repay the entire loan within 60 to 90 days or it becomes a
          taxable distribution.
        </li>
      </ul>

      <h2 id="catch-up-numbers">
        Quick reference: what to contribute at each age to hit 10x by 67
      </h2>
      <p>
        These numbers assume a 7% real return, contributions from the stated
        age to 67, and no existing balance. Treat them as upper bounds if you
        already have savings.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Starting age</th>
              <th className="py-2 pr-4 font-medium">Years to 67</th>
              <th className="py-2 font-medium">
                Monthly contribution to hit $1M (7% return)
              </th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">25</td>
              <td className="py-2 pr-4">42</td>
              <td className="py-2">~$360</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">30</td>
              <td className="py-2 pr-4">37</td>
              <td className="py-2">~$535</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">35</td>
              <td className="py-2 pr-4">32</td>
              <td className="py-2">~$810</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">40</td>
              <td className="py-2 pr-4">27</td>
              <td className="py-2">~$1,245</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">45</td>
              <td className="py-2 pr-4">22</td>
              <td className="py-2">~$1,960</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">50</td>
              <td className="py-2 pr-4">17</td>
              <td className="py-2">~$3,180</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        Starting 5 years later nearly doubles the monthly contribution needed.
        The chart is the single clearest argument for starting early.
      </p>

      <h2 id="next-steps">What to do next</h2>
      <p>
        The honest version of retirement planning: pick a contribution rate,
        pick a target-date fund, automate both, and ignore the balance for 10
        years. Check back when your salary changes or you change jobs.
      </p>
      <p>
        If you want to see exactly where you land given your current balance,
        salary, and contribution rate, use the tools below. Both run in your
        browser: nothing you enter is sent to a server.
      </p>

      <ul className="not-prose my-6 space-y-2">
        <li>
          <Link
            href="/tools/401k-calculator"
            className="font-medium text-primary hover:underline"
          >
            401(k) Calculator
          </Link>{" "}
          for projecting your 401(k) balance at retirement based on current
          contributions and employer match.
        </li>
        <li>
          <Link
            href="/tools/retirement-calculator"
            className="font-medium text-primary hover:underline"
          >
            Retirement Calculator
          </Link>{" "}
          for a full retirement projection including IRA, Roth, and taxable
          accounts.
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>{" "}
          for running &quot;what if&quot; scenarios on any savings plan.
        </li>
        <li>
          <Link
            href="/tools/savings-goal-calculator"
            className="font-medium text-primary hover:underline"
          >
            Savings Goal Calculator
          </Link>{" "}
          to work backward from a target balance and find the monthly
          contribution.
        </li>
      </ul>
    </>
  )
}
