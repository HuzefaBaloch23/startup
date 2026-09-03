# Mainframe design system

## Direction

Mainframe is a dark, cinematic technical studio rather than a conventional agency or SaaS landing page. Its visual world is a bolted systems manual: black anodized aluminium, smoked glass, graphic display typography, hard physical parts, quiet off-white light, and a single pale-pink signal.

The narrative is deliberate:

1. A closed computational core introduces the proposition.
2. Scroll opens that core into the seven ways Mainframe builds.
3. Automation, custom software, and clean data each receive their own physical scene.
4. The page moves through process, a large statement, and one clear invitation to start a build.

The page avoids feature-card grids, neon futurism, gradient text, decorative glass cards, and generic agency proof blocks.

## Brand, type, and colour

- index.html loads Helvetica Now Display Medium and Regular. index.css exposes them as the display and body font variables, with Helvetica Neue and Arial fallbacks.
- Main background: #070709
- Main light text: #f4f1ed
- Supporting text: #ada9b4
- Signal colour: #e9b9c8
- The light software scene uses #f4f1ed as a deliberate inversion, not a separate brand palette.
- Display type is compressed through large scale and tight tracking, never through gradient fills. Long body copy stays in a readable measure.

## Structure

- MainframePage.tsx owns the page copy, semantic structure, menu, loader, GSAP and ScrollTrigger choreography, Lenis lifecycle, desktop pointer treatment, and fallback behavior.
- EngineCore.tsx is the isolated R3F assembly. It receives a mutable control ref and never uses React state in its render loop.
- index.css contains the physical material system, responsive composition, browser-surface styling, mobile menu, and reduced-motion overrides.

The page chapters are:

1. Loader
2. Pinned hero and explodable 3D core
3. System statement
4. Automation route
5. Software architecture and human versus AI rule
6. Data transformation
7. Lateral statement and one two-row marquee
8. Process timeline
9. Cinematic statement
10. Magnetic contact call to action and footer

## Motion

- GSAP and ScrollTrigger control all major scroll sequences.
- On desktop, the hero pins once while the core opens, hero copy softens, and capability labels appear around the disassembled core.
- The automation route line draws on scroll; small signal packets add continuous, non-essential movement.
- Text and data scenes use clip-path, filter, opacity, and transform instead of layout-property animation.
- Lenis is enabled only on desktop with normal motion and a non-constrained connection. It is connected to ScrollTrigger update.
- The actual Three/R3F scene is lazy-loaded as its own production chunk and is disabled for narrow screens, reduced motion, Data Saver, and 2G-like connections.
- The custom cursor is desktop-only and progressively enhances standard pointer behavior.

## Accessibility and responsive behavior

- The visible hero has a semantic h1; visual machine images are decorative while the SVG automation route has an accessible description.
- All navigation uses real anchors. The mobile menu exposes expanded state, traps keyboard focus, supports Escape, and restores focus to its trigger.
- A visible focus ring, themed selection colour, and themed scrollbar are part of the shipped browser surface.
- Tablet uses native scrolling and a compact composition instead of inheriting desktop pinning.
- Mobile removes the live canvas and capability field, keeps the core still image, uses the full-screen menu, and preserves all content in reading order.
- Prefers-reduced-motion removes non-essential animation and ScrollTriggers while keeping every section visible and usable.

## Image provenance

The replacement scene assets are generated physical-machine studies, not fake interface screenshots:

- public/mainframe-core-night.png
- public/mainframe-route-night.png
- public/mainframe-stack-night.png
- public/mainframe-data-night.png

Each PNG carries its generation prompt in the impeccable:prompt metadata field so the creative intent stays with the file.

## Boundaries

Mainframe is presented as a studio for automation, custom software, CRM systems, websites, data systems, AI tools, and integrations. The site does not invent client logos, outcome metrics, case studies, team biographies, or guarantees. The only implemented external contact route is hello@mainframe.co.
