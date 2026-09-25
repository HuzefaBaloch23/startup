import { useCallback, useEffect, useRef, useState } from "react";
import { JOB, JOB_REF } from "./thread";
import { useOnScreen } from "./useOnScreen";
import CodavoltIcon from "./CodavoltIcon";

export type WorkflowCanvasProps = {
  className?: string;
  reducedMotion?: boolean;
};

type FlowNode = {
  id: string;
  title: string;
  detail: string;
  telemetry: string;
  /** Position as a percentage of the stage, so SVG and DOM share one coordinate space. */
  x: number;
  y: number;
};

const FLOW_NODES: FlowNode[] = [
  { id: "arrive", title: "Request arrives", detail: "Email, WhatsApp, form, or schedule", telemetry: "0.02s · Ingested", x: 30, y: 7 },
  { id: "context", title: "Context attached", detail: "Customer history, open tickets, account tier", telemetry: "0.08s · Matched", x: 30, y: 28 },
  { id: "rules", title: "Rules applied", detail: "Risk calculation & authority checks", telemetry: "0.14s · Evaluated", x: 30, y: 49 },
  { id: "action", title: "Action taken", detail: "Reserved, synced, scheduled, or notified", telemetry: "0.32s · Dispatched", x: 30, y: 70 },
  { id: "record", title: "Record updated", detail: "Single source of truth reconciled", telemetry: "0.41s · Committed", x: 30, y: 91 },
  { id: "human", title: "Sent to a person", detail: "Flagged with full context for judgment", telemetry: "Handoff · Guarded", x: 76, y: 62 },
];

const HUMAN = 5;
const DECISION = 2;
const SPINE_TOP = FLOW_NODES[0].y;
const SPINE_BOTTOM = FLOW_NODES[4].y;

type WorkItem = {
  id: string;
  label: string;
  source: string;
  path: number[];
  tone: "auto" | "divert";
  metric: string;
};

const WORK_ITEMS: WorkItem[] = [
  {
    id: "item-order",
    label: "Order " + JOB_REF + " — " + JOB.customer,
    source: JOB.channel,
    path: [0, 1, 2, 3, 4],
    tone: "auto",
    metric: "0.42s total run",
  },
  {
    id: "item-lead",
    label: "Enterprise Lead — Okonkwo Ltd",
    source: "Website form",
    path: [0, 1, 2, 3, 4],
    tone: "auto",
    metric: "0.38s total run",
  },
  {
    id: "item-refund",
    label: "Refund request #882 (Over £500)",
    source: "Support inbox",
    path: [0, 1, 2, HUMAN],
    tone: "divert",
    metric: "Diverted at rule gate",
  },
  {
    id: "item-sync",
    label: "Stock sync — Depot 3 (1,200 SKUs)",
    source: "Nightly schedule",
    path: [0, 1, 2, 3, 4],
    tone: "auto",
    metric: "1.12s total run",
  },
];

const STEP_MS = 1350;

type FlowState = { itemIndex: number; step: number; settled: boolean };

