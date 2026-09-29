import { useEffect, useState } from "react";
import { JOB, JOB_REF } from "./thread";
import { useOnScreen } from "./useOnScreen";

export type AutomationRunsProps = {
  reducedMotion?: boolean;
};

type Run = {
  id: number;
  minute: number;
  label: string;
  source: string;
  /** "held" is work the rules deliberately refuse to finish without a person. */
  status: "done" | "held";
  meta: string;
};

type Seed = Omit<Run, "id" | "minute">;

const POOL: Seed[] = [
  { label: "Order " + JOB_REF + " — stock checked, 50 units reserved", source: JOB.channel, status: "done", meta: "1.2s" },
  { label: "Invoice INV-2214 matched to PO-881", source: "Email", status: "done", meta: "0.8s" },
  { label: "Lead routed to an owner", source: "Slack", status: "done", meta: "0.4s" },
  { label: "Site visit booked and confirmed", source: "Web form", status: "done", meta: "1.6s" },
  { label: "Refund over £500 sent for approval", source: "WhatsApp", status: "held", meta: "with a person" },
  { label: "Depot 3 stock synced", source: "Schedule", status: "done", meta: "12s" },
  { label: "Delivery note filed against the order", source: "Email", status: "done", meta: "0.9s" },
  { label: "New customer record created", source: "Web form", status: "done", meta: "0.6s" },
  { label: "Quote chased after 3 days", source: "Schedule", status: "done", meta: "0.5s" },
  { label: "Card declined twice, flagged", source: "Email", status: "held", meta: "with a person" },
];

/** Uneven gaps read like a real log; a fixed cadence reads like a placeholder. */
const GAPS = [2, 5, 3, 7, 4, 2, 6, 3, 5, 4];
const VISIBLE = 6;
const START_MINUTE = 9 * 60 + 41;
const STEP_MS = 2400;

const clockOf = (minute: number) => {
  const wrapped = ((minute % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
};

/** Newest first, walking backwards in time down the list. */
const buildInitial = (): Run[] => {
  const runs: Run[] = [];
  let minute = START_MINUTE;
  for (let i = 0; i < VISIBLE; i += 1) {
    runs.push({ id: i, minute, ...POOL[i % POOL.length] });
    minute -= GAPS[i % GAPS.length];
  }
  return runs;
};

function AutomationRuns({ reducedMotion = false }: AutomationRunsProps) {
  const [hostRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [runs, setRuns] = useState<Run[]>(buildInitial);

  useEffect(() => {
    if (reducedMotion || !onScreen) return;

    const id = window.setInterval(() => {
      setRuns((current) => {
        const nextId = current[0].id + 1;
        const seed = POOL[nextId % POOL.length];
        const next: Run = {
          id: nextId,
          minute: current[0].minute + GAPS[nextId % GAPS.length],
          ...seed,
        };
        return [next, ...current].slice(0, VISIBLE);
      });
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [reducedMotion, onScreen]);

  const held = runs.filter((run) => run.status === "held").length;

  return (
    <div className="mf-runs" ref={hostRef}>
      <header className="mf-runs-head">
        <span className="mf-runs-title">Runs today</span>
        <span className="mf-runs-live" aria-hidden="true"><i />Live</span>
      </header>

      {/* Keyed on the newest run so the push-down replays on every arrival. */}
      <ol className="mf-runs-list" key={reducedMotion ? "static" : runs[0].id} aria-label="Recent automated runs">
        {runs.map((run, index) => (
          <li key={run.id} className={"mf-run" + (index === 0 && !reducedMotion ? " is-new" : "")}>
            <time>{clockOf(run.minute)}</time>
            <span className="mf-run-label">{run.label}</span>
            <span className="mf-run-source">{run.source}</span>
            <span className={"mf-run-status is-" + run.status}>
              {run.status === "done" ? (
                <svg viewBox="0 0 16 12" aria-hidden="true"><path d="M1.5 6.4 5.6 10.5 14.5 1.6" /></svg>
              ) : (
                <i aria-hidden="true" />
              )}
              {run.meta}
            </span>
          </li>
        ))}
      </ol>

      <p className="mf-runs-foot">
        <span>Nobody opened a tab for any of this</span>
        <span>{held} waiting on a person</span>
      </p>
    </div>
  );
}

export default AutomationRuns;
