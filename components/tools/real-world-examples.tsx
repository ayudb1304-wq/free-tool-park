import type { ToolExample } from "@/data/tools"

interface RealWorldExamplesProps {
  toolName: string
  examples: ToolExample[]
}

export function RealWorldExamples({
  toolName,
  examples,
}: RealWorldExamplesProps) {
  return (
    <section className="mb-8">
      <h2 className="font-heading mb-6 text-2xl font-bold">
        Real-World {toolName} Examples
      </h2>
      <div className="space-y-6">
        {examples.map((example, i) => (
          <div
            key={i}
            className="rounded-xl border bg-card p-5"
          >
            <h3 className="mb-1 text-lg font-semibold">
              Example {i + 1}: {example.title}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground">
              {example.scenario}
            </p>

            <ol className="mb-4 list-inside list-decimal space-y-1.5 text-sm text-muted-foreground">
              {example.steps.map((step, j) => (
                <li key={j}>{step}</li>
              ))}
            </ol>

            <div className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2">
              <span className="text-sm font-medium text-primary">Result:</span>
              <span className="font-semibold text-primary">
                {example.result}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
