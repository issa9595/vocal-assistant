# Design System — Lumia (MASTER)

> Source of truth for Lumia's visual language. **`src/app/globals.css` tokens always win** over any
> generator recommendation in case of conflict. This file records the Lumia charte + the validated
> direction from `ui-ux-pro-max` (Voice-First Multimodal × Aurora × Organic-Biophilic).

---

## 0. Golden rule

The web app (`src/app/app/`, `src/components/`) already ships a mature **Liquid Glass + Aurora**
system. The landing (`src/app/accueil/_sections/`) must feel like the same product: an **ambient
aurora field** with **translucent glass surfaces** floating over it. Never introduce a color, font,
shadow or radius outside the charte. Reuse the CSS classes and `--color-brand-*` variables instead
of hard-coded values.

---

## 1. Palette (from `globals.css` — DO NOT DEVIATE)

| Role | Hex | Token |
|------|-----|-------|
| Background (white) | `#fdf8f8` | `--color-brand-white` |
| Text (black) | `#3d3d3d` | `--color-brand-black` |
| Pink | `#f4b4c8` | `--color-brand-pink` |
| Salmon | `#f6b9ae` | `--color-brand-salmon` |
| Peach | `#fcecd3` | `--color-brand-peach` |
| Lavender | `#c5a6cf` | `--color-brand-lavender` |
| Blue | `#96b6dd` | `--color-brand-blue` |
| Teal | `#9dc0bc` | `--color-brand-teal` |
| Text secondary (AA) | `#515151` | `--text-secondary-accessible` / `.landing-muted` |
| Text muted (AA) | `#636363` | `--text-muted-accessible` / `.landing-subtle` |
| Focus ring | `#c5a6cf` | `--focus-ring` |

**Brand gradient:** `linear-gradient(135deg, #f4b4c8 0%, #fcecd3 100%)` (`--gradient-brand`).
**Text gradient:** `.landing-gradient-text` (rose `#f4b4c8` → salmon `#f6b9ae`).

For body copy on glass/white, use `.landing-muted` (#515151) — never the non-accessible
`--text-secondary` (rgba .6). Reserve `.landing-subtle` (#636363) for captions/labels only.

## 2. Typography

`proxima-nova` → fallback Helvetica Neue / system-ui (`--font-sans`).
- Headings: `font-bold tracking-tight leading-[1.1]`.
- Body: `font-light leading-relaxed`.
- Type scale: 12 · 14 · 16 · 18 · 24 · 32 · 48 · 60 · 72.
- (Generator suggested Inter — **ignored**, charte uses proxima-nova.)

## 3. Liquid Glass + Aurora (reuse these classes)

- `.aurora-bg` — ambient multi-radial field (pink/lavender/blue/teal/salmon). The landing puts this
  on a **fixed full-viewport layer behind content** so it stays calm and consistent while scrolling,
  mirroring the app shell.
- `.glass` / `.glass-panel` — translucent surfaces (blur + saturate + soft shadow + inner highlight).
  `glass-panel` = stronger (headers, hero preview). `glass` = lighter (cards).
- `.glass-pink` / `.glass-teal` — tinted variants (use pink for "warm/intent" cards, teal for
  "calm/data" cards). Match the app: events = pink, AI bubbles = teal.
- `.glass-grain` — subtle film grain. `.glass-highlight` — top specular reflection.
- Radius: `rounded-full` for CTA & pills, `rounded-2xl` / `rounded-[1.5rem]` for cards.
- Shadows come from the glass tokens only (`--glass-shadow*`). The old `shadow-soft` / `shadow-medium`
  classes are **undefined no-ops** — remove them.

## 4. Direction (validated via ui-ux-pro-max)

- **Voice-First Multimodal** (primary): waveform visualization, listening pulse, smooth transitions,
  ambient/contextual, hands-free. Mic + soundwave iconography (already in the app's FAB/MicButton).
- **Aurora / Gradient-Mesh**: flowing multi-layer brand gradients — but the *muted* Lumia version,
  never neon.
- **Organic-Biophilic**: generous rounded corners, grain/texture overlays, soft natural shadows,
  calming whitespace rhythm.

Landing pattern: "show, don't tell" — the hero carries a **glass preview of the app** (voice →
calendar) so the value is visible immediately.

## 5. Icons

No icon library installed. Use **inline SVG** (Lucide-style: 24×24, stroke, `stroke-width:1.5–2`,
round caps/joins) — one consistent family in `_sections/Icons.tsx`. **Never emoji as icons.**

## 6. Anti-patterns (proscribed)

Generic violet/neon AI gradients · dark mode · abrupt animations · hard shadows · sharp corners ·
harsh contrast · emoji-as-icon · motion overload · bright neon (generator-flagged).

## 7. Motion

- Durations 150–300ms, ease-out on enter. Animate 1–2 elements per view max.
- Entrance: hero only (subtle `animate-fade-in-up`, staggered). Below the fold: hover transitions only
  (no scroll-reveal that could hide content).
- `prefers-reduced-motion: reduce` neutralizes landing animation/transition (scoped to `.landing-shell`).

## 8. Pre-delivery checklist

- [ ] No emoji icons (inline SVG only)
- [ ] `cursor-pointer` on every clickable element
- [ ] Hover transitions 150–300ms
- [ ] Text contrast ≥ 4.5:1 (use `-accessible` variants)
- [ ] Visible keyboard focus (`outline: 3px solid var(--focus-ring)`)
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive 375 / 768 / 1024 / 1440
- [ ] Glass + aurora coherent with `src/app/app/`
- [ ] `npm run build` green
