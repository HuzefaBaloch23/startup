# Product

<!-- impeccable:product-schema 1 -->

## Platform

Web

## Stack

React with TypeScript, Vite, and Tailwind CSS.

## Shipped experience

Mainframe® is a scroll-led landing page for an automation studio. It opens with A.R.I.A. and a direct proposition, then turns the visitor's scattered-work problem into a visual story: leaking work, a connected Mainframe system, the three ways Mainframe builds, the boundary between human judgment and repeatable work, a request moving through its route, a practical operating method, and a direct invitation to start.

## Visitor-facing message

- The main message says: “Work that repeats should run itself.”
- The supporting statement says: “Mainframe turns messy operations into automation, custom software, and clean data systems.”
- The hero annotation says: “Meet A.R.I.A., Mainframe's automation intelligence agent.”
- “Map a workflow” is the primary response choice, with “Build a tool,” “Clean the data,” and “Copy email” as secondary actions.
- The page names a familiar problem: “Most work doesn’t stop. It leaks.”
- It explains the offer with “A system, not a stack.” and the three services: automation, custom software, and clean data.
- It sets a responsible automation boundary with “Not every task should run itself.” and clearly separates decisions, exceptions, and approvals from routing, reminders, and record updates.
- It makes the operational journey concrete with “A request arrives.”, “Context stays with it.”, “The route becomes clear.”, and “Useful work continues.”
- It closes with “What should run without you?” and a project-start email action that accepts a forwarded email, screenshot, spreadsheet, or a short process description.

## Contact model

All current contact paths use the supplied address, `hello@mainframe.co`.

- Desktop and mobile navigation link to the relevant on-page chapters: Automation, Software, Data, and Start here. “Get in touch” opens a direct email link.
- The primary response and two secondary service links are email links with contextual subjects.
- “Copy email” copies the address to the clipboard and announces confirmation to assistive technology. A temporary textarea fallback is used if the Clipboard API is unavailable.
- The final intake keeps the contact model local and direct. Visitors select what they have, can add a one-sentence description, and open a populated email draft. Selecting a source also suggests the matching service starting point without preventing an override.

## Supplied media

The hero uses a local, scrub-optimised derivative of the provided CloudFront video as its only background media:

`https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4`

`public/mainframe-motion.mp4` is a 1600×904, 24fps H.264 version with an intra frame about every quarter-second and no audio. It is muted, inline, and never autoplayed. On a capable desktop connection it is deferred until the browser is idle and revealed once its first frame can be drawn. Horizontal mouse movement then advances or reverses the film itself, so the computer-headed figure changes with the cursor. The seek queue is coalesced to one frame and serialized around media completion. It is not requested on small screens, reduced-motion settings, Data Saver, or 2G-class connections.

`public/mainframe-relay.png` is an original generated editorial still life of a physical relay sorting a paper route. It supports the page's systems chapter and contains no claims, product UI, or customer data.

`public/mainframe-leak.png` is an original generated editorial still life of scattered paper routes and relay parts. It supports the friction chapter and contains no text, product UI, or customer data.

`public/mainframe-archive.png` is an original generated editorial portrait of a precision archive machine. It supports the method chapter and contains no text, product UI, or customer data.

`public/mainframe-judgment.png` is an original generated editorial still life of a physical route splitting toward a manual decision lever and an automated relay. It supports the responsible-automation chapter and contains no text, product UI, or customer data.

## Product constraints

- Mainframe’s supplied name, film asset, and email address are represented exactly as implemented.
- The experience remains usable across mobile and desktop navigation states, with a responsive menu below the medium breakpoint that traps keyboard focus while open and returns focus to its toggle when closed.
- A reduced-motion preference and small viewport both avoid requesting the decorative video, render the message immediately, and reveal the action choices without their entrance delay.
- The opening makes the studio's focus explicit: workflow automation, custom software, and clean data systems.
- Desktop scroll motion is progressive enhancement only: the system assembly and request-routing chapter pin only above the desktop breakpoint. Tablets retain lightweight reading-order reveals. On mobile and under reduced-motion settings, the complete story remains a normal readable document with all routes and content visible.