export function WorkflowCanvas({ className, reducedMotion = false }: WorkflowCanvasProps) {
  const [hostRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [state, setState] = useState<FlowState>({ itemIndex: 0, step: 0, settled: false });
  const [manualLock, setManualLock] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Micro-harmonic chime for glass conduit transit
  const playNodeSound = useCallback((isDivert = false) => {
    if (reducedMotion) return;
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      const freq = isDivert ? 340 : 580;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.025, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {
      // Audio is non-critical enhancement
    }
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !onScreen) return;

    const id = window.setInterval(() => {
      setState((current) => {
        const currentItem = WORK_ITEMS[current.itemIndex];
        const { path } = currentItem;

        if (current.settled) {
          if (manualLock) return current;
          const nextIndex = (current.itemIndex + 1) % WORK_ITEMS.length;
          return { itemIndex: nextIndex, step: 0, settled: false };
        }

        if (current.step >= path.length - 1) {
          return { ...current, settled: true };
        }

        const nextStep = current.step + 1;
        const willDivert = path[nextStep] === HUMAN;
        playNodeSound(willDivert);
        return { ...current, step: nextStep };
      });
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [reducedMotion, onScreen, manualLock, playNodeSound]);

  const activeItem = WORK_ITEMS[reducedMotion ? 0 : state.itemIndex];
  const step = reducedMotion ? activeItem.path.length - 1 : state.step;
  const settled = reducedMotion ? true : state.settled;

  const activeIndex = activeItem.path[step];
  const activeNode = FLOW_NODES[activeIndex];
  const reached = new Set(activeItem.path.slice(0, step + 1));
  const tookBranch = activeItem.path.includes(HUMAN);
  const isDivertedNow = activeIndex === HUMAN;

  const spineHead = FLOW_NODES[activeIndex === HUMAN ? DECISION : activeIndex].y;

  const injectItem = (index: number) => {
    setManualLock(true);
    setState({ itemIndex: index, step: 0, settled: false });
    playNodeSound(false);
  };

  const nodeState = (index: number) => {
    if (index === activeIndex && !settled) return "active";
    if (reached.has(index)) return "done";
    return "idle";
  };

  return (
    <div className={"mf-flow " + (className ?? "")} ref={hostRef}>
      {/* Live Technical Header */}
      <div className="mf-flow-head" aria-live="polite">
        <div className="mf-flow-left">
          <span className="mf-flow-eyebrow">
            <CodavoltIcon size={16} />
            <span>Kinetic 3D Conduit</span>
          </span>
          <span className="mf-flow-meta-badge">
            {tookBranch ? "GUARDED JUNCTION" : "HIGH-THROUGHPUT PIPELINE"}
          </span>
        </div>

        <div className="mf-flow-now" key={activeItem.id}>
          <div className="mf-flow-now-top">
            <strong>{activeItem.label}</strong>
            <span className={"mf-flow-pill is-" + activeItem.tone}>
              {activeItem.source}
            </span>
          </div>
          <em>{activeItem.metric}</em>
        </div>
      </div>

      {/* Manual Packet Injection Bar */}
      <div className="mf-flow-injectors" role="group" aria-label="Inject test requests into the conduit">
        <span className="mf-inject-label">Simulate:</span>
        {WORK_ITEMS.map((item, idx) => {
          const isActive = idx === state.itemIndex;
          return (
            <button
              key={item.id}
              type="button"
              className={"mf-inject-btn" + (isActive ? " is-active" : "")}
              onClick={() => injectItem(idx)}
              data-cursor
            >
              <i aria-hidden="true" />
              <span>{item.label.split("—")[0].trim()}</span>
              {item.tone === "divert" && <b className="mf-divert-flag">Human Gate</b>}
            </button>
          );
        })}
      </div>

      {/* 3D Glass Conduit Stage */}
      <div className="mf-flow-stage">
        {/* SVG Volumetric 3D Glass Tubing System */}
        <svg
          className="mf-conduit-svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            {/* Glass Tube Gradients */}
            <linearGradient id="glassTubeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgb(255 255 255 / 0.12)" />
              <stop offset="35%" stopColor="rgb(255 255 255 / 0.03)" />
              <stop offset="65%" stopColor="rgb(0 0 0 / 0.4)" />
              <stop offset="100%" stopColor="rgb(255 255 255 / 0.15)" />
            </linearGradient>

            {/* Glowing Autonomous Core Gradient */}
            <linearGradient id="flowCoreGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="35%" stopColor="#00f0ff" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>

            {/* Human Gate Amber Gradient */}
            <linearGradient id="humanCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8f7dff" />
              <stop offset="40%" stopColor="#f2b98a" />
              <stop offset="100%" stopColor="#f2b98a" />
            </linearGradient>

            <filter id="conduitGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Spine 3D Glass Outer Conduit */}
          <rect
            x="29.2"
            y={SPINE_TOP}
            width="1.6"
            height={SPINE_BOTTOM - SPINE_TOP}
            rx="0.8"
            fill="url(#glassTubeGrad)"
            stroke="rgb(255 255 255 / 0.1)"
            strokeWidth="0.2"
          />

          {/* Spine Active Energy Column */}
          <line
            x1="30"
            y1={SPINE_TOP}
            x2="30"
            y2={spineHead}
            stroke="url(#flowCoreGrad)"
            strokeWidth="0.8"
            strokeLinecap="round"
            filter="url(#conduitGlow)"
            className="mf-conduit-pulse-line"
          />

          {/* Human Branch 3D Glass Outer Conduit */}
          <path
            d="M30,49 C 48,49 58,62 76,62"
            fill="none"
            stroke="url(#glassTubeGrad)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          {/* Human Branch Active Energy Flow */}
          <path
            d="M30,49 C 48,49 58,62 76,62"
            fill="none"
            stroke="url(#humanCoreGrad)"
            strokeWidth="0.8"
            strokeDasharray={reached.has(HUMAN) ? "none" : "2 3"}
            strokeLinecap="round"
            className={"mf-branch-flow " + (reached.has(HUMAN) ? "is-live" : "")}
            filter={reached.has(HUMAN) ? "url(#conduitGlow)" : undefined}
          />

          {/* Mechanical Pneumatic Diverter Gate at Junction (30, 49) */}
          <g
            className={"mf-diverter-valve" + (isDivertedNow ? " is-diverted" : "")}
            transform="translate(30, 49)"
          >
            <circle r="2.2" fill="#0d0c14" stroke="rgb(255 255 255 / 0.25)" strokeWidth="0.3" />
            <line
              x1="0"
              y1="-1.6"
              x2="0"
              y2="1.6"
              stroke={isDivertedNow ? "#f2b98a" : "#56c8e8"}
              strokeWidth="0.6"
              strokeLinecap="round"
              className="mf-valve-blade"
            />
          </g>
        </svg>

        {/* 3D Glass Node Capsules */}
        <ol className="mf-flow-nodes" aria-label="How a request moves through a Codavolt system">
          {FLOW_NODES.map((node, index) => {
            const isHumanNode = index === HUMAN;
            const currentStatus = nodeState(index);

            return (
              <li
                key={node.id}
                className={
                  "mf-flow-node" +
                  (isHumanNode ? " mf-flow-node--human" : "") +
                  " is-" +
                  currentStatus
                }
                style={{ left: node.x + "%", top: node.y + "%" }}
              >
                {/* 3D Glass Pod Glow Ring */}
                <div className="mf-node-ring" aria-hidden="true" />

                <div className="mf-node-icon" aria-hidden="true">
                  {isHumanNode ? (
                    <i className="mf-icon-human" />
                  ) : (
                    <i className="mf-icon-dot" />
                  )}
                </div>

                <div className="mf-node-body">
                  <div className="mf-node-title-row">
                    <strong>{node.title}</strong>
                    <span className="mf-node-telemetry">{node.telemetry}</span>
                  </div>
                  <span>{node.detail}</span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* 3D Kinetic Plasma Energy Orb */}
        <div
          className={
            "mf-flow-packet" +
            (settled ? " is-settled" : "") +
            (isDivertedNow ? " is-diverted" : "")
          }
          aria-hidden="true"
          style={{ left: activeNode.x + "%", top: activeNode.y + "%" }}
        >
          {/* Volumetric Corona & Trailing Particles */}
          <div className="mf-packet-corona" />
          <div className="mf-packet-core" />
          <div className="mf-packet-tail mf-packet-tail--1" />
          <div className="mf-packet-tail mf-packet-tail--2" />
        </div>
      </div>

      {/* Telemetry Footer */}
      <footer className="mf-flow-foot">
        <div className="mf-flow-status-note">
          <i className={"mf-status-led" + (tookBranch ? " is-amber" : " is-pink")} />
          <span>
            {tookBranch
              ? "Human discretion engaged · Full context provided"
              : "Autonomously resolved · Zero manual intervention"}
          </span>
        </div>
        <span className="mf-flow-steps-count">
          {activeItem.path.length} pipeline stages
        </span>
      </footer>
    </div>
  );
}

export default WorkflowCanvas;
