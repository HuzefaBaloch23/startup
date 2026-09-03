import { type PointerEvent as ReactPointerEvent, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, List, X } from "@phosphor-icons/react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AutomationRuns from "./AutomationRuns";
import ChannelDemo from "./ChannelDemo";
import OpsDesk from "./OpsDesk";
import BuildTimeline from "./BuildTimeline";
import ContactForm from "./ContactForm";
import RecordMerge from "./RecordMerge";
import WorkflowCanvas from "./WorkflowCanvas";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "hello@mainframe.co";

const navigation = [
  { label: "Workflow", href: "#workflow" },
  { label: "Systems", href: "#systems" },
  { label: "Automation", href: "#automation" },
  { label: "Data", href: "#data" },
  { label: "Start a build", href: "#start" },
];

const services = [
  { title: "Automation", detail: "Repeatable work, in motion.", position: "automation" },
  { title: "Custom Software", detail: "Tools shaped around your team.", position: "software" },
  { title: "CRM Systems", detail: "Relationships with context intact.", position: "crm" },
  { title: "Websites", detail: "A clear front door for growth.", position: "websites" },
  { title: "Data Systems", detail: "Information ready to decide with.", position: "data" },
  { title: "AI Tools", detail: "Useful intelligence inside the work.", position: "ai" },
  { title: "Integrations", detail: "Every important tool talking.", position: "integrations" },
];

const runsItself = [
  "Routing and assignment",
  "Reminders and chasing",
  "Voice, chat, and email replies",
  "Record updates and data checks",
  "Scheduled syncs and reports",
  "Notifications, with the context attached",
];

const comesToYou = [
  "Decisions that need judgment",
  "Exceptions the rules did not predict",
  "Approvals over your threshold",
  "Anything with legal or safety weight",
  "Pricing you would have to defend",
  "The last word on a relationship",
];

type NavigatorWithConnection = Navigator & {
  connection?: { saveData?: boolean; effectiveType?: string };
};

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);

  return matches;
}

function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

function useDataSaver() {
  const [saveData] = useState(() => {
    if (typeof navigator === "undefined") return false;
    const connection = (navigator as NavigatorWithConnection).connection;
    return Boolean(connection?.saveData || connection?.effectiveType === "2g");
  });
  return saveData;
}

