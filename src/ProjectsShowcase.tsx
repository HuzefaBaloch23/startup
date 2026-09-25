import { useState } from "react";
import { ArrowUpRight, Sparkle } from "@phosphor-icons/react";

interface CaseStudy {
  id: string;
  category: "Websites" | "Custom Software" | "CRM Systems" | "Automation";
  client: string;
  industry: string;
  title: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
  deliverables: string[];
  mockupType: "browser" | "dashboard" | "kanban" | "terminal";
}

const CASE_STUDIES: CaseStudy[] = [
  {
    id: "veloce",
    category: "Websites",
    client: "Veloce Luxury Store",
    industry: "Luxury E-Commerce & Retail",
    title: "Headless E-Commerce Flagship with 0.2s Load Speed",
    challenge:
      "A slow legacy e-commerce site with 3.8s load times was bleeding mobile traffic and causing a 58% cart abandonment rate.",
    solution:
      "Engineered an ultra-fast headless React web store with 3D product viewports, instant sub-second search, and streamlined one-click checkout.",
    metrics: [
      { label: "Lighthouse Score", value: "100 / 100" },
      { label: "Load Speed", value: "0.22s" },
      { label: "Mobile Checkout", value: "+64%" },
    ],
    deliverables: ["Headless React Storefront", "3D Interactive Viewport", "Stripe 1-Click Checkout", "Global Edge CDN"],
    mockupType: "browser",
  },
  {
    id: "halcyon",
    category: "Custom Software",
    client: "Halcyon Fleet Logistics",
    industry: "Distribution & Wholesale",
    title: "Bespoke Operations Desk & Autonomous Fleet Dispatcher",
    challenge:
      "Dispatchers spent 18 hours every week copying job tickets from WhatsApp and emails into fragile shared spreadsheets.",
    solution:
      "Built a tailored operations desk web application that automatically ingests orders, checks live warehouse stock, and dispatches drivers.",
    metrics: [
      { label: "Time Saved / Wk", value: "14 hrs / person" },
      { label: "Dropped Orders", value: "0" },
      { label: "Annual Payroll Saved", value: "£140k / yr" },
    ],
    deliverables: ["Custom Dispatch PWA", "Live Driver Telemetry", "Instant Stock Verification", "Automated Billing"],
    mockupType: "dashboard",
  },
  {
    id: "apex",
    category: "CRM Systems",
    client: "Apex Capital Advisory",
    industry: "Finance & B2B Consulting",
    title: "Unified Multi-Channel CRM & Automated Deal Pipeline",
    challenge:
      "High-value client inquiries from WhatsApp, LinkedIn, and website forms were scattered across employee personal phones and missed.",
    solution:
      "Designed a unified CRM architecture connecting WhatsApp, Email, and Web into an automated pipeline with instant lead enrichment and follow-up.",
    metrics: [
      { label: "Lead Response Time", value: "< 45 seconds" },
      { label: "New Pipeline Unlocked", value: "£420,000" },
      { label: "Lost Leads", value: "0%" },
    ],
    deliverables: ["Multi-Channel CRM Setup", "WhatsApp Team Inbox", "Automated Enrichment", "Pipeline Dashboard"],
    mockupType: "kanban",
  },
  {
    id: "omnicore",
    category: "Automation",
    client: "OmniCore Supply Chain",
    industry: "Manufacturing & Inventory",
    title: "Autonomous Multi-Depot Inventory & Invoicing Pipeline",
    challenge:
      "Managing stock across 4 physical depots required 3 staff members doing daily manual CSV exports, leading to constant stock-outs.",
    solution:
      "Created an automated data synchronization engine that links Shopify, NetSuite, and warehouse scanners with zero human intervention.",
    metrics: [
      { label: "Manual CSV Uploads", value: "0 (Retired)" },
      { label: "Sync Latency", value: "0.04s" },
      { label: "Stock Accuracy", value: "99.99%" },
    ],
    deliverables: ["Bi-Directional API Bus", "Barcode Scanner Sync", "Automated PO Matching", "Discord/Slack Alerts"],
    mockupType: "terminal",
  },
];

const CATEGORIES = ["All Work", "Websites", "Custom Software", "CRM Systems", "Automation"] as const;

