# UI Design Spec

**Reference aesthetic:** Nodum-style dark agent dashboard  
**Vibe:** Calm, alive, premium dark — like a control room that breathes

---

## Visual Language

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `bg-base` | `#141414` or `#111111` | Page background |
| `bg-card` | `#1e1e1e` / `#222222` | Floating agent cards |
| `bg-card-hover` | `#2a2a2a` | Card hover state |
| `text-primary` | `#ffffff` | Hero headlines |
| `text-secondary` | `#a0a0a0` | Body copy, subtitles |
| `text-muted` | `#555555` | Labels, metadata |
| `border-subtle` | `rgba(255,255,255,0.07)` | Card borders |
| `accent` | `#ffffff` | CTA button fill, dots |

No color pops. No gradients. Pure dark with white type.

---

## Typography

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Hero headline | `72–80px` | 400 (regular) | Two-line break, white fading to light gray on line 2 |
| Subtitle | `18–20px` | 400 | Muted gray, max-width ~400px |
| Card label | `11px` | 500 | Monospace, uppercase, spaced — below card |
| Nav links | `14–15px` | 400 | Light gray |
| Badge text | `11px` | 500 | Uppercase, letter-spaced |

Hero font: system sans or Inter. Card labels: monospace (JetBrains Mono or `font-mono`).

---

## Layout

### Navbar
- Centered pill, floating at top center of page
- Shape: `border-radius: 9999px`, dark fill + subtle border
- Contents: `● ExecuSim` logo dot + brand name | `How It Works` | `Personas` | `Pricing`
- Not full-width — compact, centered, elevated feel

### Hero Split
- Left third: badge + headline + subtitle + CTA
- Right two-thirds: floating agent card constellation
- Vertically centered in viewport

### CTA Button
- Circle white button with arrow `↑` icon
- Right of it: bold label text ("Run Simulation" or "Initialize Market")
- No traditional rectangular button shape

---

## The Floating Cards (Right Panel)

This is the core visual. Cards represent the agent network.

### Card Anatomy
- Dark rounded rectangle: `border-radius: 16–20px`
- Subtle border: `1px solid rgba(255,255,255,0.06)`
- Background slightly lighter than page: `#1e1e1e`
- Inside: colored dot (agent indicator) + 2 gray placeholder lines
- Optional: small play/arrow icon in bottom-right corner
- Label below card: monospace uppercase tag (e.g. `PERSONA_SKEPTIC`, `STRATEGY`, `SUPERVISOR`)

### Card Network for ExecuSim

```
          ○ (Strategy Node — top center)
         / \
        /   \
  [Skeptic] [Budget]
       \      /
        \    /
    [Early Adopter]
          |
    [Supervisor]
          |
    [Score Output]
```

Cards connected by **dashed SVG lines** — not solid, dashed, subtle opacity.

### ExecuSim Card Labels (monospace)
- `STRATEGY_AGT`
- `PERSONA_SKEPT`
- `PERSONA_BUDGET`
- `PERSONA_ADOPT`
- `EXEC_SUPV`
- `SCORE_OUT`

---

## The "Alive" Animation

Cards float with a slow, calm, continuous vertical oscillation. Each card has a **different phase offset** so they don't all move in sync — creates organic breathing feel.

### CSS Keyframe

```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}
```

### Per-Card Timing

| Card | Duration | Delay | Easing |
|------|----------|-------|--------|
| Strategy node | 6s | 0s | `ease-in-out` |
| Skeptic | 7s | 1.2s | `ease-in-out` |
| Budget | 6.5s | 2.5s | `ease-in-out` |
| Early adopter | 8s | 0.8s | `ease-in-out` |
| Supervisor | 7.5s | 1.8s | `ease-in-out` |
| Score output | 6s | 3s | `ease-in-out` |

Rule: durations between 6–9s, delays staggered 0–3s. Never identical.

### Dashed Connection Lines
- SVG `<line>` or `<path>` elements
- `stroke-dasharray: 6 4` or similar
- `stroke: rgba(255,255,255,0.12)`
- Lines do NOT animate — only cards move

---

## Status Badge

Top-left of hero, above headline:

```
[ SIMULATION READY_ ]
```

- Pill shape, dark fill, white border at low opacity
- Monospace or tight tracking font
- Trailing underscore `_` — gives terminal/live feel
- When simulation runs: changes to `[ RUNNING_ ]` with a pulse dot

---

## Panel Structure (Dashboard, not landing)

The 5 panels from the product spec map to this visual language:

| Panel | Card Title | Label Tag |
|-------|-----------|-----------|
| 1 | Idea Input | `INPUT_` |
| 2 | Strategy Output | `STRATEGY_AGT` |
| 3 | Persona Responses | `PERSONA_GRID` |
| 4 | Executive Decision | `EXEC_SUPV` |
| 5 | Validation Score | `SCORE_OUT` |

Each panel is a dark card. Panels reveal sequentially (fade in) as the simulation progresses.

---

## Interaction Notes

- Cards on right: **not clickable** on landing — pure visual
- On dashboard: cards expand/highlight when their agent is active
- Active agent card: border brightens slightly (`rgba(255,255,255,0.15)`)
- Inactive: dimmed (`opacity: 0.5`)
- Score card: number counts up from 0 to final value

---

## What to Change from Nodum Reference

| Nodum | ExecuSim |
|-------|---------|
| "NODUM" brand | "ExecuSim" with green dot indicator |
| Platform / Use Cases / Pricing | How It Works / Personas / About |
| "The Content Machine" headline | "The Market Simulator" or "Simulate. Pivot. Validate." |
| "Initialize Canvas" CTA | "Run Simulation" or "Initialize Market" |
| SRC_TTOK / SRC_YT labels | PERSONA_SKEPT / STRATEGY_AGT / EXEC_SUPV |
| Content source cards | Agent node cards |
| Subtitle about content | "Simulate a market of AI buyers. Let an AI executive iterate until your idea shows traction." |
