# a11y-auditor

A Claude Code **subagent** that audits UI code for **WCAG 2.1 AA** accessibility issues and reports prioritized, `file:line`-anchored fixes.

It understands **React**, **React Native**, and plain **HTML/JSX/TSX** (plus Vue/Svelte templates), and it checks for the issues that actually break things for assistive-technology and keyboard users:

- Missing text alternatives — `<img>` alt, icon-only buttons, RN `<Image>` labels, meaningful SVGs
- Broken form/label associations — `htmlFor`/`id`, `aria-label`, RN `<TextInput>`; placeholders are not labels
- Color-contrast risks — resolves color pairs where present and flags the rest for runtime verification
- Keyboard traps & focus order — `<div onClick>`, positive `tabindex`, `outline: none`, unmanaged modals
- ARIA misuse — invalid roles/attributes, `aria-hidden` on focusable content, missing companion attributes
- Structure & landmarks — heading order, link-vs-button misuse, missing `lang`, data-table headers

It is **read-only**: it never edits your files. It reports each issue with the exact corrected snippet so you (or the main agent) can apply the fix.

## How to invoke

This plugin ships a subagent, so it is invoked by name or auto-delegated by Claude Code:

```
subagent: a11y-auditor
```

Or just ask in natural language and Claude will delegate to it:

- "Audit the accessibility of `src/components/Checkout.tsx`"
- "Run a WCAG check on the components I just changed"
- "Is this modal accessible?"
- "a11y review of `app/screens/` (React Native)"

## Example

> **You:** Audit `src/SignupForm.tsx` for accessibility.

> **a11y-auditor:**
> Summary: 1 Critical, 2 Serious, 1 Moderate across 1 file.
>
> ```
> [CRITICAL] Email input has no accessible name — WCAG 1.3.1 / 4.1.2 (A)
>   src/SignupForm.tsx:24
>   Problem: <input type="email"> relies only on a placeholder; no <label>, aria-label, or aria-labelledby.
>   Why it matters: Screen readers announce the field as an unlabeled "edit text"; the placeholder vanishes on input.
>   Fix:
>     <label htmlFor="email">Email</label>
>     <input id="email" type="email" />
>   Confidence: High
> ```
>
> ...
>
> **Top 3 to fix first:** (1) Email label, (2) icon-only submit button name, (3) `outline: none` with no focus style.
> Still needs manual testing: rendered contrast of the muted helper text, and a real keyboard tab-through of the form.

## What it deliberately does **not** do

- It does not edit files (read-only by design).
- It cannot measure *rendered* contrast or *actual* focus behavior — those are flagged as "Risk — verify at runtime" rather than asserted as failures.
- It does not replace a manual screen-reader pass; it gets you most of the way and tells you what's left.

## Coverage

WCAG 2.1 AA success criteria checked statically include: 1.1.1, 1.2.x (flagged), 1.3.1, 1.4.1, 1.4.3, 1.4.11, 2.1.1, 2.1.2, 2.2.2, 2.3.1, 2.4.1, 2.4.3, 2.4.6, 2.4.7, 3.1.1, 3.3.2, 4.1.2.

## License

MIT © [Gagan Singh](https://gagansingh.tech)
