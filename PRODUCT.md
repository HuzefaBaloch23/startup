# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web

## Stack

React with TypeScript, Vite, and Tailwind CSS. GSAP with ScrollTrigger for scroll choreography, Lenis for desktop smooth scrolling, Phosphor for icons.

## Shipped experience

Mainframe® is a scroll-led landing page for an automation studio. It opens with a full-bleed typographic proposition, then demonstrates the offer through a sequence of live panels rather than illustrations: a request routed through a system, the channels work arrives on, repeated work closing itself out, the internal tool the work sits in, scattered records reconciled into one, the line between automated and human work, how a build sequences, and a direct ask.

## One job, followed through the page

Every live panel shows the same piece of work from a different angle, so the page reads as one connected system rather than a set of unrelated demos. The identity lives in `src/thread.ts`.

Order **#5512** for **Halcyon Fixings** appears as:

- the first item routed through the workflow diagram
- the WhatsApp conversation that creates it
- a closed row in the run log
- a scheduled row in the internal tool
- the order that triggers a customer-record reconciliation

## Visitor-facing message

- The main message says: “WE BUILD SYSTEMS THAT MOVE BUSINESS.”
- The supporting statement says: “Mainframe builds the operational layer behind ambitious businesses.”
- The workflow chapter says: “One request, from arrival to done.”
- The systems chapter says: “Everything you use works better when it works together.”
- The automation chapter says: “Automation that keeps the business moving.”
- The software chapter says: “Software that fits how your business works, not the other way around.”
- The data chapter says: “Data, cleaned, connected, and ready to work.”
- The statement band says: “Less dragging. More moving.”
- The boundary chapter says: “Not every task should run itself,” and frames the split as the client's choice: everything on the left runs alone, everything on the right still gets prepared and then handed over. The closing line is “You set the line, and you can move it.”
- The method chapter says: “We go from messy to working. Fast, and properly.”
- It closes with “Tell us what should run itself.”

## Live panels

- **Workflow** — a request moves along a spine of five nodes, with a dashed branch to “Sent to a person.” Some items take the branch instead of finishing.
- **Channels** — the same order on WhatsApp, plus an email thread, a Slack channel, and a web form. Each channel has its own accent and layout; WhatsApp and the form read as conversations, email and Slack as feeds.
- **Run log** — new runs push in from the top every 2.4s on uneven timestamps. Roughly one in five is “held” and waiting on a person.
- **Ops desk** — the only light-ground panel, an internal jobs table whose rows advance stage over time.
- **Record merge** — three systems disagree about one customer; fields resolve one at a time, each showing which source won and why.
- **Build timeline** — four overlapping phases across eight weeks, with three deliverable markers.

## Contact model

The primary route is a contact form at the end of the page collecting name, email, optional phone, and what the visitor wants automated. Validation is client-side with linked error messages and focus management.

**There is no backend.** Submitting composes an email to `hello@mainframe.co` with the details filled in, which the visitor then sends from their own mail client. Wiring a real endpoint is a pending decision.

Desktop and mobile navigation link to on-page chapters: Workflow, Systems, Automation, Data, and Start a build. “Get in touch” and the footer address both open a direct email link.

## Media

The page ships **no image or video assets.** Every chapter is rendered from markup, CSS and SVG. The `public/` directory is empty by design.

## Product constraints

- Mainframe's supplied name and email address are represented exactly as implemented.
- No invented client logos, outcome metrics, case studies, or team biographies. Demo data is illustrative and uses `.example` domains.
- Channel names and brand accent colours are used descriptively to indicate which surface a build lands on. The panels are Mainframe's own surfaces, not reproductions of those products' interfaces.
- The experience remains usable across mobile and desktop, with a responsive menu below the medium breakpoint that traps keyboard focus and returns focus to its toggle.
- A reduced-motion preference removes non-essential animation and freezes every live panel in a completed, readable state.
- Live panels stop their intervals when scrolled off-screen.
- Desktop scroll choreography is progressive enhancement: the hero pins only above the desktop breakpoint, and on mobile the full story remains a normal readable document.
