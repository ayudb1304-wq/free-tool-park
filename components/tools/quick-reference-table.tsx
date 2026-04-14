import type { ToolReferenceTable } from "@/data/tools"

interface QuickReferenceTableProps {
  table: ToolReferenceTable
}

export function QuickReferenceTable({ table }: QuickReferenceTableProps) {
  return (
    <section className="mb-8">
      <h2 className="font-heading mb-4 text-2xl font-bold">{table.title}</h2>
      <div className="overflow-x-auto rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              {table.headers.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left font-semibold"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr
                key={i}
                className="border-b last:border-0 even:bg-muted/20"
              >
                {row.map((cell, j) => (
                  <td key={j} className="px-4 py-2.5 text-muted-foreground">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && (
        <p className="mt-2 text-xs text-muted-foreground">{table.note}</p>
      )}
    </section>
  )
}
