export type Phase = {
  name: string;
  detail: string;
  /** Percentages across the whole engagement, so phases can overlap honestly. */
  start: number;
  span: number;
};

const PHASES: Phase[] = [
  {
    name: "See the drag",
    detail: "Where work stalls, repeats, or falls through",
    start: 0,
    span: 25,
  },
  {
    name: "Map the system",
    detail: "The people, tools, and decisions already doing the work",
    start: 12.5,
    span: 31.25,
  },
  {
    name: "Build the useful part",
    detail: "The right pieces, dependable, with room to grow",
    start: 31.25,
    span: 43.75,
  },
  {
    name: "Put it into motion",
    detail: "Shipped, refined with the team, and actually adopted",
    start: 62.5,
    span: 37.5,
  },
];

const MARKS = [
  { label: "Workflow map", at: 43.75 },
  { label: "First tool live", at: 75 },
  { label: "Handover", at: 100 },
];

const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8];

function BuildTimeline() {
  return (
    <div className="mf-timeline">
      <header className="mf-timeline-head">
        <span>A typical first build</span>
        <span className="mf-timeline-len">8 weeks</span>
      </header>

      <div className="mf-tl-scale" aria-hidden="true">
        <span className="mf-tl-spacer" />
        <span className="mf-tl-weeks">
          {WEEKS.map((week) => <i key={week}>W{week}</i>)}
        </span>
      </div>

      <ol className="mf-tl-rows">
        {PHASES.map((phase, index) => (
          <li key={phase.name} className="mf-tl-row">
            <span className="mf-tl-label">
              <b>{String(index + 1).padStart(2, "0")}</b>
              <strong>{phase.name}</strong>
              <em>{phase.detail}</em>
            </span>
            <span className="mf-tl-track">
              <span
                className="mf-tl-bar"
                aria-hidden="true"
                style={{ left: phase.start + "%", width: phase.span + "%" }}
              />
            </span>
          </li>
        ))}
      </ol>

      <div className="mf-tl-marks">
        <span className="mf-tl-spacer" />
        <ul className="mf-tl-track mf-tl-track--marks" aria-label="What you get, and when">
          {MARKS.map((mark, index) => (
            <li
              key={mark.label}
              className={"mf-tl-mark" + (index === MARKS.length - 1 ? " is-end" : "")}
              style={index === MARKS.length - 1 ? undefined : { left: mark.at + "%" }}
            >
              <i aria-hidden="true" />
              {mark.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BuildTimeline;
