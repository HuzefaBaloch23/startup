import { useState, type MouseEvent } from "react";
import {
  ArrowUpRight,
  Cpu,
  Users,
  Laptop,
  Globe,
  CheckCircle,
  Lightning,
  FileText,
  ArrowsClockwise,
  WhatsappLogo,
  EnvelopeSimple,
  ShieldCheck,
  Gauge,
  TerminalWindow,
} from "@phosphor-icons/react";

interface AutomationScenario {
  id: string;
  name: string;
  icon: typeof Lightning;
  payload: string;
  steps: { label: string; latency: string; detail: string }[];
  result: string;
}

const AUTOMATION_SCENARIOS: AutomationScenario[] = [
  {
    id: "order",
    name: "Shopify Order #9142",
    icon: Lightning,
    payload: "£1,850 · UK Express Delivery · Priority Flag",
    steps: [
      { label: "Webhook Ingested", latency: "0.018s", detail: "Signature verified & JSON payload parsed" },
      { label: "Fraud & Credit Check", latency: "0.042s", detail: "Stripe radar clean · VAT exemption validated" },
      { label: "ERP Inventory Reserve", latency: "0.084s", detail: "Allocated across Manchester Hub stock" },
      { label: "Carrier Label Issued", latency: "0.118s", detail: "DHL Express label generated · Customer notified" },
    ],
    result: "Dispatched in 0.12s · 0 human touches · 100% automated",
  },
  {
    id: "invoice",
    name: "Supplier Invoice PDF",
    icon: FileText,
    payload: "EUR 4,320 · Industrial Fasteners Ltd · 14 Line Items",
    steps: [
      { label: "PDF Attachment Extracted", latency: "0.024s", detail: "Inbound mailbox listener received PDF" },
      { label: "AI Layout & Table OCR", latency: "0.065s", detail: "14 SKUs, unit costs & tax totals extracted" },
      { label: "3-Way PO Reconciliation", latency: "0.108s", detail: "Matched 100% against Purchase Order #PO-4401" },
      { label: "Committed to Accounting", latency: "0.142s", detail: "Draft bill created in Xero with audit trace" },
    ],
    result: "Reconciled in 0.14s · 0 manual data entry · Audit trail locked",
  },
  {
    id: "stock",
    name: "Multi-Depot Stock Sync",
    icon: ArrowsClockwise,
    payload: "1,400 SKUs · Depot Stock Adjustment Event",
    steps: [
      { label: "WMS Event Received", latency: "0.015s", detail: "Barcode scan at London Depot #3 deducted 40 units" },
      { label: "Global Delta Calculation", latency: "0.038s", detail: "Safety buffers updated across 3 regional hubs" },
      { label: "Omnichannel Broadcast", latency: "0.076s", detail: "Simultaneous sync to Shopify, Amazon & B2B Portal" },
      { label: "State Consensus Reached", latency: "0.098s", detail: "Zero desync across all 5 sales channels" },
    ],
    result: "Full omnichannel sync in 0.09s · 0 oversold units",
  },
];

