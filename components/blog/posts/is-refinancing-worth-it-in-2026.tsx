import Link from "next/link"
import { CalculatorCta } from "@/components/blog/calculator-cta"

export default function IsRefinancingWorthIt() {
  return (
    <>
      <div className="not-prose my-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">TL;DR</p>
        <p className="text-sm text-muted-foreground">
          Refinancing is worth it if you will stay in the house longer than
          the break-even period, usually 2 to 5 years. Run one calculation
          before anything else:
        </p>
        <p className="mt-3 text-sm font-mono text-foreground">
          Break-even (months) = closing costs / monthly payment savings
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          If closing costs are $6,000 and you save $269 a month, you break
          even at month 22. Stay past that and the refi pays off. Sell or move
          before it, and you lost money to do paperwork.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Common triggers that make refi math work in 2026: your rate is 0.75%
          or more above current market, your credit improved since origination,
          your ARM is about to reset, or you want to drop PMI after hitting
          20% equity.
        </p>
      </div>

      <p>
        Refinancing in 2026 is a narrower opportunity than the refi boom of
        2020 and 2021. Most homeowners who bought at sub-4% rates during the
        pandemic are locked into rates they will not see again this decade.
        The people for whom refi math actually works are the ones who bought
        in 2023 or 2024 at 7% or higher, anyone with an ARM resetting, and
        homeowners whose credit has jumped 40 or more points since they
        closed.
      </p>

      <p>
        This guide walks through the actual break-even math with a real
        $400,000 example, covers the closing cost breakdown you should expect,
        and flags the traps (no-cost refis, amortization resets, cash-out
        deductibility) that make the decision more complicated than the rate
        difference alone.
      </p>

      <h2 id="rate-environment">The 2026 rate environment, honestly</h2>
      <p>
        As of early 2026, 30-year fixed mortgage rates are running in the 6.5
        to 7.5% range, with 15-year fixed about 0.5 to 0.75% lower. That is
        down from the 7.75 to 8% peak in late 2023, but well above the 2.75
        to 3.5% rates most pandemic-era buyers locked in.
      </p>
      <p>
        Three groups of homeowners should even open the question:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">
            Bought in 2023 or early 2024 at 7.25% or higher.
          </strong>{" "}
          If today&apos;s best rate for your credit profile is 6.5%, a refi
          saves roughly $190 a month per $100,000 borrowed. The break-even is
          typically 2 to 3 years.
        </li>
        <li>
          <strong className="text-foreground">
            Hybrid ARM (5/1, 7/1, 10/1) about to reset.
          </strong>{" "}
          When your fixed period ends, the new rate resets to an index plus a
          margin, often 2 to 3% higher than what you have been paying.
          Refinancing to a fixed rate stops the bleeding even if the new fixed
          rate is close to your current adjustable rate.
        </li>
        <li>
          <strong className="text-foreground">
            Credit score jumped 40 or more points since origination.
          </strong>{" "}
          Rate sheets are tiered by credit. Going from a 680 score to a 760
          can shave 0.375 to 0.5% off the rate even without a market move.
        </li>
      </ul>
      <p>
        If you closed at 3.25% in 2021, stop reading. There is nothing here
        for you. Keep that loan until you sell the house or pay it off.
      </p>

      <h2 id="break-even-math">The real break-even math, $400,000 example</h2>
      <p>
        Numbers from a representative scenario. Current loan: $400,000 at 7.5%
        on a 30-year fixed, originated in 2023. Monthly principal and interest:
        $2,797. Current remaining balance after 2 years of payments: about
        $393,000.
      </p>
      <p>
        Refinance offer: 6.5% on a new 30-year fixed, same $393,000 balance.
        New monthly principal and interest: $2,485. Closing costs on the refi:
        $6,000 (about 1.5% of loan).
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Line item</th>
              <th className="py-2 pr-4 font-medium">Current loan</th>
              <th className="py-2 font-medium">Refinanced loan</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">Balance</td>
              <td className="py-2 pr-4">$393,000</td>
              <td className="py-2">$393,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Rate</td>
              <td className="py-2 pr-4">7.5%</td>
              <td className="py-2">6.5%</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Term</td>
              <td className="py-2 pr-4">28 years remaining</td>
              <td className="py-2">30 years new</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Monthly P&amp;I</td>
              <td className="py-2 pr-4">$2,797</td>
              <td className="py-2">$2,485</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Monthly savings</td>
              <td className="py-2 pr-4">-</td>
              <td className="py-2">$312</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Closing costs</td>
              <td className="py-2 pr-4">-</td>
              <td className="py-2">$6,000</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Break-even</td>
              <td className="py-2 pr-4">-</td>
              <td className="py-2">19.2 months</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        $6,000 divided by $312 a month equals 19.2 months. If you stay in the
        house 3 or more years, the refi puts about $5,200 in your pocket over
        the next 36 months ($312 times 36 minus $6,000). Stay 10 years and
        that grows to roughly $31,000 in cumulative savings, ignoring the
        amortization reset issue covered below.
      </p>

      <CalculatorCta
        toolSlug="refinance-calculator"
        headline="Run your own break-even in under a minute"
        ctaLabel="Open the refinance calculator"
      />

      <h2 id="closing-costs">What closing costs actually look like</h2>
      <p>
        Closing costs on a refi usually run 2 to 5% of the loan amount. On a
        $400,000 refi that is $8,000 to $20,000 in round numbers. Here is the
        typical breakdown, with ranges from a recent sample of good-faith
        estimates:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Line item</th>
              <th className="py-2 pr-4 font-medium">Typical cost</th>
              <th className="py-2 font-medium">Negotiable?</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">Origination / lender fees</td>
              <td className="py-2 pr-4">0.5 to 1.5% of loan</td>
              <td className="py-2">Yes, shop around</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Discount points (optional)</td>
              <td className="py-2 pr-4">1% of loan per point</td>
              <td className="py-2">Yes, skip unless staying 7+ years</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Appraisal</td>
              <td className="py-2 pr-4">$500 to $900</td>
              <td className="py-2">No, third party</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Title insurance and search</td>
              <td className="py-2 pr-4">$700 to $1,500</td>
              <td className="py-2">Partially, shop title companies</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Credit report</td>
              <td className="py-2 pr-4">$50 to $100</td>
              <td className="py-2">No</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">Recording and transfer fees</td>
              <td className="py-2 pr-4">$100 to $500</td>
              <td className="py-2">No, government</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">Prepaid taxes and insurance</td>
              <td className="py-2 pr-4">$2,000 to $5,000</td>
              <td className="py-2">No, escrow funding</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The prepaid taxes and insurance piece is a cash flow hit, not a real
        cost. Your old escrow account gets refunded after closing, usually in
        30 to 60 days, so treat that line as a short-term loan to yourself
        rather than a cost in the break-even calculation. Use the loan
        amount, lender fees, third-party services, and points when computing
        break-even.
      </p>

      <h2 id="cash-out-vs-rate-term">
        Cash-out refi vs rate-and-term refi
      </h2>
      <p>
        A rate-and-term refi replaces your existing loan with a new one at a
        different rate, different term, or both, at roughly the same balance.
        A cash-out refi replaces it with a larger loan and gives you the
        difference in cash at closing. Example: $393,000 balance, cash-out to
        $450,000, you walk out with about $50,000 after fees.
      </p>
      <p>
        Three things to know before you cash out:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">
            Rates are higher on cash-out refis.
          </strong>{" "}
          Expect 0.25 to 0.5% above rate-and-term. The lender is taking more
          risk.
        </li>
        <li>
          <strong className="text-foreground">
            Mortgage interest on cash-out is only deductible if used to buy,
            build, or substantially improve the home.
          </strong>{" "}
          If you cash out $50,000 to pay off credit cards or buy a car, the
          interest on that $50,000 is not tax deductible. This catches people
          off guard at tax time.
        </li>
        <li>
          <strong className="text-foreground">
            You are converting unsecured debt into secured debt.
          </strong>{" "}
          Paying off a credit card with a cash-out refi means if you default
          on the new mortgage payment, you can lose the house. Think hard
          before doing that.
        </li>
      </ul>
      <p>
        Cash-out refis can make sense for home renovations that add value, for
        consolidating high-interest debt if you have the discipline to not
        run up the cards again, or to fund a business investment. They are
        usually a bad idea for vacations, weddings, or general lifestyle
        spending.
      </p>

      <h2 id="no-cost-trap">The &quot;no-cost&quot; refi trap</h2>
      <p>
        A no-cost refi sounds appealing. There are no closing costs to write
        a check for. The math does not work that way. The costs exist, they
        just show up somewhere else:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">
            Rolled into the loan balance.
          </strong>{" "}
          Your new balance is $399,000 instead of $393,000. You now pay
          interest on that $6,000 for 30 years, which costs more than paying
          it upfront if you keep the loan past year 3.
        </li>
        <li>
          <strong className="text-foreground">
            Baked into a higher rate.
          </strong>{" "}
          Instead of 6.5%, you get 6.875%. Your monthly savings shrinks from
          $312 to about $200, which changes the break-even math and the
          lifetime savings profile.
        </li>
      </ul>
      <p>
        No-cost refis can still make sense in one scenario: you know you will
        sell or refinance again within 3 years, so you want zero out-of-pocket
        cost even if the long-term math is worse. Everyone else should pay
        the closing costs in cash if they can.
      </p>

      <h2 id="amortization-reset">
        The amortization reset: the hidden cost of every refi
      </h2>
      <p>
        Here is the trap that trips up even careful people. You have been
        paying your 30-year mortgage for 5 years. You have 25 years left. You
        refinance to a new 30-year at a lower rate. Your monthly payment drops
        and you feel great. You have also just reset the clock: 30 more years
        of mortgage payments, and most of them in the early years go to
        interest rather than principal.
      </p>
      <p>
        Quick example. Original loan: $400,000 at 7.5% for 30 years.
        Total interest over 30 years: about $607,000. After 5 years you refi
        the $378,000 balance to a new 30-year at 6.5%. Total interest on the
        refi: about $482,000. Add the $120,000 interest you already paid in
        the first 5 years, and your lifetime interest is now about $602,000.
        You saved $5,000 across a 35-year total loan period, despite dropping
        your rate by a full percentage point.
      </p>
      <p>
        Two fixes:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">
            Refinance to a shorter term.
          </strong>{" "}
          From a 30-year to a 20 or 25-year. Rates are usually a bit lower and
          you keep the original payoff timeline.
        </li>
        <li>
          <strong className="text-foreground">
            Keep paying the old payment amount.
          </strong>{" "}
          Refinance to a 30-year but send the lender the amount you were
          paying before. The extra money goes to principal. You get the rate
          savings without the amortization reset.
        </li>
      </ul>
      <p>
        Option 2 is almost always the right answer. You keep flexibility (you
        can drop back to the required payment in a bad year) but capture the
        interest savings. Run this scenario in a mortgage calculator before
        signing the refi.
      </p>

      <CalculatorCta
        toolSlug="mortgage-calculator"
        headline="See the full amortization schedule for both loans"
        ctaLabel="Open the mortgage calculator"
      />

      <h2 id="arm-to-fixed">ARM to fixed: the often overlooked refi case</h2>
      <p>
        If you have a 5/1, 7/1, or 10/1 ARM and the fixed period is ending,
        refinancing to a fixed rate can make sense even if the new fixed rate
        is higher than your current adjustable rate. The reason: after the
        reset, your rate can jump by up to 2% in year one and 5% over the
        life of the loan, depending on your caps.
      </p>
      <p>
        Say you have a 7/1 ARM at 4.5% that is resetting next year. The
        index (SOFR or similar) plus your 2.75% margin could put your new
        adjustable rate at 7.5% or higher. Refinancing to a 30-year fixed at
        6.75% is objectively worse than what you have been paying, but
        better than what you are about to pay, and it locks in certainty for
        the rest of the loan.
      </p>
      <p>
        The window to act is before the reset. Lenders look at your current
        payment when underwriting. Once your payment jumps to the new
        adjusted level, your debt-to-income ratio changes and you may have a
        harder time qualifying for the refi.
      </p>

      <h2 id="when-refi-fails">When refinancing does not work</h2>
      <p>
        Four situations where the math almost never clears, regardless of the
        rate drop:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">
            You plan to move within 2 years.
          </strong>{" "}
          Unless the rate drop is dramatic (1.5% or more) and closing costs
          are below 1% of the loan, the break-even will land after your move
          date. You lose money.
        </li>
        <li>
          <strong className="text-foreground">
            You have less than 5 years of mortgage left.
          </strong>{" "}
          Most of your payment is already principal at this point. A lower
          rate saves almost nothing because you are barely paying interest.
          Pay extra toward principal instead.
        </li>
        <li>
          <strong className="text-foreground">
            You are underwater or close to it.
          </strong>{" "}
          If your balance is higher than the home&apos;s value, you cannot
          refinance through conventional channels. FHA Streamline and VA IRRRL
          programs have some flexibility here but only for existing FHA or VA
          loans.
        </li>
        <li>
          <strong className="text-foreground">
            Your credit dropped significantly since origination.
          </strong>{" "}
          If you closed at 760 and you are now at 640, the rate you qualify
          for today is probably worse than what you have. Fix the credit
          first, then shop refis.
        </li>
      </ul>

      <h2 id="checklist">The 6-line checklist before you refinance</h2>
      <ol>
        <li>Current rate and remaining balance (pull your statement).</li>
        <li>
          New rate offer from at least 3 lenders on the same day (rates move
          daily, you need apples-to-apples quotes).
        </li>
        <li>
          Closing cost estimate on the loan estimate form (page 2, section A
          through E, excluding prepaid escrow).
        </li>
        <li>
          How long you plan to stay in the home (realistic, not best case).
        </li>
        <li>
          Break-even in months: closing costs divided by monthly savings.
        </li>
        <li>
          Compare break-even to stay-duration. If stay-duration is at least
          2x the break-even, it is worth doing. If less than 1.5x, skip it.
        </li>
      </ol>

      <h2 id="next-steps">What to do next</h2>
      <p>
        Get three loan estimates from different lenders on the same day.
        Rates and fees vary by more than people expect: on a $400,000 loan,
        the spread between the best and worst offer is often $3,000 to
        $6,000 in closing costs and 0.25% in rate. Use the calculators below
        to plug in the numbers from each estimate and compare break-even
        across lenders.
      </p>
      <p>
        Everything runs in your browser. Nothing you enter goes to a server
        and no signup is required.
      </p>

      <ul className="not-prose my-6 space-y-2">
        <li>
          <Link
            href="/tools/refinance-calculator"
            className="font-medium text-primary hover:underline"
          >
            Refinance Calculator
          </Link>{" "}
          to compute break-even and lifetime savings for any rate and closing
          cost scenario.
        </li>
        <li>
          <Link
            href="/tools/mortgage-calculator"
            className="font-medium text-primary hover:underline"
          >
            Mortgage Calculator
          </Link>{" "}
          for a full amortization schedule so you can see principal vs
          interest across the life of the loan.
        </li>
        <li>
          <Link
            href="/tools/loan-calculator"
            className="font-medium text-primary hover:underline"
          >
            Loan Calculator
          </Link>{" "}
          to compare payments and interest for any fixed-payment loan,
          including shorter refi terms.
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>{" "}
          to see what happens if you invest the monthly refi savings instead
          of spending them.
        </li>
      </ul>
    </>
  )
}
