import { type KeyboardEvent, type PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import CodavoltIcon from "./CodavoltIcon";

export type LaserThresholdProps = {
  reducedMotion?: boolean;
};

type Task = {
  id: string;
  name: string;
  detail: string;
  defaultAutomated: boolean;
};

const ALL_TASKS: Task[] = [
  { id: "t1", name: "Routing and triage", detail: "Incoming requests assigned to the right owner immediately", defaultAutomated: true },
  { id: "t2", name: "Scheduled syncs & reports", detail: "Daily stock updates, cross-system telemetry, client digests", defaultAutomated: true },
  { id: "t3", name: "Record updates & hygiene", detail: "Normalized names, verified VAT, clean deduplicated records", defaultAutomated: true },
  { id: "t4", name: "Reminders & invoice chasing", detail: "Gentle automated payment prompts on overdue accounts", defaultAutomated: true },
  { id: "t5", name: "Voice, chat & email drafts", detail: "Context-aware initial replies prepared before anyone reads them", defaultAutomated: true },
  { id: "t6", name: "Context & history enrichment", detail: "Pulling previous tickets, orders, and spend when tickets arrive", defaultAutomated: true },
  { id: "t7", name: "Exceptions outside normal rules", detail: "Out-of-range quantities or missing compliance flags", defaultAutomated: false },
  { id: "t8", name: "Approvals over £1,000 threshold", detail: "Financial sign-offs and discount concessions", defaultAutomated: false },
  { id: "t9", name: "Pricing you would have to defend", detail: "Non-standard quotes, commercial margins, and fee structures", defaultAutomated: false },
  { id: "t10", name: "Decisions needing human judgment", detail: "Trade-offs where context and intent outweigh binary rules", defaultAutomated: false },
  { id: "t11", name: "Legal and safety compliance", detail: "Contract liability sign-off and regulatory declarations", defaultAutomated: false },
  { id: "t12", name: "The last word on a relationship", detail: "High-stakes negotiations, VIP escalations, and personal rapport", defaultAutomated: false },
];

const PRESETS = [
  { label: "Conservative", count: 3, desc: "25% automated" },
  { label: "Balanced", count: 6, desc: "50% automated (Recommended)" },
  { label: "Aggressive", count: 9, desc: "75% automated" },
  { label: "Full Motion", count: 11, desc: "92% automated" },
];

export function LaserThreshold({ reducedMotion = false }: LaserThresholdProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [autoCount, setAutoCount] = useState(6);
  const [isDragging, setIsDragging] = useState(false);
  const [recentlyMovedId, setRecentlyMovedId] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Gentle micro-audio click synthesis on boundary transition
  const playClick = useCallback((freq = 520) => {
    if (reducedMotion) return;
    try {
      if (typeof window === "undefined") return;
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.045);
      gain.gain.setValueAtTime(0.045, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // Audio is non-critical enhancement; ignore if blocked
    }
  }, []);

  const setThreshold = useCallback((newCount: number) => {
    const clamped = Math.max(1, Math.min(ALL_TASKS.length - 1, newCount));
    setAutoCount((prev) => {
      if (prev !== clamped) {
        playClick(clamped > prev ? 620 : 420);
        const movedIndex = clamped > prev ? clamped - 1 : prev - 1;
        setRecentlyMovedId(ALL_TASKS[movedIndex]?.id ?? null);
      }
      return clamped;
    });
  }, [playClick]);

  useEffect(() => {
    if (!recentlyMovedId) return;
    const timer = setTimeout(() => setRecentlyMovedId(null), 600);
    return () => clearTimeout(timer);
  }, [recentlyMovedId]);

  // Handle pointer dragging
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const ratio = Math.max(0.1, Math.min(0.9, relativeX / rect.width));
    const targetCount = Math.round(ratio * ALL_TASKS.length);
    setThreshold(targetCount);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      setThreshold(autoCount - 1);
    } else if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      setThreshold(autoCount + 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      setThreshold(1);
    } else if (e.key === "End") {
      e.preventDefault();
      setThreshold(ALL_TASKS.length - 1);
    }
  };

  const autoTasks = ALL_TASKS.slice(0, autoCount);
  const humanTasks = ALL_TASKS.slice(autoCount);

  const autoPct = Math.round((autoCount / ALL_TASKS.length) * 100);
  const humanPct = 100 - autoPct;
  const hoursSavedEst = Math.round(autoCount * 4.8);

  const regime =
    autoCount <= 3
      ? { label: "Conservative Oversight", tone: "amber", note: "Safety-first threshold" }
      : autoCount <= 8
      ? { label: "Balanced Codavolt Spec", tone: "pink", note: "Optimal operational velocity" }
      : { label: "Hyper-Agentic Autonomy", tone: "cyan", note: "Maximum leverage" };

  return (
    <div
      ref={containerRef}
      className={"mf-laser-wrap" + (isDragging ? " is-dragging" : "")}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Dynamic Telemetry HUD */}
      <div className="mf-laser-hud" aria-live="polite">
        <div className="mf-hud-stat mf-hud-stat--auto">
          <span className="mf-hud-label">
            <i aria-hidden="true" />
            Runs without you
          </span>
          <span className="mf-hud-val">
            <strong>{autoPct}%</strong>
            <em>{autoCount} tasks automated</em>
          </span>
        </div>

        <div className="mf-hud-center">
          <div className="mf-hud-badge is-{regime.tone}">
            <CodavoltIcon size={14} />
            <span>{regime.label}</span>
          </div>
          <span className="mf-hud-metric">
            Est. <b>~{hoursSavedEst} hrs/wk</b> saved across operations
          </span>
        </div>

        <div className="mf-hud-stat mf-hud-stat--human">
          <span className="mf-hud-label">
            <i aria-hidden="true" />
            Comes to you first
          </span>
          <span className="mf-hud-val">
            <strong>{humanPct}%</strong>
            <em>{humanTasks.length} guarded tasks</em>
          </span>
        </div>
      </div>

      {/* Preset Pickers */}
      <div className="mf-laser-presets" role="group" aria-label="Operational split presets">
        <span className="mf-preset-title">Presets:</span>
        {PRESETS.map((p) => {
          const isActive = autoCount === p.count;
          return (
            <button
              key={p.label}
              type="button"
              className={"mf-preset-pill" + (isActive ? " is-active" : "")}
              onClick={() => setThreshold(p.count)}
              data-cursor
            >
              <span>{p.label}</span>
              <em>{p.desc}</em>
            </button>
          );
        })}
      </div>

      {/* Interactive 3D Laser Field & Columns */}
      <div className="mf-laser-stage">
        {/* Left Column: Runs without you */}
        <div className="mf-boundary-col mf-boundary-col--auto">
          <header className="mf-col-header">
            <h3>
              <i aria-hidden="true" />
              Runs without you ({autoCount})
            </h3>
            <span className="mf-col-badge">Autonomous</span>
          </header>
          <ul className="mf-task-list" aria-label="Tasks running without human bottleneck">
            {autoTasks.map((task, idx) => (
              <li
                key={task.id}
                className={
                  "mf-task-item is-auto" +
                  (task.id === recentlyMovedId ? " is-just-moved" : "")
                }
              >
                <span className="mf-task-num">{String(idx + 1).padStart(2, "0")}</span>
                <div className="mf-task-copy">
                  <strong>{task.name}</strong>
                  <span>{task.detail}</span>
                </div>
                <span className="mf-task-status is-auto" aria-hidden="true">
                  <CodavoltIcon size={12} />
                  Auto
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* 3D Laser Beam Divider & Grab Handle */}
        <div
          className="mf-laser-divider"
          aria-hidden="true"
        >
          <div className="mf-laser-glow-core" />
          <div className="mf-laser-plasma" />
          <div className="mf-laser-spark mf-laser-spark--1" />
          <div className="mf-laser-spark mf-laser-spark--2" />
          <div className="mf-laser-spark mf-laser-spark--3" />

          {/* Draggable Handle */}
          <div
            className="mf-laser-handle"
            role="slider"
            tabIndex={0}
            aria-label="Laser threshold divider: drag to shift between automated and human work"
            aria-valuemin={1}
            aria-valuemax={ALL_TASKS.length - 1}
            aria-valuenow={autoCount}
            aria-valuetext={`${autoPct}% automated, ${humanPct}% human touchpoints`}
            onPointerDown={handlePointerDown}
            onKeyDown={handleKeyDown}
            data-cursor
          >
            <div className="mf-handle-aura" />
            <div className="mf-handle-body">
              <span className="mf-handle-arrow mf-handle-arrow--l">‹</span>
              <CodavoltIcon size={16} />
              <span className="mf-handle-arrow mf-handle-arrow--r">›</span>
            </div>
            <span className="mf-handle-tooltip">
              {isDragging ? `Shift: ${autoPct}% / ${humanPct}%` : "DRAG LINE"}
            </span>
          </div>
        </div>

        {/* Right Column: Comes to you first */}
        <div className="mf-boundary-col mf-boundary-col--human">
          <header className="mf-col-header">
            <h3>
              <i aria-hidden="true" />
              Comes to you first ({humanTasks.length})
            </h3>
            <span className="mf-col-badge is-human">Human Decision</span>
          </header>
          <ul className="mf-task-list" aria-label="Tasks requiring human approval or discretion">
            {humanTasks.map((task, idx) => (
              <li
                key={task.id}
                className={
                  "mf-task-item is-human" +
                  (task.id === recentlyMovedId ? " is-just-moved" : "")
                }
              >
                <span className="mf-task-num">{String(autoCount + idx + 1).padStart(2, "0")}</span>
                <div className="mf-task-copy">
                  <strong>{task.name}</strong>
                  <span>{task.detail}</span>
                </div>
                <span className="mf-task-status is-human" aria-hidden="true">
                  <i />
                  Guarded
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Instruction */}
      <div className="mf-laser-footer">
        <p className="mf-laser-hint">
          <b>Drag the laser beam</b> left or right to test your operating model.
          Codavolt builds the exact cutoff where your judgment stays uncompromised.
        </p>
      </div>
    </div>
  );
}

export default LaserThreshold;
