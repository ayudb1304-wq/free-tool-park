import { TOOLS, type Tool } from "@/data/tools"
import { CATEGORIES, type Category } from "@/data/categories"

export function getAllTools(): Tool[] {
  return TOOLS
}

export function getAllToolSlugs(): string[] {
  return TOOLS.map((t) => t.slug)
}

export function getAllCategories(): Category[] {
  return CATEGORIES
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
