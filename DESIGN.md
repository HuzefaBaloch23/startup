# Mainframe design system

## Direction

Mainframe is a dark, technical studio landing page rather than a conventional agency or SaaS site. The world is built from deep tinted rooms, graphic display typography, drifting aurora light, and a disciplined signal palette.

The governing rule: **every chapter carries a working panel, not a picture.** There is no stock imagery, no photography, and no feature-card grid. What the studio sells is demonstrated live in the page.

The narrative:

1. A typographic proposition, full bleed.
2. One request routed through a system, including the branch where it stops for a person.
3. What the studio builds, as an index, plus the channels work arrives on.
4. Repeated work closing itself out, all day.
5. The internal tool that work sits in.
6. Scattered records reconciled into one trusted record.
7. The line between what runs alone and what comes back to you.
8. How a build actually sequences.
9. A direct ask.

## Brand, type, and colour

- `index.html` loads Helvetica Now Display Medium and Regular. `index.css` exposes them as the display and body font variables, with Helvetica Neue and Arial fallbacks.
- Base ink: `#07070b`
- Light text: `#f4f1ed`
- Supporting text: `#ada9b4`

Signal colours, which carry meaning rather than decoration:

| Token | Value | Means |
| --- | --- | --- |
| `--pink` | `#e9b9c8` | Work that runs without you |
| `--amber` | `#f2b98a` | Work that comes back to a person |
| `--iris` | `#8f7dff` | Index numbering, process, timeline |
| `--cyan` | `#56c8e8` | Data and reconciliation |

The pink/amber pairing is used consistently: the run log's held rows, the boundary section's two columns, the divider between them, and the hold step in the contact-adjacent copy all use the same two colours for the same two ideas.

## Atmosphere

Each chapter sits on its own deep tint rather than one shared black, so scrolling moves through blue, plum, teal and violet without ever dropping contrast under white type:

- Hero `#0d0b16`, workflow `rgb(8,13,20)`, systems `rgb(12,8,18)`, automation `rgb(10,16,20)`, data `rgb(7,12,20)`, marquee band violet gradient, process `rgb(10,9,18)`, footer `rgb(7,6,12)`.
- The statement band is the single light inversion: `#f0eee9`.
- The pink band is lit top-left and deepened bottom-right across three gradient layers, hemmed by ink hairlines.
- Two aurora fields (hero and CTA) drift on 26/29/32-second loops and lean toward the pointer with a 900ms eased parallax.
- A tiled SVG grain sits over the page at 4.5% `overlay`, mainly to stop large dark gradients banding.

## Structure

- `MainframePage.tsx` owns page copy, semantic structure, menu, loader, GSAP and ScrollTrigger choreography, Lenis lifecycle, the condensing header, pointer treatment, and fallbacks.
- `thread.ts` holds the single job identity every live panel shares.
- `useOnScreen.ts` gates panel intervals on visibility.
- Live panels: `WorkflowCanvas`, `ChannelDemo`, `AutomationRuns`, `OpsDesk`, `RecordMerge`, `BuildTimeline`, `ContactForm`.
- `index.css` holds the material system, per-chapter grounds, responsive composition, and reduced-motion overrides.

## Motion

- GSAP and ScrollTrigger drive scroll sequences; Lenis is desktop-only with normal motion and an unconstrained connection.
- The header condenses past 48px into a floating pill: width `min(70rem, 100% - 2.4rem)`, 999px radius, translucent, `backdrop-filter: blur(16px)`. Blend mode drops from `difference` to `normal`, because `difference` over a translucent panel inverts the panel.
- The service index wipes to paper on hover with a `transform-origin` swap so the fill enters from the left and retreats to the right, while the label swaps for its own duplicate.
- Timeline bars draw `scaleX 0 → 1`; boundary items arrive from their own side; the divider draws downward.
- Live panels animate on their own intervals, paused when off-screen.

## Accessibility and responsive behavior

- Reduced motion removes non-essential animation and freezes live panels in a completed, readable state.
- Off-screen panels stop their intervals via IntersectionObserver with a 240px margin.
- The contact form has wired labels, `aria-invalid`, `aria-describedby` error links, and moves focus to the first invalid field.
- The mobile menu exposes expanded state, traps focus, supports Escape, and restores focus to its trigger.
- Panels that rely on absolute coordinates (workflow, timeline) fall back to stacked lists on small screens.

## Boundaries

Mainframe is presented as a studio for automation, custom software, CRM systems, websites, data systems, AI tools, and integrations. The site does not invent client logos, outcome metrics, case studies, or team biographies. Demo data is illustrative and uses `.example` domains. Channel names and accent colours (WhatsApp, Slack, Gmail-style mail) are used descriptively to say which surface a build lands on; the panels are Mainframe's own, not reproductions of those products' interfaces. The only implemented contact route is `hello@mainframe.co`.
