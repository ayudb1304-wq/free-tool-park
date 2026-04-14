import type { ToolFormula } from "@/data/tools"

interface FormulaExplainedProps {
  toolName: string
  formula: ToolFormula
}

export function FormulaExplained({ toolName, formula }: FormulaExplainedProps) {
  return (
    <section className="mb-8">
      <h2 className="font-heading mb-4 text-2xl font-bold">
        {formula.name}
      </h2>

      {/* Formula expression */}
      <div className="mb-6 rounded-xl border bg-muted/30 p-5">
        <p className="text-center font-mono text-lg font-semibold tracking-wide sm:text-xl">
          {formula.expression}
        </p>
      </div>

      {/* Variable definitions */}
      <div className="mb-6">
        <h3 className="mb-3 text-lg font-semibold">Where:</h3>
        <dl className="space-y-2">
          {formula.variables.map((v) => (
            <div key={v.symbol} className="flex gap-3">
              <dt className="shrink-0 font-mono font-semibold text-primary">
                {v.symbol}
              </dt>
              <dd className="text-muted-foreground">= {v.meaning}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Step-by-step walkthrough */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">
          How to Calculate {toolName} Step by Step
        </h3>
        <ol className="list-inside list-decimal space-y-2 text-muted-foreground">
          {formula.walkthrough.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
    </section>
  )
}