export default function ProjectsShowcase() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All Work");
  const [activeProject, setActiveProject] = useState<string>(CASE_STUDIES[0].id);

  const filteredStudies =
    selectedFilter === "All Work"
      ? CASE_STUDIES
      : CASE_STUDIES.filter((s) => s.category === selectedFilter);

  return (
    <section id="work" className="mf-projects-section mf-section-shell" aria-labelledby="projects-title">
      <div className="mf-projects-header">
        <div className="mf-projects-left">
          <span className="mf-pill-eyebrow">
            <span className="mf-pill-dot" /> PROVEN DELIVERABLES
          </span>
          <h2 id="projects-title">Real systems. Measurable business results.</h2>
          <p>
            Explore how we engineer custom software, automated pipelines, modern CRMs, and high-performance websites for ambitious companies.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="mf-projects-filters" role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`mf-filter-btn ${selectedFilter === cat ? "is-active" : ""}`}
              onClick={() => setSelectedFilter(cat)}
              data-cursor
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mf-showcase-container">
        {/* Case Study Cards Grid */}
        <div className="mf-case-studies-grid">
          {filteredStudies.map((study) => {
            const isSelected = activeProject === study.id;

            return (
              <div
                key={study.id}
                className={`mf-study-card ${isSelected ? "is-selected" : ""}`}
                onClick={() => setActiveProject(study.id)}
                data-cursor
              >
                <div className="mf-study-card-top">
                  <span className="mf-study-badge">{study.category}</span>
                  <span className="mf-study-client">{study.client}</span>
                </div>

                <h3 className="mf-study-title">{study.title}</h3>
                <p className="mf-study-solution">{study.solution}</p>

                {/* Metrics Badges */}
                <div className="mf-study-metrics">
                  {study.metrics.map((m, idx) => (
                    <div key={idx} className="mf-mini-metric">
                      <span className="mf-mini-val">{m.value}</span>
                      <span className="mf-mini-label">{m.label}</span>
                    </div>
                  ))}
                </div>

                {/* Interactive Visual Mockup Preview */}
                <div className="mf-card-preview-area">
                  {study.mockupType === "browser" && (
                    <div className="mf-mockup-browser">
                      <div className="mf-browser-bar">
                        <div className="mf-browser-dots">
                          <span /><span /><span />
                        </div>
                        <span className="mf-browser-url">veloce-store.com — 100/100 LIGHTHOUSE</span>
                        <span className="mf-speed-badge">⚡ 0.22s</span>
                      </div>
                      <div className="mf-browser-screen">
                        <div className="mf-mock-nav">
                          <span className="mf-mock-brand">VELOCE</span>
                          <span className="mf-mock-pill">COLLECTION 2026</span>
                        </div>
                        <div className="mf-mock-hero">
                          <div className="mf-mock-product-preview">
                            <Sparkle size={20} color="#00f0ff" weight="duotone" />
                            <span>Interactive 3D Viewport Active</span>
                          </div>
                          <div className="mf-mock-buy-row">
                            <strong>£1,450.00</strong>
                            <span className="mf-mock-btn">Instant Apple Pay</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {study.mockupType === "dashboard" && (
                    <div className="mf-mockup-dashboard">
                      <div className="mf-dash-head">
                        <span className="mf-dash-title">HALCYON DISPATCH DESK v2.4</span>
                        <span className="mf-dash-status">● LIVE SYNC</span>
                      </div>
                      <div className="mf-dash-tickets">
                        <div className="mf-dash-row is-active">
                          <span className="mf-dash-ref">#5512</span>
                          <span className="mf-dash-name">Halcyon Fixings — 50 units</span>
                          <span className="mf-dash-tag is-cyan">DISPATCHED</span>
                        </div>
                        <div className="mf-dash-row">
                          <span className="mf-dash-ref">#5511</span>
                          <span className="mf-dash-name">Redgate Supplies — 120 units</span>
                          <span className="mf-dash-tag">IN ROUTE</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {study.mockupType === "kanban" && (
                    <div className="mf-mockup-kanban">
                      <div className="mf-kanban-cols">
                        <div className="mf-kcol">
                          <span className="mf-kcol-title">NEW LEADS (3)</span>
                          <div className="mf-kcard">
                            <strong>Dara W. (£85k)</strong>
                            <span>WhatsApp Ingested</span>
                          </div>
                        </div>
                        <div className="mf-kcol is-highlight">
                          <span className="mf-kcol-title">QUALIFIED (5)</span>
                          <div className="mf-kcard is-active">
                            <strong>Apex Capital (£420k)</strong>
                            <span className="mf-kbadge">MEETING BOOKED</span>
                          </div>
                        </div>
                        <div className="mf-kcol">
                          <span className="mf-kcol-title">WON (12)</span>
                          <div className="mf-kcard is-won">
                            <strong>Halcyon Group</strong>
                            <span>Contract Executed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {study.mockupType === "terminal" && (
                    <div className="mf-mockup-terminal">
                      <div className="mf-term-header">
                        <span className="mf-term-title">OMNICORE SYNC PIPELINE</span>
                        <span className="mf-term-latency">0.04s LATENCY</span>
                      </div>
                      <div className="mf-term-body">
                        <p className="mf-term-line">
                          <span className="mf-t-time">09:41:02</span>
                          <span className="mf-t-cyan">[INGEST]</span> Shopify Plus Order #5512 received
                        </p>
                        <p className="mf-term-line">
                          <span className="mf-t-time">09:41:03</span>
                          <span className="mf-t-volt">[NETSUITE]</span> Stock allocated: Depot 2 (0.02s)
                        </p>
                        <p className="mf-term-line is-success">
                          <span className="mf-t-time">09:41:03</span>
                          <span className="mf-t-pass">[PASS]</span> 4 Depots Synchronized — 0 errors
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mf-study-footer">
                  <div className="mf-study-tags">
                    {study.deliverables.slice(0, 3).map((d, i) => (
                      <span key={i} className="mf-tech-tag">{d}</span>
                    ))}
                  </div>
                  <a className="mf-study-cta" href="#start" data-cursor>
                    <span>Request Similar System</span>
                    <ArrowUpRight size={14} weight="bold" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
