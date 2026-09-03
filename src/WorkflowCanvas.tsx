import { useEffect, useState } from "react";
import { JOB, JOB_REF } from "./thread";
import { useOnScreen } from "./useOnScreen";

export type WorkflowCanvasProps = {
  className?: string;
  reducedMotion?: boolean;
};

type FlowNode = {
  id: string;
  title: string;
  detail: string;
  /** Position as a percentage of the stage, so SVG and DOM share one coordinate space. */
  x: number;
  y: number;
};

/**
 * The last node is the human branch rather than a step on the spine: the flow
 * reaches it instead of finishing, which is the point the page makes later in
 * "Not every task should run itself."
 */
const FLOW_NODES: FlowNode[] = [
  { id: "arrive", title: "Request arrives", detail: "Email, form, or schedule", x: 30, y: 6 },
  { id: "context", title: "Context attached", detail: "Customer, history, owner", x: 30, y: 27 },
  { id: "rules", title: "Rules applied", detail: "What can safely run", x: 30, y: 48 },
  { id: "action", title: "Action taken", detail: "Update, notify, file", x: 30, y: 69 },
  { id: "record", title: "Record updated", detail: "One source of truth", x: 30, y: 90 },
  { id: "human", title: "Sent to a person", detail: "Judgment stays human", x: 76, y: 60 },
];

const HUMAN = 5;
const DECISION = 2;
const SPINE_TOP = FLOW_NODES[0].y;
const SPINE_BOTTOM = FLOW_NODES[4].y;

type WorkItem = {
  label: string;
  source: string;
  path: number[];
};

const WORK_ITEMS: WorkItem[] = [
  { label: "Order " + JOB_REF + " — " + JOB.customer, source: JOB.channel, path: [0, 1, 2, 3, 4] },
  { label: "New lead — Okonkwo Ltd", source: "Website form", path: [0, 1, 2, 3, 4] },
  { label: "Refund request #882", source: "Support inbox", path: [0, 1, 2, HUMAN] },
  { label: "Stock sync — Depot 3", source: "Nightly schedule", path: [0, 1, 2, 3, 4] },
];

const STEP_MS = 1250;

type FlowState = { item: number; step: number; settled: boolean };

function WorkflowCanvas({ className, reducedMotion = false }: WorkflowCanvasProps) {
  const [hostRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [state, setState] = useState<FlowState>({ item: 0, step: 0, settled: false });

  useEffect(() => {
    if (reducedMotion || !onScreen) return;

    const id = window.setInterval(() => {
      setState((current) => {
        const { path } = WORK_ITEMS[current.item];
        // Hold on the finished state for one beat before the next item enters.
        if (current.settled) {
          return { item: (current.item + 1) % WORK_ITEMS.length, step: 0, settled: false };
        }
        if (current.step >= path.length - 1) {
          return { ...current, settled: true };
        }
        return { ...current, step: current.step + 1 };
      });
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [reducedMotion, onScreen]);

  // Reduced motion gets the completed run rather than a frozen half-finished one.
  const item = WORK_ITEMS[reducedMotion ? 0 : state.item];
  const step = reducedMotion ? item.path.length - 1 : state.step;
  const settled = reducedMotion ? true : state.settled;

  const activeIndex = item.path[step];
  const activeNode = FLOW_NODES[activeIndex];
  const reached = new Set(item.path.slice(0, step + 1));
  const tookBranch = item.path.includes(HUMAN);

  // The branch leaves the spine at the decision node, so the lit spine stops
  // there when a request is handed to a person.
  const spineHead = FLOW_NODES[activeIndex === HUMAN ? DECISION : activeIndex].y;

  const nodeState = (index: number) => {
    if (index === activeIndex && !settled) return "active";
    if (reached.has(index)) return "done";
    return "idle";
  };

  return (
    <div className={"mf-flow " + (className ?? "")} ref={hostRef}>
      <div className="mf-flow-head" aria-hidden="true">
        <span className="mf-flow-eyebrow">
          <i />
          Live workflow
        </span>
        <span className="mf-flow-now" key={item.label}>
          {item.label}
          <em>{item.source}</em>
        </span>
      </div>

      <div className="mf-flow-stage">
        <div
          className="mf-flow-rail"
          aria-hidden="true"
          style={{ top: SPINE_TOP + "%", height: SPINE_BOTTOM - SPINE_TOP + "%" }}
        />
        <div
          className="mf-flow-rail mf-flow-rail--live"
          aria-hidden="true"
          style={{ top: SPINE_TOP + "%", height: Math.max(0, spineHead - SPINE_TOP) + "%" }}
        />

        <svg
          className={"mf-flow-branch " + (reached.has(HUMAN) ? "is-live" : "")}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M30,48 C 48,48 58,60 76,60" vectorEffect="non-scaling-stroke" />
        </svg>

        <ol className="mf-flow-nodes" aria-label="How a request moves through a Mainframe system">
          {FLOW_NODES.map((node, index) => (
            <li
              key={node.id}
              className={
                "mf-flow-node" +
                (index === HUMAN ? " mf-flow-node--human" : "") +
                " is-" +
                nodeState(index)
              }
              style={{ left: node.x + "%", top: node.y + "%" }}
            >
              <i aria-hidden="true" />
              <strong>{node.title}</strong>
              <span>{node.detail}</span>
            </li>
          ))}
        </ol>

        <span
          className={"mf-flow-packet " + (settled ? "is-settled" : "")}
          aria-hidden="true"
          style={{ left: activeNode.x + "%", top: activeNode.y + "%" }}
        />
      </div>

      <p className="mf-flow-foot" aria-hidden="true">
        <span>{tookBranch ? "Routed to a person" : "Closed without anyone touching it"}</span>
        <span>{item.path.length} steps</span>
      </p>
    </div>
  );
}

export default WorkflowCanvas;
