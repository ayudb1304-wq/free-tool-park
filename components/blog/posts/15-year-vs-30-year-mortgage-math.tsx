import Link from "next/link"
import { CalculatorCta } from "@/components/blog/calculator-cta"

export default function FifteenVsThirtyYearMortgage() {
  return (
    <>
      <div className="not-prose my-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">TL;DR</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-medium">Loan term</th>
                <th className="py-2 pr-4 font-medium">Rate</th>
                <th className="py-2 pr-4 font-medium">Monthly P&amp;I</th>
                <th className="py-2 pr-4 font-medium">Total interest</th>
                <th className="py-2 font-medium">Total paid</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">30-year</td>
                <td className="py-2 pr-4">7.00%</td>
                <td className="py-2 pr-4">$2,661</td>
                <td className="py-2 pr-4">$558,036</td>
                <td className="py-2">$958,036</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">15-year</td>
                <td className="py-2 pr-4">6.25%</td>
                <td className="py-2 pr-4">$3,430</td>
                <td className="py-2 pr-4">$217,436</td>
                <td className="py-2">$617,436</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          $400,000 loan, realistic 2026 rates. The 15-year wins on lifetime
          interest by about $341,000. The 30-year costs $769 less per month and
          keeps that cash in your pocket.
        </p>
      </div>

      <p>
        The 15-year mortgage saves you about $341,000 in lifetime interest on a
        $400,000 loan at current rates. That is the honest headline. The less
        honest headline is that the 30-year still wins for most people, because
        the 15-year payment is 22% higher and that difference either becomes
        investment capital (if you are disciplined) or an emergency cushion (if
        you are human).
      </p>

      <p>
        This post walks through the real math on a $400,000 mortgage at 2026
        rates, shows what happens if you invest the difference, and gives you a
        clean decision framework at the end. No cheerleading for either side.
      </p>

      <h2 id="the-raw-numbers">The raw numbers on a $400k loan</h2>
      <p>
        Lenders price the 15-year about 0.75 percentage points below the
        30-year because the loan is less risky: shorter duration, faster
        amortization, and borrowers who qualify tend to have stronger finances.
        At 2026 levels you are looking at roughly 7.00% on a 30-year and 6.25%
        on a 15-year for conforming loans with good credit.
      </p>
      <p>
        Plug a $400,000 loan into both:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">30-year at 7.00%:</strong>{" "}
          $2,661 per month in principal and interest. Over 360 payments you pay
          $958,036. Interest alone: $558,036.
        </li>
        <li>
          <strong className="text-foreground">15-year at 6.25%:</strong>{" "}
          $3,430 per month. Over 180 payments you pay $617,436. Interest alone:
          $217,436.
        </li>
      </ul>
      <p>
        The 15-year costs $769 more per month. In exchange, you save $340,600
        in interest and own the house outright 15 years sooner. On paper, it
        looks like a no-brainer. It is not.
      </p>

      <h2 id="why-most-people-take-the-30">
        Why most people still should take the 30-year
      </h2>
      <p>
        Three reasons, in order of importance: flexibility, behavioral
        reality, and emergency fund protection.
      </p>
      <p>
        <strong className="text-foreground">Flexibility.</strong> A 30-year
        mortgage is a 30-year mortgage with a minimum payment of $2,661. That
        does not stop you from paying $3,430 any month you want. You can treat
        a 30-year like a 15-year on good months and drop back to $2,661 on
        months when the water heater explodes. The 15-year is a legal
        obligation of $3,430 every single month, with a late fee and a credit
        hit if you miss it.
      </p>
      <p>
        <strong className="text-foreground">Behavioral reality.</strong> The
        standard counterargument (&quot;take the 30-year and invest the
        difference&quot;) only works if you actually invest the difference.
        Studies consistently show that most people spend some or all of the
        gap. If you know yourself and the $769 will vanish into takeout and
        streaming subscriptions, the forced savings mechanism of the 15-year is
        a feature, not a bug.
      </p>
      <p>
        <strong className="text-foreground">Emergency fund protection.</strong>{" "}
        A job loss or medical event is much easier to survive with a $2,661
        payment than a $3,430 payment. That $769 monthly difference is cash
        flow oxygen. In a true emergency you cannot call the bank and ask to
        temporarily switch from 15-year terms to 30-year terms. You can,
        however, stop making extra principal payments on a 30-year instantly.
      </p>

      <h2 id="invest-the-difference">
        The invest-the-difference argument, done honestly
      </h2>
      <p>
        Here is the math if you actually do it. Take the 30-year, invest
        $769/month in a broad stock index fund earning 7% real return, for 30
        years:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Year</th>
              <th className="py-2 pr-4 font-medium">Invested so far</th>
              <th className="py-2 font-medium">Portfolio value at 7%</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">10</td>
              <td className="py-2 pr-4">$92,280</td>
              <td className="py-2">~$133,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">15</td>
              <td className="py-2 pr-4">$138,420</td>
              <td className="py-2">~$244,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">20</td>
              <td className="py-2 pr-4">$184,560</td>
              <td className="py-2">~$401,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">25</td>
              <td className="py-2 pr-4">$230,700</td>
              <td className="py-2">~$623,000</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">30</td>
              <td className="py-2 pr-4">$276,840</td>
              <td className="py-2">~$930,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        $930,000 at the end of year 30. That is the number the
        30-year-plus-invest camp points at.
      </p>
      <p>
        The catch: the 15-year buyer is done with payments at year 15, so they
        also get 15 years to invest their full $3,430 monthly payment. At 7%
        real return that compounds to about $1,090,000 by year 30. So the
        15-year path ends up ahead, by roughly $160,000, if both sides invest
        what they save.
      </p>
      <p>
        But that assumes perfect discipline for 30 years. Real-world investing
        rates for people who choose the 30-year with intent to invest the
        difference tend to be closer to 50 to 70% of the theoretical amount.
        Drop the monthly investment to $500 and the 30-year path ends at
        roughly $605,000, well behind the 15-year path.
      </p>
      <p>
        Net takeaway: the 30-year wins only if you actually invest
        consistently. If you do, it wins comfortably. If you don&apos;t, the
        15-year is almost always better.
      </p>

      <CalculatorCta
        toolSlug="mortgage-calculator"
        headline="Compare your own 15-year vs 30-year scenario"
        ctaLabel="Open the mortgage calculator"
      />

      <h2 id="cash-flow-math">Cash flow: the 22% that changes your life</h2>
      <p>
        Forget total interest for a second. Look at the monthly payment gap:
        $2,661 vs $3,430. The 30-year payment is 22.4% lower. On a household
        earning $140,000 gross ($8,700 take-home), that is the difference
        between a comfortable budget and a tight one.
      </p>
      <p>
        Lenders generally want your total housing payment (principal,
        interest, taxes, insurance, HOA) under 28% of gross income. At
        $140,000 gross that ceiling is $3,267/month. A $3,430 P&amp;I payment
        before taxes and insurance puts you over that line. A $2,661 payment
        leaves room for the $500 to $800 per month that property tax and
        insurance typically add.
      </p>
      <p>
        The 15-year only makes sense if the higher payment still leaves you
        with a healthy debt-to-income ratio, a fully funded emergency fund,
        and maxed retirement contributions. If any of those three things are
        not true, the 15-year is putting your house before your financial
        safety net.
      </p>

      <h2 id="who-should-take-15">
        Who should take the 15-year
      </h2>
      <p>
        There are real cases where the 15-year is the right answer. Four of
        them:
      </p>
      <ol>
        <li>
          <strong className="text-foreground">High earners with no
          spending discipline.</strong>{" "}
          If you make $250,000 and know the $769 will evaporate, lock it up in
          the mortgage. The forced amortization is a commitment device.
        </li>
        <li>
          <strong className="text-foreground">People within 15 years of
          retirement.</strong>{" "}
          A 50 year old who wants to retire at 65 mortgage-free has a clear
          argument for the 15-year. Walking into retirement with no housing
          payment cuts your required portfolio by 25 to 30x the annual
          mortgage cost.
        </li>
        <li>
          <strong className="text-foreground">Conservative investors who
          would park the difference in a savings account anyway.</strong>{" "}
          If your alternative is 4% HYSA, paying down a 6.25% mortgage is a
          guaranteed 225 basis point better return, tax-adjusted.
        </li>
        <li>
          <strong className="text-foreground">Residents of high state
          income tax states who max retirement accounts already.</strong>{" "}
          Once you are fully funding 401(k) and IRAs, the mortgage prepayment
          is one of the few remaining tax-efficient places to put marginal
          dollars.
        </li>
      </ol>

      <h2 id="who-should-take-30">
        Who should take the 30-year
      </h2>
      <p>
        Most people. Specifically:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">First-time buyers.</strong>{" "}
          Your expenses are about to change in ways you cannot predict. Take
          the lower payment.
        </li>
        <li>
          <strong className="text-foreground">Anyone without a 6-month
          emergency fund.</strong>{" "}
          Build that first. The 15-year payment eats the cash you should be
          saving toward it.
        </li>
        <li>
          <strong className="text-foreground">Anyone with debt priced above
          the mortgage rate.</strong>{" "}
          Credit cards at 24%, auto loans at 9%, student loans at 8%: every
          one of those is a better payoff target than a 6.25% mortgage. Take
          the 30-year, keep the lower payment, and kill the higher-rate debt
          first.
        </li>
        <li>
          <strong className="text-foreground">Anyone not maxing retirement
          accounts.</strong>{" "}
          The $23,500 401(k) limit with employer match beats mortgage
          prepayment on almost any reasonable assumption. Fill that bucket
          before you overpay the mortgage.
        </li>
        <li>
          <strong className="text-foreground">Self-employed or
          variable-income households.</strong>{" "}
          You need the flexibility to skip the $769 extra during slow months.
          The 30-year gives you that option legally. The 15-year doesn&apos;t.
        </li>
      </ul>

      <h2 id="thirty-paid-like-fifteen">
        The &quot;30-year paid like a 15-year&quot; strategy
      </h2>
      <p>
        This is the smartest middle ground for people torn between the two.
        Take the 30-year at 7.00%, then voluntarily pay $3,430 every month (or
        whatever the 15-year payment would be). What happens?
      </p>
      <p>
        You pay off the loan in roughly 17 years instead of 30. Total interest
        comes in around $256,000, versus $217,000 for a true 15-year. You pay
        about $39,000 more in interest for the privilege of being able to drop
        back to $2,661 any month you need to.
      </p>
      <p>
        That $39,000 is the insurance premium for flexibility. For most
        households it is worth it. The downside is the rate: you are paying
        7.00% instead of 6.25%. In a world where 15-year rates are close to
        30-year rates (sometimes within 0.25 points), the case for the pure
        30-year-paid-early weakens.
      </p>

      <h2 id="refi-path">
        The refi path: start 30, refi to 15 if rates drop
      </h2>
      <p>
        If you take the 30-year at 7.00% and rates drop to 5.25% for the
        15-year within a few years, you can refinance into a 15-year with only
        a modest payment increase. At a $380,000 balance after 3 years, a
        15-year at 5.25% runs about $3,055/month, only $394 more than your
        original 30-year payment.
      </p>
      <p>
        This path gives you the best of both: a lower locked-in payment while
        rates are elevated, and the option to convert to an aggressive payoff
        schedule if rates come back down. Closing costs on a refi typically
        run 2 to 3% of the loan, so $8,000 to $12,000 on a $400,000 balance.
        The break-even is usually 2 to 3 years of interest savings.
      </p>

      <CalculatorCta
        toolSlug="refinance-calculator"
        headline="See if refinancing to a 15-year makes sense"
        ctaLabel="Open the refinance calculator"
      />

      <h2 id="tax-deduction">The mortgage interest deduction is mostly a myth</h2>
      <p>
        You have probably heard that the 30-year is &quot;better for taxes&quot;
        because you pay more deductible interest. For almost all households in
        2026, that is wrong. Two reasons:
      </p>
      <p>
        First, the standard deduction is $15,000 single and $30,000 married
        filing jointly in 2026. You only benefit from itemizing if your
        mortgage interest, state and local taxes (capped at $10,000), and
        charitable giving together exceed the standard deduction. On a
        $400,000 mortgage at 7%, year-one interest is about $27,800. Add the
        $10,000 SALT cap and a married couple is at $37,800, only $7,800
        above the standard deduction. The marginal tax benefit of the
        deduction is tiny: 22% of $7,800 is $1,716.
      </p>
      <p>
        Second, that benefit shrinks every year. By year 15 of a 30-year
        mortgage, annual interest drops to about $17,000. Most of your
        itemizing benefit disappears.
      </p>
      <p>
        The practical rule: assume you get no meaningful tax benefit from
        mortgage interest. If you end up with one, it is a bonus. Never use
        the deduction as a reason to take the longer term.
      </p>

      <h2 id="decision-framework">Five-question decision framework</h2>
      <p>
        Answer these honestly. Each &quot;no&quot; pushes you toward the
        30-year. Each &quot;yes&quot; leans 15-year.
      </p>
      <ol>
        <li>
          <strong className="text-foreground">Do you have a fully funded 6-month
          emergency fund already?</strong> If no, take the 30-year.
        </li>
        <li>
          <strong className="text-foreground">Are you maxing tax-advantaged
          retirement accounts (401k, IRA) every year?</strong> If no, take the
          30-year. Your retirement match and tax shelter beat mortgage
          prepayment.
        </li>
        <li>
          <strong className="text-foreground">Is all your other debt (credit
          cards, auto, student) at a rate below the 15-year mortgage
          rate?</strong> If no, take the 30-year and kill the higher-rate debt
          first.
        </li>
        <li>
          <strong className="text-foreground">Will the 15-year payment keep
          your housing cost under 28% of gross income?</strong> If no, take the
          30-year. Otherwise you are house-poor on paper.
        </li>
        <li>
          <strong className="text-foreground">Do you have a track record of
          actually investing money you say you&apos;ll invest?</strong> If no,
          the 15-year&apos;s forced savings mechanism is worth it for you.
        </li>
      </ol>
      <p>
        Four or five &quot;yes&quot; answers: the 15-year is a defensible
        choice. Three or fewer: take the 30-year, pay a little extra when you
        can, and refi into a 15-year if rates fall meaningfully.
      </p>

      <h2 id="next-steps">Run the numbers on your actual loan</h2>
      <p>
        The $400,000 example here is a starting point. Your rate, loan size,
        down payment, and tax situation all shift the math. Run your own
        numbers before locking anything in, and compare at least three
        lenders. A 0.25% rate difference on $400,000 is $18,000 over 30 years.
      </p>
      <p>
        The calculators below run entirely in your browser. No signup, no
        data leaves your device.
      </p>

      <ul className="not-prose my-6 space-y-2">
        <li>
          <Link
            href="/tools/mortgage-calculator"
            className="font-medium text-primary hover:underline"
          >
            Mortgage Calculator
          </Link>{" "}
          to compare 15-year and 30-year scenarios side by side with your
          actual numbers.
        </li>
        <li>
          <Link
            href="/tools/loan-calculator"
            className="font-medium text-primary hover:underline"
          >
            Loan Calculator
          </Link>{" "}
          for general amortization schedules on any fixed-rate loan.
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>{" "}
          to project what happens if you invest the monthly difference
          between the two terms.
        </li>
        <li>
          <Link
            href="/tools/refinance-calculator"
            className="font-medium text-primary hover:underline"
          >
            Refinance Calculator
          </Link>{" "}
          to check whether refinancing a 30-year into a 15-year pencils out
          at today&apos;s rates.
        </li>
      </ul>
    </>
  )
}
