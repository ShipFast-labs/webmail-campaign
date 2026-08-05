Coding Agent Rules

1. Don't include useless long comment, If needed then add short and meaning full comment.

2. Use HugeIcons (Pro) exclusively. Never use Lucide or any other icon library.

- Don't use free icons, use Pro icons, we have paid subscription and you already have mcp server connected

3. every page should be mobile responsive.

4. Follow SOLID principles in every module/class/component.

5. Apply established design patterns (factory, strategy, repository, observer, etc.) where they genuinely fit. Don't force one where a simple function suffices.

6. Keep code modular: one responsibility per file/function/component.

7. Break logic into small, single-purpose functions (aim for functions doing one thing, easy to name and test).

8. Readability > cleverness. Prefer explicit, self-documenting code over compact "clever" one-liners.

9. Security first: validate/sanitize all inputs, parameterize queries, never trust client data, handle secrets via env vars, follow least-privilege for API/auth.

10. Performance-conscious: avoid N+1 queries, unnecessary re-renders, unbounded loops, or blocking calls in hot paths.

- Never use native `<button>` elements. Always use `<Button>` from `@/components/ui/button`.
- Never use native `<input>`, `<select>`, `<textarea>`, `<checkbox>`. Use shadcn equivalents (`Input`, `Select`, `Textarea`, `Checkbox`).
- Semantic structural tags (`<nav>`, `<header>`, `<main>`, `<aside>`, `<footer>`, `<section>`) are encouraged and must stay as native HTML.
- For clickable links styled as buttons, use `<Button asChild>` wrapping `<Link>` or `<a>`. Never style a raw `<a>` to look like a button.
- Every interactive element must have a visible focus ring (`focus-visible:ring-2`).

## Animations

- Use `motion` from `motion/react` for all animations.
- Nav items and buttons: `whileHover={{ x: 3 }}` or `whileHover={{ scale: 1.04 }}`, `transition={{ duration: 0.15, ease: "easeOut" }}`.
- Never use CSS `transition` alone for hover effects on interactive elements; pair or replace with `motion`.
- Respect `prefers-reduced-motion` — the global guard in `index.css` handles this.

## Consistency

- Match existing project conventions (naming, folder structure, error handling) unless a rule above overrides them.
- When in doubt between two valid approaches, pick the one that's more readable and easier to test.