function MainframePage() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const heroScrollRef = useRef<HTMLElement | null>(null);
  const heroPinRef = useRef<HTMLDivElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const reducedMotion = useReducedMotion();
  const desktop = useMediaQuery("(min-width: 960px)");
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const saveData = useDataSaver();

  useEffect(() => {
    if (reducedMotion) {
      setLoaded(true);
      return;
    }
    const timer = window.setTimeout(() => setLoaded(true), 1150);
    return () => window.clearTimeout(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (!desktop || reducedMotion || saveData) return;

    const lenis = new Lenis({
      autoRaf: false,
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.9,
    });
    const tick = (time: number) => lenis.raf(time * 1000);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    const refreshId = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshId);
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [desktop, reducedMotion, saveData]);

  useEffect(() => {
    const onScroll = () => {
      const next = window.scrollY > 48;
      setCondensed((current) => (current === next ? current : next));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const menu = menuRef.current;
    const returnFocus = menuButtonRef.current;
    const focusables = () =>
      Array.from(
        menu?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.body.style.overflow = "hidden";
    window.setTimeout(() => focusables()[0]?.focus(), 0);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      returnFocus?.focus();
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!desktop || !finePointer || reducedMotion) return;

    const cursor = cursorRef.current;
    const auroras = Array.from(document.querySelectorAll<HTMLElement>(".mf-aurora"));
    const onPointerMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth) * 2 - 1;
      const ny = (event.clientY / window.innerHeight) * 2 - 1;
      auroras.forEach((aurora) => {
        aurora.style.setProperty("--aurora-x", String(nx));
        aurora.style.setProperty("--aurora-y", String(ny));
      });
      if (cursor) {
        cursor.style.transform = "translate3d(" + (event.clientX - 11) + "px, " + (event.clientY - 11) + "px, 0) scale(var(--cursor-scale, 1))";
        cursor.dataset.visible = "true";
      }
    };
    const onPointerLeave = () => {
      if (cursor) cursor.dataset.visible = "false";
    };
    const interactive = Array.from(document.querySelectorAll<HTMLElement>("[data-cursor]"));
    const activate = () => document.body.classList.add("mf-cursor-is-active");
    const deactivate = () => document.body.classList.remove("mf-cursor-is-active");

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onPointerLeave);
    interactive.forEach((element) => {
      element.addEventListener("mouseenter", activate);
      element.addEventListener("mouseleave", deactivate);
    });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
      interactive.forEach((element) => {
        element.removeEventListener("mouseenter", activate);
        element.removeEventListener("mouseleave", deactivate);
      });
      document.body.classList.remove("mf-cursor-is-active");
    };
  }, [desktop, finePointer, reducedMotion]);

  useLayoutEffect(() => {
    if (reducedMotion || saveData) return;

    const ctx = gsap.context(() => {
      const media = gsap.matchMedia();
      const root = rootRef.current;
      if (!root) return;

      gsap.utils.toArray<HTMLElement>(".js-reveal", root).forEach((element) => {
        gsap.fromTo(
          element,
          { autoAlpha: 0, y: 34, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            ease: "power3.out",
            duration: 0.82,
            scrollTrigger: { trigger: element, start: "top 84%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".mf-boundary-col", root).forEach((column) => {
        const fromLeft = column.classList.contains("mf-boundary-col--auto");
        gsap.fromTo(
          column.querySelectorAll(".js-boundary"),
          { autoAlpha: 0, x: fromLeft ? -26 : 26 },
          {
            autoAlpha: 1,
            x: 0,
            ease: "power3.out",
            duration: 0.7,
            stagger: 0.07,
            scrollTrigger: { trigger: column, start: "top 82%", once: true },
          },
        );
      });

      gsap.fromTo(
        ".mf-tl-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "power3.out",
          duration: 0.85,
          stagger: 0.12,
          scrollTrigger: { trigger: ".mf-timeline", start: "top 84%", once: true },
        },
      );

      gsap.fromTo(
        ".mf-tl-mark",
        { autoAlpha: 0, y: 8 },
        {
          autoAlpha: 1,
          y: 0,
          ease: "power2.out",
          duration: 0.5,
          stagger: 0.12,
          delay: 0.45,
          scrollTrigger: { trigger: ".mf-timeline", start: "top 84%", once: true },
        },
      );

      gsap.fromTo(
        ".mf-boundary-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "power2.out",
          duration: 1.1,
          scrollTrigger: { trigger: ".mf-boundary-split", start: "top 80%", once: true },
        },
      );

      gsap.utils.toArray<HTMLElement>(".mf-idx-row", root).forEach((row, index) => {
        gsap.fromTo(
          row.querySelector(".mf-idx-link"),
          { yPercent: 108, autoAlpha: 0 },
          {
            yPercent: 0,
            autoAlpha: 1,
            ease: "power3.out",
            duration: 0.85,
            delay: index * 0.055,
            scrollTrigger: { trigger: row, start: "top 92%", once: true },
          },
        );
      });

      gsap.utils.toArray<HTMLElement>(".mf-words > span > span", root).forEach((line, index) => {
        gsap.fromTo(
          line,
          { yPercent: 112 },
          {
            yPercent: 0,
            ease: "power3.out",
            duration: 0.9,
            delay: index * 0.09,
            scrollTrigger: { trigger: ".mf-words-section", start: "top 82%", once: true },
          },
        );
      });

      media.add("(min-width: 960px)", () => {
        const labels = gsap.utils.toArray<HTMLElement>(".mf-exploded-key > div", root);
        gsap.set(labels, { autoAlpha: 0, y: 14 });
        gsap.set(".mf-machine-status--open", { autoAlpha: 0, y: 14 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroScrollRef.current,
            start: "top top",
            end: "+=130%",
            pin: heroPinRef.current,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        timeline
          .to(".mf-hero-copy", { autoAlpha: 0.32, yPercent: -9, scale: 0.97, filter: "blur(2px)", duration: 0.5 }, 0)
          .to(".mf-hero-bottom", { autoAlpha: 0, y: 20, duration: 0.18 }, 0.05)
          .to(".mf-machine-status--closed", { autoAlpha: 0, y: -12, duration: 0.18 }, 0.22)
          .to(".mf-machine-status--open", { autoAlpha: 1, y: 0, duration: 0.24 }, 0.4);

        labels.forEach((label, index) => {
          timeline.to(label, { autoAlpha: 1, y: 0, duration: 0.13 }, 0.36 + index * 0.055);
        });
      });

      media.add("(min-width: 768px) and (max-width: 959px)", () => {
        gsap.fromTo(
          ".mf-hero-copy",
          { y: 0 },
          {
            y: -42,
            ease: "none",
            scrollTrigger: { trigger: heroScrollRef.current, start: "top top", end: "bottom top", scrub: 1 },
          },
        );
      });

      return () => media.revert();
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, saveData]);

  const closeMenu = () => setMenuOpen(false);
  const updateCtaGlow = (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    target.style.setProperty("--pointer-x", (event.clientX - bounds.left) / bounds.width * 100 + "%");
    target.style.setProperty("--pointer-y", (event.clientY - bounds.top) / bounds.height * 100 + "%");
  };

  return (
    <div ref={rootRef} className={"mf-site " + (menuOpen ? "mf-menu-open" : "")}>
      <a className="mf-skip-link" href="#main-content">Skip to content</a>
      <div className={"mf-loader " + (loaded ? "is-complete" : "")} aria-live="polite" aria-label="Mainframe is loading">
        <span className="mf-loader-word mf-loader-word--one">INITIALIZING</span>
        <span className="mf-loader-word mf-loader-word--two">WE BUILD</span>
        <span className="mf-loader-word mf-loader-word--three">WHAT&apos;S NEXT.</span>
        <span className="mf-loader-progress" />
      </div>

      <header className={"mf-header " + (condensed ? "is-condensed" : "")}>
        <a className="mf-wordmark" href="#top" data-cursor aria-label="Mainframe home">
          MAINFRAME<span>®</span>
        </a>
        <nav className="mf-desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <a key={item.label} href={item.href} data-cursor>{item.label}</a>
          ))}
        </nav>
        <a className="mf-header-cta" href="#start" data-cursor>
          Build with us <ArrowUpRight size={16} weight="bold" aria-hidden="true" />
        </a>
        <button
          ref={menuButtonRef}
          className="mf-menu-button"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          data-cursor
        >
          {menuOpen ? <X size={25} weight="regular" /> : <List size={25} weight="regular" />}
        </button>
      </header>

      <div ref={menuRef} id="mobile-navigation" className="mf-mobile-menu" aria-hidden={!menuOpen}>
        <div>
          <p>MAINFRAME / MENU</p>
          {navigation.map((item) => (
            <a key={item.label} href={item.href} onClick={closeMenu}>
              {item.label}<ArrowUpRight size={22} aria-hidden="true" />
            </a>
          ))}
        </div>
        <a href={"mailto:" + EMAIL} onClick={closeMenu}>hello@mainframe.co</a>
      </div>

      <main id="main-content" tabIndex={-1}>
        <section id="top" ref={heroScrollRef} className="mf-hero-scroll" aria-labelledby="hero-title">
          <div ref={heroPinRef} className="mf-hero-pin">
            <div className="mf-aurora" aria-hidden="true"><i /><i /><i /></div>
            <div className="mf-hero-noise" aria-hidden="true" />
            <div className="mf-hero-copy">
              <p className="mf-hero-intro">Mainframe builds the operational layer behind ambitious businesses.</p>
              <h1 id="hero-title">
                <span>WE BUILD</span>
                <span>SYSTEMS THAT</span>
                <span>MOVE BUSINESS.</span>
              </h1>
              <a className="mf-hero-link" href="#start" data-cursor>
                Start a real build <ArrowUpRight size={20} aria-hidden="true" />
              </a>
            </div>

            <div className="mf-machine-status mf-machine-status--closed">
              <span>AUTOMATION, SOFTWARE, DATA</span>
              <span>SCROLL <ArrowDown size={15} aria-hidden="true" /></span>
            </div>
            <div className="mf-machine-status mf-machine-status--open">
              <span>SEVEN WAYS WE BUILD</span>
              <span>KEEP GOING.</span>
            </div>

            <div className="mf-exploded-key" aria-hidden="true">
              {services.map((service) => (
                <div key={service.title}><i aria-hidden="true" /><span>{service.title}</span></div>
              ))}
            </div>

            <div className="mf-hero-bottom">
              <span>Automation</span><span>Custom software</span><span>Clean data</span><span>AI tools</span>
            </div>
          </div>
        </section>

        <section id="workflow" className="mf-flow-section mf-section-shell" aria-labelledby="workflow-title">
          <div className="mf-scene-copy">
            <h2 id="workflow-title" className="js-reveal">One request, from arrival to done.</h2>
            <p className="js-reveal">This is a system running. Work arrives, keeps its context, follows the rules you set, and stops for a person only when judgment is genuinely needed.</p>
            <a className="mf-inline-button js-reveal" href="#start" data-cursor>Map your version <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <WorkflowCanvas reducedMotion={reducedMotion} />
        </section>

        <section id="systems" className="mf-intro-section mf-section-shell">
          <div className="mf-intro-rail" aria-hidden="true"><span /></div>
          <p className="mf-section-note js-reveal">The business does not need more tabs. It needs a system with a point of view.</p>
          <div className="mf-intro-grid">
            <h2 className="js-reveal">Everything you use works better when it works together.</h2>
            <div className="mf-intro-copy js-reveal">
              <p>We take the work spread across conversations, software, spreadsheets, and memory, then turn it into tools your people can actually rely on.</p>
              <a href="#start" className="mf-text-link" data-cursor>Bring us the messy version <ArrowRight size={18} aria-hidden="true" /></a>
            </div>
          </div>
          <div className="mf-channel-band">
            <div className="mf-channel-copy js-reveal">
              <p>What we actually ship</p>
              <h3>Assistants and tools on the channels people already use.</h3>
              <p>A WhatsApp assistant that checks stock and takes the order. An inbox that reads its own invoices. A Slack alert that arrives with the context attached. One system underneath all of it.</p>
            </div>
            <div className="js-reveal">
              <ChannelDemo reducedMotion={reducedMotion} />
            </div>
          </div>

          <ol className="mf-index" aria-label="Mainframe services">
            {services.map((service, index) => (
              <li key={service.title} className="mf-idx-row">
                <a className="mf-idx-link" href="#start" data-cursor>
                  <span className="mf-idx-num">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mf-idx-name">
                    <span>{service.title}</span>
                    <span aria-hidden="true">{service.title}</span>
                  </span>
                  <span className="mf-idx-detail">{service.detail}</span>
                  <ArrowUpRight size={22} weight="light" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </section>

        <section id="automation" className="mf-automation-scene mf-section-shell" aria-labelledby="automation-title">
          <div className="mf-scene-copy">
            <h2 id="automation-title" className="js-reveal">Automation that keeps the business moving.</h2>
            <p className="js-reveal">A request enters. Context stays with it. The next useful action happens without someone rebuilding the same answer by hand.</p>
            <a className="mf-inline-button js-reveal" href="#start" data-cursor>Map a workflow <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="js-reveal">
            <AutomationRuns reducedMotion={reducedMotion} />
          </div>
        </section>

        <section className="mf-software-scene mf-section-shell" aria-labelledby="software-title">
          <div className="js-reveal">
            <OpsDesk reducedMotion={reducedMotion} />
          </div>
          <div className="mf-scene-copy mf-scene-copy--software">
            <h2 id="software-title" className="js-reveal">Software that fits how your business works, not the other way around.</h2>
            <p className="js-reveal">The best internal tool feels obvious because it is built around your actual decisions, handoffs, and standards.</p>
            <div className="mf-software-facts js-reveal">
              <span>Internal tools</span><span>Client portals</span><span>Operational dashboards</span>
            </div>
          </div>
        </section>

        <section id="data" className="mf-data-scene mf-section-shell" aria-labelledby="data-title">
          <div className="mf-scene-copy mf-scene-copy--data">
            <h2 id="data-title" className="js-reveal">Data, cleaned, connected, and ready to work.</h2>
            <p className="js-reveal">We turn the scattered record into something the business can trust, share, automate, and use to make the next decision.</p>
          </div>
          <div className="js-reveal">
            <RecordMerge reducedMotion={reducedMotion} />
          </div>
        </section>

        <section className="mf-words-section" aria-label="Mainframe operational principles">
          <div className="mf-words-inner">
            <p className="mf-words-eyebrow js-reveal"><i aria-hidden="true" />The point</p>
            <p className="mf-words">
              <span><span>Less dragging.</span></span>
              <span><span>More moving.</span></span>
            </p>
            <p className="mf-words-sub js-reveal">Every hour spent moving work between tools is an hour the business is not moving. That is the whole argument.</p>
          </div>
        </section>

        <section id="boundary" className="mf-boundary mf-section-shell" aria-labelledby="boundary-title">
          <p className="mf-section-note js-reveal">You draw the line.</p>
          <h2 id="boundary-title" className="js-reveal">Not every task should run itself.</h2>
          <div className="mf-boundary-split">
            <div className="mf-boundary-line" aria-hidden="true" />
            <div className="mf-boundary-col mf-boundary-col--auto">
              <h3><i aria-hidden="true" />Runs without you</h3>
              <ul>
                {runsItself.map((item, index) => (
                  <li key={item} className="js-boundary"><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mf-boundary-col mf-boundary-col--human">
              <h3><i aria-hidden="true" />Comes to you first</h3>
              <ul>
                {comesToYou.map((item, index) => (
                  <li key={item} className="js-boundary"><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mf-boundary-note js-reveal">
            <b>You set the line, and you can move it.</b> Everything on the left runs on its own. Everything on the right still gets done — gathered, checked, and prepared — then handed to you with the context already attached.
          </p>
        </section>

        <section className="mf-process-section mf-section-shell" aria-labelledby="process-title">
          <div className="mf-process-head">
            <h2 id="process-title" className="js-reveal">We go from messy to working. Fast, and properly.</h2>
            <p className="js-reveal">The work stays close to the people who do it. That is how the system gets adopted, not just presented.</p>
          </div>
          <div className="js-reveal">
            <BuildTimeline />
          </div>
        </section>

        <section className="mf-statement-section" aria-label="Mainframe statement">
          <p>When the system gets clear,</p>
          <h2><span>EVERYTHING</span><span>MOVES.</span></h2>
          <div className="mf-statement-lights" aria-hidden="true"><i /><i /><i /><i /></div>
        </section>

        <section id="start" className="mf-cta-section" onPointerMove={updateCtaGlow} aria-labelledby="cta-title">
          <div className="mf-aurora mf-aurora--cta" aria-hidden="true"><i /><i /><i /></div>
          <div className="mf-cta-grid" aria-hidden="true" />
          <p>Bring the friction. We will find the system.</p>
          <h2 id="cta-title">Tell us what should run itself.</h2>
          <ContactForm email={EMAIL} />
          <span className="mf-cta-email">or write to <a href={"mailto:" + EMAIL}>{EMAIL}</a></span>
        </section>
      </main>

      <footer className="mf-footer">
        <a className="mf-wordmark" href="#top" data-cursor>MAINFRAME<span>®</span></a>
        <p>Automation, custom software, clean data, AI tools, and integrations for businesses ready to move.</p>
        <span>© {new Date().getFullYear()} Mainframe</span>
      </footer>

      {desktop && finePointer && !reducedMotion && <div ref={cursorRef} className="mf-cursor" data-visible="false" aria-hidden="true" />}
    </div>
  );
}

export default MainframePage;
