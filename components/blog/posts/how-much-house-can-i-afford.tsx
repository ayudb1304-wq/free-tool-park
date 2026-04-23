import Link from "next/link"
import { CalculatorCta } from "@/components/blog/calculator-cta"

export default function HowMuchHouseCanIAfford() {
  return (
    <>
      <div className="not-prose my-6 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
        <p className="mb-2 text-sm font-semibold text-foreground">TL;DR</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="py-2 pr-4 font-medium">Gross salary</th>
                <th className="py-2 pr-4 font-medium">Max monthly PITI (28%)</th>
                <th className="py-2 font-medium">Rough max home price</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b">
                <td className="py-2 pr-4">$50,000</td>
                <td className="py-2 pr-4">$1,167</td>
                <td className="py-2">$165,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">$60,000</td>
                <td className="py-2 pr-4">$1,400</td>
                <td className="py-2">$200,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">$75,000</td>
                <td className="py-2 pr-4">$1,750</td>
                <td className="py-2">$255,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">$90,000</td>
                <td className="py-2 pr-4">$2,100</td>
                <td className="py-2">$310,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">$100,000</td>
                <td className="py-2 pr-4">$2,333</td>
                <td className="py-2">$350,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">$125,000</td>
                <td className="py-2 pr-4">$2,917</td>
                <td className="py-2">$440,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">$150,000</td>
                <td className="py-2 pr-4">$3,500</td>
                <td className="py-2">$530,000</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">$200,000</td>
                <td className="py-2 pr-4">$4,667</td>
                <td className="py-2">$710,000</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">$250,000</td>
                <td className="py-2 pr-4">$5,833</td>
                <td className="py-2">$895,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Assumes 7% mortgage rate, 20% down, 30-year fixed, 1.1% property tax,
          $120/month insurance, no HOA, and minimal other debt. Home prices are
          rounded. Your actual number depends on your debts, credit score, and
          local tax rates.
        </p>
      </div>

      <p>
        The short version: at a 7% mortgage rate with 20% down and the standard
        28% housing ratio, every $10,000 of gross salary buys you roughly
        $35,000 of home. A $100,000 earner can defensibly afford a $350,000
        house. A $150,000 earner can stretch to about $530,000. A $75,000
        earner lands near $255,000. Those numbers are the bank&apos;s view of
        what you can afford, not always what you should spend.
      </p>

      <p>
        This guide walks through the 28/36 rule, the full PITI math, how down
        payments and rates swing your buying power, and the gap between what a
        lender will approve and what actually leaves you with a life.
      </p>

      <h2 id="the-28-36-rule">The 28/36 rule, explained honestly</h2>
      <p>
        The 28/36 rule is the framework lenders and financial planners have
        used for decades. Two ratios:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">Front-end ratio (28%):</strong>{" "}
          your total housing payment (PITI plus HOA) should be no more than 28%
          of gross monthly income.
        </li>
        <li>
          <strong className="text-foreground">Back-end ratio (36%):</strong>{" "}
          your total monthly debt payments (housing plus car, student loans,
          credit cards, minimums on everything) should be no more than 36% of
          gross income.
        </li>
      </ul>
      <p>
        The 28% front-end limit is tight in any high-cost-of-living metro. In
        the Bay Area, Seattle, Boston, NYC, or Denver, 28% of a normal salary
        does not buy anything close to a family home. Lenders know this.
        Qualified Mortgage rules technically allow a back-end DTI up to 43%,
        and many loan programs push that to 45% or even 50% with
        compensating factors (big down payment, high credit score, reserves).
      </p>
      <p>
        The trap: a bank approving you at 45% DTI does not mean 45% is
        comfortable. At 45% back-end, nearly half your gross income is going
        to debt before taxes, retirement, childcare, or food. Lots of people
        sign those loans and regret them within two years.
      </p>

      <h2 id="piti">What PITI actually includes</h2>
      <p>
        PITI is the four parts of your mortgage payment: Principal, Interest,
        Taxes, Insurance. People shopping online quote the P+I number (what the
        mortgage calculator defaults to) and then get blindsided when the
        actual monthly payment is 30 to 40% higher.
      </p>
      <ul>
        <li>
          <strong className="text-foreground">Principal and interest</strong>{" "}
          on a $400,000 loan at 7% over 30 years is $2,661/month. Straightforward.
        </li>
        <li>
          <strong className="text-foreground">Property taxes</strong> run from
          about 0.3% in Hawaii to 2.5% in New Jersey or Illinois. On a
          $500,000 home at 1.1% (roughly the US median), that is $458/month.
          On the same home in Texas at 1.8%, it is $750/month.
        </li>
        <li>
          <strong className="text-foreground">Homeowner&apos;s insurance</strong>{" "}
          averages $1,400 to $1,800/year nationally, or $120 to $150/month.
          Florida, Louisiana, and parts of California are much higher due to
          wildfire and hurricane exposure. Some Florida quotes are now running
          $400 to $600/month.
        </li>
        <li>
          <strong className="text-foreground">PMI</strong> (private mortgage
          insurance) applies if your down payment is under 20% on a
          conventional loan. Expect 0.5 to 1.5% of the loan per year,
          depending on your credit score. On a $400,000 loan, that is another
          $165 to $500/month.
        </li>
      </ul>
      <p>
        Run this math before you fall in love with a listing. A $500,000 home
        in Texas with 10% down, 7% rate, 1.8% property tax, $180 insurance, and
        0.8% PMI runs about $4,200/month PITI + PMI. The P+I alone is only
        $2,995. That gap of $1,200/month is the entire reason people feel
        &quot;poorer than the spreadsheet said&quot; after closing.
      </p>

      <CalculatorCta
        toolSlug="mortgage-calculator"
        headline="Plug in your exact numbers"
        ctaLabel="Open the mortgage calculator"
      />

      <h2 id="down-payment">Down payment reality in 2026</h2>
      <p>
        The 20% down payment is still the cleanest option because it avoids
        PMI entirely and gets you the best rates. It is also out of reach for
        most first-time buyers. The median first-time buyer puts down about 8%.
      </p>
      <ul>
        <li>
          <strong className="text-foreground">Conventional 3 to 5% down:</strong>{" "}
          available to most buyers with a 620+ credit score. You pay PMI until
          you hit 20% equity, then it drops off automatically at 22% and can be
          requested at 20%.
        </li>
        <li>
          <strong className="text-foreground">FHA 3.5% down:</strong> low
          barrier to entry, allows credit scores as low as 580. The catch is
          MIP (mortgage insurance premium) that typically sticks for the life
          of the loan if you put down less than 10%. To get rid of MIP you
          usually need to refinance into a conventional loan. Factor that
          future refi cost in.
        </li>
        <li>
          <strong className="text-foreground">VA and USDA:</strong> 0% down for
          eligible veterans or rural buyers. No PMI. If you qualify, these are
          the best products on the market.
        </li>
        <li>
          <strong className="text-foreground">20% down:</strong> no PMI, best
          rates, lower monthly payment, more offers accepted in competitive
          markets. On a $400,000 home that is $80,000, which takes most people
          years of saving.
        </li>
      </ul>
      <p>
        Don&apos;t drain your emergency fund to hit 20%. A 10% down payment
        with PMI and 6 months of expenses in savings beats a 20% down payment
        with $2,000 in the bank and a furnace that is about to die.
      </p>

      <h2 id="100k-scenario">Walkthrough: $100k salary, step by step</h2>
      <p>
        Here is the actual math for a $100,000 earner with decent credit,
        minimal debt, 20% down, and a 7% rate in an average property-tax state:
      </p>
      <ol>
        <li>
          <strong className="text-foreground">Gross monthly income:</strong>{" "}
          $100,000 / 12 = $8,333.
        </li>
        <li>
          <strong className="text-foreground">Max PITI at 28%:</strong>{" "}
          $8,333 x 0.28 = $2,333/month.
        </li>
        <li>
          <strong className="text-foreground">Back out taxes and insurance:</strong>{" "}
          at 1.1% property tax and $120/month insurance on a $350,000 home,
          that is $320 + $120 = $440/month. Leaves $1,893 for principal and
          interest.
        </li>
        <li>
          <strong className="text-foreground">Solve for loan amount:</strong>{" "}
          $1,893/month of P+I at 7% over 30 years supports a loan of about
          $284,500.
        </li>
        <li>
          <strong className="text-foreground">Add 20% down:</strong> $284,500
          loan / 0.80 = $355,625 home price. Call it $350,000 to leave
          room for closing costs and furniture.
        </li>
      </ol>
      <p>
        So a $100k earner following the 28% rule lands around $350,000. That
        is the conservative answer. A lender might approve you up to about
        $475,000 by stretching to 36 to 40% DTI, but the monthly PITI would
        run closer to $3,100 which turns into a genuinely tight budget once
        you add retirement contributions, a car payment, and groceries.
      </p>
      <p>
        Live in a high-tax state like New Jersey (2.2% property tax)? Same
        $100k income, same 28% rule, but the tax line jumps to $640/month on a
        $350,000 home. That pushes the affordable price down to roughly
        $310,000 for the same monthly PITI.
      </p>

      <h2 id="75k-150k">$75k and $150k salaries</h2>
      <p>
        <strong className="text-foreground">$75,000 salary:</strong> gross
        monthly is $6,250. 28% cap is $1,750/month PITI. After $255/month for
        taxes and insurance on a $250,000 home, you have $1,495 for P+I, which
        supports a loan of about $225,000. With 20% down that is a $281,000
        home, or closer to $255,000 if you only put 10% down and absorb PMI.
        In a higher-tax state, knock $20,000 to $30,000 off.
      </p>
      <p>
        <strong className="text-foreground">$150,000 salary:</strong> gross
        monthly is $12,500. 28% cap is $3,500/month PITI. After $530/month for
        taxes and insurance on a $530,000 home, you have $2,970 for P+I, which
        supports a loan of about $446,000. With 20% down that is a $557,000
        home. Round to roughly $530,000 to leave buffer for closing costs and
        higher insurance on a pricier home. Stretch to 33% and a lender will
        green-light closer to $625,000.
      </p>

      <h2 id="hidden-costs">The costs nobody mentions</h2>
      <p>
        PITI is not the full cost of homeownership. Budget for these before
        they hit:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">Closing costs (2 to 5% of loan):</strong>{" "}
          on a $350,000 purchase, that is $7,000 to $17,500 in cash on top of
          your down payment. Lender fees, title insurance, appraisal, escrow
          funding, and prepaid taxes.
        </li>
        <li>
          <strong className="text-foreground">Maintenance (1% of home value per year):</strong>{" "}
          a $400,000 home averages $4,000/year of upkeep over time. Some years
          zero, some years a $12,000 roof. Set aside $333/month and you will
          be fine.
        </li>
        <li>
          <strong className="text-foreground">HOA fees:</strong> condos and
          planned communities often run $200 to $600/month, sometimes $1,000+.
          This counts toward your front-end ratio and eats into buying power.
        </li>
        <li>
          <strong className="text-foreground">Utilities step-up:</strong> a
          2,200 square foot house costs meaningfully more to heat, cool, and
          light than a 900 square foot apartment. Expect utilities to double
          or triple vs renting.
        </li>
        <li>
          <strong className="text-foreground">Furniture and appliances:</strong>{" "}
          empty rooms are expensive. First-year spend of $5,000 to $15,000 on
          furniture, appliances, and tools is normal.
        </li>
      </ul>

      <h2 id="rate-sensitivity">How much interest rates change the answer</h2>
      <p>
        Rates are the biggest single input after income. A 1 percentage point
        change in the mortgage rate shifts your buying power by roughly 10 to
        12%. Same $2,333/month PITI budget, different rates:
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-left">
              <th className="py-2 pr-4 font-medium">Rate</th>
              <th className="py-2 pr-4 font-medium">Max loan amount</th>
              <th className="py-2 font-medium">Max home price (20% down)</th>
            </tr>
          </thead>
          <tbody className="text-muted-foreground">
            <tr className="border-b">
              <td className="py-2 pr-4">5.0%</td>
              <td className="py-2 pr-4">~$353,000</td>
              <td className="py-2">~$441,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">6.0%</td>
              <td className="py-2 pr-4">~$316,000</td>
              <td className="py-2">~$395,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">7.0%</td>
              <td className="py-2 pr-4">~$285,000</td>
              <td className="py-2">~$356,000</td>
            </tr>
            <tr className="border-b">
              <td className="py-2 pr-4">7.5%</td>
              <td className="py-2 pr-4">~$271,000</td>
              <td className="py-2">~$339,000</td>
            </tr>
            <tr>
              <td className="py-2 pr-4">8.0%</td>
              <td className="py-2 pr-4">~$259,000</td>
              <td className="py-2">~$324,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground">
        Assumes $2,333/month budget for P+I only, 30-year fixed, 20% down.
        Actual PITI adds taxes and insurance.
      </p>
      <p>
        This is why the &quot;wait for rates to drop&quot; argument has teeth.
        If rates fall from 7.5% to 6.5%, the same buyer who qualified for
        $339,000 now qualifies for $375,000. The flip side: everyone else
        gains buying power too, so prices usually rise to meet the new demand.
        The cleanest play is to buy when the payment works for you at the
        current rate. Refinance later if rates fall.
      </p>

      <h2 id="priced-out">What to do if you are priced out</h2>
      <p>
        If the numbers don&apos;t work, you have a few honest options:
      </p>
      <ul>
        <li>
          <strong className="text-foreground">Wait and save more.</strong> A
          larger down payment reduces the loan and the monthly payment. Going
          from 10% to 20% down cuts roughly $150 to $250/month on a typical
          loan and kills PMI.
        </li>
        <li>
          <strong className="text-foreground">Lower your target.</strong> A
          smaller home, an older home that needs work, or a less trendy
          neighborhood can drop your price 20 to 30% for very similar square
          footage. The &quot;starter home&quot; concept still exists, just not
          on Zillow&apos;s first page.
        </li>
        <li>
          <strong className="text-foreground">Move to a cheaper market.</strong>{" "}
          The same $150,000 salary buys a 900 sqft condo in San Francisco and
          a 2,800 sqft house with a yard in Columbus or Pittsburgh. Remote
          work made this more viable than it was 10 years ago.
        </li>
        <li>
          <strong className="text-foreground">House-hack.</strong> Buy a duplex
          or a 3-bed and rent out bedrooms. FHA allows owner-occupied 2 to 4
          unit properties with 3.5% down. Rental income can cover a big chunk
          of PITI and lets you buy more house than your salary alone supports.
        </li>
        <li>
          <strong className="text-foreground">Pay down debt first.</strong>{" "}
          Every $300/month of car or student loan payment you eliminate frees
          up roughly $45,000 of mortgage affordability at a 7% rate. Pay off
          the car before you shop for the house.
        </li>
      </ul>

      <h2 id="stress-test">The affording test vs the comfortable test</h2>
      <p>
        A lender&apos;s approval is a yes/no question about whether you can
        physically make the payment from current income. It says nothing about
        whether you can make the payment if one spouse loses their job, if the
        car dies, or if a medical bill shows up.
      </p>
      <p>
        Run a stress test before you sign. Two questions:
      </p>
      <ol>
        <li>
          If your household income dropped by 30% tomorrow (layoff, reduced
          hours, illness), could you still make PITI for 6 months while you
          figured things out? You should have a yes here, either from reserves
          or because the payment is low enough that one income covers it.
        </li>
        <li>
          Does the mortgage payment leave room for 15% retirement
          contributions, a reasonable grocery budget, childcare if you have
          kids, and at least a small amount of discretionary spending? If
          you&apos;re hitting the max approved amount and the budget is tight
          before you have moved in, it will only get worse.
        </li>
      </ol>
      <p>
        A good rule: target a PITI that leaves you spending no more than 25%
        of take-home pay on housing. That is more conservative than 28% of
        gross because it accounts for taxes and retirement. On a $100k salary
        with roughly $6,500 take-home, that is $1,625/month, which corresponds
        to a home around $245,000 to $275,000 at current rates. Less than the
        lender&apos;s max, but the version you can actually live with.
      </p>

      <CalculatorCta
        toolSlug="mortgage-calculator"
        headline="Test your exact scenario"
        ctaLabel="Run the numbers"
      />

      <h2 id="next-steps">What to do next</h2>
      <p>
        The clearest way to answer &quot;how much house can I afford&quot; is
        to run your actual numbers with your actual debts, down payment, and
        local property tax rate. Then pull the monthly PITI back to 25% of
        take-home if you want a life beyond the mortgage. All the tools below
        run entirely in your browser. Nothing you enter is uploaded.
      </p>

      <ul className="not-prose my-6 space-y-2">
        <li>
          <Link
            href="/tools/mortgage-calculator"
            className="font-medium text-primary hover:underline"
          >
            Mortgage Calculator
          </Link>{" "}
          for the full PITI breakdown at any home price, down payment, rate,
          and loan term.
        </li>
        <li>
          <Link
            href="/tools/loan-calculator"
            className="font-medium text-primary hover:underline"
          >
            Loan Calculator
          </Link>{" "}
          for comparing loan scenarios, total interest, and amortization
          schedules.
        </li>
        <li>
          <Link
            href="/tools/auto-loan-calculator"
            className="font-medium text-primary hover:underline"
          >
            Auto Loan Calculator
          </Link>{" "}
          to see how paying off the car changes your mortgage DTI and buying
          power.
        </li>
        <li>
          <Link
            href="/tools/compound-interest-calculator"
            className="font-medium text-primary hover:underline"
          >
            Compound Interest Calculator
          </Link>{" "}
          for modeling how much a bigger down payment is worth vs investing
          the difference.
        </li>
      </ul>
    </>
  )
}
