# FreeToolPark Project Instructions

## Content style rules (SEO-critical)

**Never use em dashes (`—`) in any user-visible content.** Em dashes are a
well-known signal of AI-generated content and can hurt SEO and Google's
trust signals. This rule applies to:

- Tool `h1`, `titleTag`, `metaDescription`, `introduction`, `whyUse`,
  `whyUseSummary`, `steps`, `faqs`, `keywords` in `data/tools.ts`
- All JSX text inside `components/tools/**/*.tsx` (labels, buttons, placeholder
  text, empty states, tooltips, error messages, helper text)
- Any other user-facing copy (pages, FAQ answers, marketing text)

Use natural alternatives instead:
- Comma (`,`) for a mid-sentence pause
- Colon (`:`) when introducing something
- Period (`.`) when the clause can stand alone
- Parentheses (`( )`) for an aside

Empty-state placeholders that used `—` should use `-` (hyphen) or a word
like "None".

**En dashes (`–`) for number ranges are also discouraged.** Write "7 to 8%"
instead of "7 to 8%" (literal), to stay consistent and avoid any dash-based
AI tells.

**Code comments** inside tool files should also avoid em dashes, since the
source is crawlable on GitHub and gets quoted in blog posts.

## Tool build conventions

When building a new tool from `MOST_VISITED_TOOLS_BUILD_SPEC.md`:

1. Create the component at `components/tools/<slug>.tsx` (`"use client"`).
2. Register the slug in `lib/built-tools.ts` (`BUILT_TOOL_NAMES` array).
3. Add the dynamic import to `components/tool-renderer.tsx` (`registry`).
4. Append a full entry to the `TOOLS` array in `data/tools.ts` with:
   - `slug`, `name`, `category`, `icon`, `componentName`
   - `h1`, `titleTag`, `metaDescription`
   - `introduction` (one long paragraph, ~150 words)
   - `whyUse` (8 to 12 bullets), `whyUseSummary`
   - `steps` (6 ordered steps with `title` + `description`)
   - `faqs` (8 to 10 Q&A pairs)
   - `relatedSlugs`, `keywords`
5. If the tool is in the Most Visited list, verify `data/most-visited.ts`
   already contains its slug (it usually does).
6. Run `npx eslint <new files>` and `npx tsc --noEmit` and fix any issues
   before committing.
7. Commit with message `Build <Name> tool (Most Visited Tool #N)`.

## UI / layout conventions

- All new tool components use shadcn UI primitives from `components/ui/`
  (Card, Input, Label, Button, Select, Tabs, Textarea).
- Use `useLocalStorage` from `hooks/use-local-storage.ts` for any state
  that should persist across reloads (drafts, saved clients, etc.).
- Icons come from `@hugeicons/core-free-icons` via `<HugeiconsIcon>`.
- Prefer custom SVG or CSS-based visualizations over Recharts for new tools,
  since Recharts has unresolved type issues in this repo.
- Financial / legal tools must include a disclaimer banner
  (amber border, `bg-amber-500/5`) stating "Estimates only. Not <legal/tax/
  financial> advice."

## Privacy messaging

FreeToolPark positions itself as privacy-first. Every tool description should
reinforce that calculations run in the browser, nothing is uploaded, and no
signup is required. Do not imply server-side processing in any copy.