export default function FourPillars() {
  // Scenario selector for Card 1 (Automation)
  const [activeScenario, setActiveScenario] = useState<string>("order");
  // Tool selector for Card 3 (Custom Software)
  const [activeToolTab, setActiveToolTab] = useState<"dispatch" | "portal" | "analytics">("dispatch");
  // Speed benchmark mode for Card 4 (Websites)
  const [speedMode, setSpeedMode] = useState<"codavolt" | "legacy">("codavolt");

  const currentScenario = AUTOMATION_SCENARIOS.find((s) => s.id === activeScenario) || AUTOMATION_SCENARIOS[0];

  // Mouse-tracking spotlight sheen for premium glass cards
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty("--card-mx", `${x}px`);
    e.currentTarget.style.setProperty("--card-my", `${y}px`);
  };

  return (
    <section id="services" className="mf-bento-section mf-section-shell" aria-labelledby="services-title">
      {/* Header */}
      <div className="mf-bento-head">
        <div className="mf-pill-eyebrow">
          <span className="mf-pill-dot" /> FOUR CORE CAPABILITIES
        </div>
        <h2 id="services-title">Engineered to scale ambitious companies.</h2>
        <p>
          We replace bloated agency retainers and brittle spreadsheets with modern, production-grade digital infrastructure.
          Here is what we engineer and deploy for your business.
        </p>
      </div>

      {/* Asymmetrical Bento Grid */}
      <div className="mf-bento-grid">
        {/* =========================================================================
            CARD 1: INTELLIGENT AUTOMATION (Hero Bento Card - Wide 7/12 cols)
            ========================================================================= */}
        <div className="mf-bento-card mf-bento-card--automation" onMouseMove={handleMouseMove}>
          <div className="mf-bento-card-inner">
            {/* Card Header */}
            <div className="mf-bento-top">
              <div className="mf-bento-tag">
                <Cpu size={16} weight="duotone" className="mf-bento-tag-icon" />
                <span>SPEC 01 // AUTONOMOUS BACKEND</span>
              </div>
              <div className="mf-live-badge">
                <span className="mf-live-led" />
                <span>LIVE SIMULATOR</span>
              </div>
            </div>

            <div className="mf-bento-main-text">
              <h3>Intelligent Automation</h3>
              <p className="mf-bento-subtitle">
                Autonomous data pipelines connecting your ERP, warehouse, billing, and commerce platforms without human delay.
              </p>
            </div>

            {/* Interactive Pipeline Simulator */}
            <div className="mf-sim-container">
              <div className="mf-sim-header">
                <span className="mf-sim-title">
                  <TerminalWindow size={14} weight="bold" /> Click an event to test pipeline:
                </span>
                <div className="mf-sim-pills" role="tablist">
                  {AUTOMATION_SCENARIOS.map((sc) => {
                    const Icon = sc.icon;
                    const isActive = activeScenario === sc.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        className={`mf-sim-btn ${isActive ? "is-active" : ""}`}
                        onClick={() => setActiveScenario(sc.id)}
                        data-cursor
                      >
                        <Icon size={13} weight={isActive ? "bold" : "regular"} />
                        <span>{sc.name.split(" ")[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Event Payload Pill */}
              <div className="mf-sim-payload">
                <span className="mf-payload-label">EVENT INGESTION:</span>
                <strong className="mf-payload-val">{currentScenario.payload}</strong>
              </div>

              {/* Execution Steps */}
              <div className="mf-sim-steps">
                {currentScenario.steps.map((st, idx) => (
                  <div key={st.label} className="mf-sim-step-row">
                    <div className="mf-step-node">
                      <span className="mf-node-index">{String(idx + 1).padStart(2, "0")}</span>
                      {idx < currentScenario.steps.length - 1 && <span className="mf-step-connector" />}
                    </div>
                    <div className="mf-step-body">
                      <div className="mf-step-top">
                        <span className="mf-step-name">{st.label}</span>
                        <span className="mf-step-time">{st.latency}</span>
                      </div>
                      <span className="mf-step-detail">{st.detail}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Result Bar */}
              <div className="mf-sim-result">
                <CheckCircle size={15} weight="fill" className="mf-result-icon" />
                <span>{currentScenario.result}</span>
              </div>
            </div>

            {/* Architecture Specs (Input -> Engine -> Output) */}
            <div className="mf-arch-strip">
              <div className="mf-arch-item">
                <span className="mf-arch-label">INGESTION</span>
                <strong>Webhooks & APIs</strong>
              </div>
              <span className="mf-arch-arrow">→</span>
              <div className="mf-arch-item">
                <span className="mf-arch-label">LOGIC</span>
                <strong>State Machines & AI</strong>
              </div>
              <span className="mf-arch-arrow">→</span>
              <div className="mf-arch-item">
                <span className="mf-arch-label">OUTCOME</span>
                <strong>15–30 hrs/wk saved</strong>
              </div>
            </div>

            {/* Card Footer */}
            <div className="mf-bento-footer">
              <div className="mf-bento-metric">
                <span className="mf-bento-metric-val">100%</span>
                <span className="mf-bento-metric-lbl">Manual CSV Re-entry Retired</span>
              </div>
              <a href="#start" className="mf-bento-cta" data-cursor>
                Automate your ops <ArrowUpRight size={15} weight="bold" />
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 2: MODERN CRM ARCHITECTURE (5/12 cols)
            ========================================================================= */}
        <div className="mf-bento-card mf-bento-card--crm" onMouseMove={handleMouseMove}>
          <div className="mf-bento-card-inner">
            <div className="mf-bento-top">
              <div className="mf-bento-tag">
                <Users size={16} weight="duotone" className="mf-bento-tag-icon" />
                <span>SPEC 02 // OMNICHANNEL CRM</span>
              </div>
              <div className="mf-sla-badge">
                <span>&lt; 60s SLA</span>
              </div>
            </div>

            <div className="mf-bento-main-text">
              <h3>Modern CRM Architecture</h3>
              <p className="mf-bento-subtitle">
                Zero dropped leads. We unify WhatsApp, email, forms, and phone inquiries into a single automated revenue pipeline.
              </p>
            </div>

            {/* Live Omnichannel Thread Preview */}
            <div className="mf-crm-preview">
              <div className="mf-crm-inbound-card">
                <div className="mf-crm-inbound-head">
                  <div className="mf-crm-client-info">
                    <span className="mf-client-avatar">MV</span>
                    <div>
                      <strong>Marcus Vance</strong>
                      <span className="mf-client-co">Vance Logistics Group</span>
                    </div>
                  </div>
                  <span className="mf-crm-channel-pill">
                    <WhatsappLogo size={14} weight="fill" color="#22c55e" /> WhatsApp
                  </span>
                </div>
                <p className="mf-crm-msg">
                  &ldquo;Need to automate dispatch across 3 UK depots and sync with our Xero accounts. Available for a call today?&rdquo;
                </p>
                <div className="mf-crm-tag-row">
                  <span className="mf-crm-tag">HIGH INTENT</span>
                  <span className="mf-crm-tag">£45,000 DEAL</span>
                  <span className="mf-crm-tag">AUTO-ENRICHED</span>
                </div>
              </div>

              {/* Instant Automation Response */}
              <div className="mf-crm-reaction">
                <div className="mf-reaction-dot" />
                <div className="mf-reaction-body">
                  <div className="mf-reaction-top">
                    <strong>Autonomous Router</strong>
                    <span>0.38s response</span>
                  </div>
                  <p>Booked directly on Senior Director calendar · HubSpot deal stage updated · Slack alert dispatched</p>
                </div>
              </div>
            </div>

            {/* Multi-channel chips */}
            <div className="mf-channel-chips">
              <span className="mf-chip"><WhatsappLogo size={13} weight="fill" /> WhatsApp API</span>
              <span className="mf-chip"><EnvelopeSimple size={13} weight="fill" /> Smart Inbox</span>
              <span className="mf-chip"><ShieldCheck size={13} weight="fill" /> Lead Scoring</span>
            </div>

            <div className="mf-bento-footer">
              <div className="mf-bento-metric">
                <span className="mf-bento-metric-val">&lt; 45s</span>
                <span className="mf-bento-metric-lbl">Average First Lead Response</span>
              </div>
              <a href="#start" className="mf-bento-cta" data-cursor>
                Upgrade your CRM <ArrowUpRight size={15} weight="bold" />
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 3: BESPOKE CUSTOM SOFTWARE (6/12 cols)
            ========================================================================= */}
        <div className="mf-bento-card mf-bento-card--software" onMouseMove={handleMouseMove}>
          <div className="mf-bento-card-inner">
            <div className="mf-bento-top">
              <div className="mf-bento-tag">
                <Laptop size={16} weight="duotone" className="mf-bento-tag-icon" />
                <span>SPEC 03 // BESPOKE PLATFORMS</span>
              </div>
              <div className="mf-custom-badge">
                <span>TAILOR-FIT</span>
              </div>
            </div>

            <div className="mf-bento-main-text">
              <h3>Bespoke Custom Software</h3>
              <p className="mf-bento-subtitle">
                When off-the-shelf SaaS hits a wall. We engineer dedicated internal operations desks, B2B portals, and dispatch platforms.
              </p>
            </div>

            {/* Interactive Workbench Mockup */}
            <div className="mf-desk-container">
              {/* Tab Selector */}
              <div className="mf-desk-tabs">
                <button
                  type="button"
                  className={`mf-desk-tab ${activeToolTab === "dispatch" ? "is-active" : ""}`}
                  onClick={() => setActiveToolTab("dispatch")}
                  data-cursor
                >
                  Fleet Dispatch
                </button>
                <button
                  type="button"
                  className={`mf-desk-tab ${activeToolTab === "portal" ? "is-active" : ""}`}
                  onClick={() => setActiveToolTab("portal")}
                  data-cursor
                >
                  Client Portal
                </button>
                <button
                  type="button"
                  className={`mf-desk-tab ${activeToolTab === "analytics" ? "is-active" : ""}`}
                  onClick={() => setActiveToolTab("analytics")}
                  data-cursor
                >
                  Telemetry Matrix
                </button>
              </div>

              {/* Dynamic Content based on Tab */}
              {activeToolTab === "dispatch" && (
                <div className="mf-desk-content">
                  <div className="mf-desk-row">
                    <div className="mf-desk-unit">
                      <span className="mf-status-dot is-online" />
                      <strong>Fleet Unit #14 (Leeds)</strong>
                    </div>
                    <span className="mf-unit-badge is-transit">IN TRANSIT · 98% ON TIME</span>
                  </div>
                  <div className="mf-desk-row">
                    <div className="mf-desk-unit">
                      <span className="mf-status-dot is-busy" />
                      <strong>Fleet Unit #09 (Manchester)</strong>
                    </div>
                    <span className="mf-unit-badge is-loading">DOCK 3 · LOADING (12 MIN)</span>
                  </div>
                  <div className="mf-desk-row">
                    <div className="mf-desk-unit">
                      <span className="mf-status-dot is-online" />
                      <strong>Consignment #C-8812</strong>
                    </div>
                    <span className="mf-unit-badge is-cleared">AUTO-DISPATCHED · ZERO ERRORS</span>
                  </div>
                </div>
              )}

              {activeToolTab === "portal" && (
                <div className="mf-desk-content">
                  <div className="mf-portal-stat-grid">
                    <div className="mf-pstat">
                      <span className="mf-pstat-val">12</span>
                      <span className="mf-pstat-lbl">Active Enterprise Portals</span>
                    </div>
                    <div className="mf-pstat">
                      <span className="mf-pstat-val">100%</span>
                      <span className="mf-pstat-lbl">Self-Service Invoicing</span>
                    </div>
                    <div className="mf-pstat">
                      <span className="mf-pstat-val">0</span>
                      <span className="mf-pstat-lbl">Back-and-forth Emails</span>
                    </div>
                  </div>
                </div>
              )}

              {activeToolTab === "analytics" && (
                <div className="mf-desk-content">
                  <div className="mf-telemetry-bar">
                    <div className="mf-tcol">
                      <span>API LATENCY</span>
                      <strong>18ms</strong>
                    </div>
                    <div className="mf-tcol">
                      <span>DATABASE SYNC</span>
                      <strong>Real-Time Postgres</strong>
                    </div>
                    <div className="mf-tcol">
                      <span>UPTIME SLA</span>
                      <strong>99.98%</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mf-bento-footer">
              <div className="mf-bento-metric">
                <span className="mf-bento-metric-val">14 hrs / wk</span>
                <span className="mf-bento-metric-lbl">Saved Per Operations Dispatcher</span>
              </div>
              <a href="#start" className="mf-bento-cta" data-cursor>
                Build custom app <ArrowUpRight size={15} weight="bold" />
              </a>
            </div>
          </div>
        </div>

        {/* =========================================================================
            CARD 4: HIGH-PERFORMANCE WEBSITES (6/12 cols)
            ========================================================================= */}
        <div className="mf-bento-card mf-bento-card--websites" onMouseMove={handleMouseMove}>
          <div className="mf-bento-card-inner">
            <div className="mf-bento-top">
              <div className="mf-bento-tag">
                <Globe size={16} weight="duotone" className="mf-bento-tag-icon" />
                <span>SPEC 04 // WEB FLAGSHIPS</span>
              </div>
              <div className="mf-speed-badge">
                <Gauge size={13} weight="bold" />
                <span>100/100 SPEED</span>
              </div>
            </div>

            <div className="mf-bento-main-text">
              <h3>High-Performance Websites</h3>
              <p className="mf-bento-subtitle">
                Ultra-fast, conversion-engineered digital flagships. Engineered with React & modern edge architecture for 0.2s load speeds.
              </p>
            </div>

            {/* Google Lighthouse 100 Badges */}
            <div className="mf-web-benchmark">
              <div className="mf-lighthouse-row">
                <div className="mf-lh-item">
                  <div className="mf-lh-score">100</div>
                  <span className="mf-lh-label">Performance</span>
                </div>
                <div className="mf-lh-item">
                  <div className="mf-lh-score">100</div>
                  <span className="mf-lh-label">Accessibility</span>
                </div>
                <div className="mf-lh-item">
                  <div className="mf-lh-score">100</div>
                  <span className="mf-lh-label">Best Practices</span>
                </div>
                <div className="mf-lh-item">
                  <div className="mf-lh-score">100</div>
                  <span className="mf-lh-label">SEO</span>
                </div>
              </div>

              {/* Speed Comparison Bar */}
              <div className="mf-speed-compare">
                <div className="mf-compare-top">
                  <span className="mf-compare-label">REAL-WORLD LOAD SPEED</span>
                  <div className="mf-toggle-group">
                    <button
                      type="button"
                      className={`mf-toggle-btn ${speedMode === "codavolt" ? "is-active" : ""}`}
                      onClick={() => setSpeedMode("codavolt")}
                      data-cursor
                    >
                      Codavolt Edge
                    </button>
                    <button
                      type="button"
                      className={`mf-toggle-btn ${speedMode === "legacy" ? "is-active" : ""}`}
                      onClick={() => setSpeedMode("legacy")}
                      data-cursor
                    >
                      Legacy WP
                    </button>
                  </div>
                </div>

                <div className="mf-meter-track">
                  <div
                    className={`mf-meter-fill ${speedMode === "codavolt" ? "is-fast" : "is-slow"}`}
                    style={{ width: speedMode === "codavolt" ? "12%" : "92%" }}
                  />
                </div>
                <div className="mf-meter-stats">
                  <span>{speedMode === "codavolt" ? "⚡ 0.22s — Instant paint (0ms layout shift)" : "⚠️ 3.85s — 42 blocking scripts (high bounce rate)"}</span>
                  <strong>{speedMode === "codavolt" ? "17x FASTER" : "STANDARD"}</strong>
                </div>
              </div>
            </div>

            <div className="mf-bento-footer">
              <div className="mf-bento-metric">
                <span className="mf-bento-metric-val">+340%</span>
                <span className="mf-bento-metric-lbl">Mobile Conversion Lift on Redesigns</span>
              </div>
              <a href="#start" className="mf-bento-cta" data-cursor>
                Launch your site <ArrowUpRight size={15} weight="bold" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
