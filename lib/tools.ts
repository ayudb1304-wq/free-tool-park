import { TOOLS, type Tool } from "@/data/tools"

export function getAllTools(): Tool[] {
  return TOOLS
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug)
}

export function getToolsByCategory(categorySlug: string): Tool[] {
  return TOOLS.filter((t) => t.category === categorySlug)
}

export function getRelatedTools(tool: Tool): Tool[] {
  return tool.relatedSlugs
    .map((slug) => TOOLS.find((t) => t.slug === slug))
    .filter((t): t is Tool => t !== undefined)
    .slice(0, 4)
}
