import { useEffect, useState } from "react";
import { JOB, JOB_REF } from "./thread";
import { useOnScreen } from "./useOnScreen";

export type RecordMergeProps = {
  reducedMotion?: boolean;
};

const SOURCES = ["CRM", "Spreadsheet", "Invoicing"];

type Field = {
  key: string;
  /** One value per source, in SOURCES order. "—" means the source has nothing. */
  values: [string, string, string];
  /** Index of the source the resolved value came from. */
  winner: number;
  /** The kept value, which is not always identical to the winning source's. */
  value: string;
  note: string;
};

const FIELDS: Field[] = [
  {
    key: "Name",
    values: [JOB.legalName, JOB.customer.toUpperCase(), JOB.customer + " limited"],
    winner: 0,
    value: JOB.legalName,
    note: "3 spellings, 1 kept",
  },
  {
    key: "Email",
    values: ["halcyon@fix.example", "—", "accounts@halcyon.example"],
    winner: 2,
    value: "accounts@halcyon.example",
    note: "the one they actually reply from",
  },
  {
    key: "Phone",
    values: ["07700 900112", "07700900112", "—"],
    winner: 0,
    value: "+44 7700 900112",
    note: "normalised",
  },
  {
    key: "VAT",
    values: ["—", "GB 218 4471 09", "GB218447109"],
    winner: 1,
    value: "GB 218 4471 09",
    note: "formatted, then checked",
  },
];

const STEP_MS = 1700;

function RecordMerge({ reducedMotion = false }: RecordMergeProps) {
  const [hostRef, onScreen] = useOnScreen<HTMLDivElement>();
  // step === FIELDS.length means every field is resolved.
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reducedMotion || !onScreen) return;

    const id = window.setInterval(() => {
      // Hold on the finished record for one beat, then start over.
      setStep((current) => (current > FIELDS.length ? 0 : current + 1));
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [reducedMotion, onScreen]);

  const settled = reducedMotion || step >= FIELDS.length;
  const resolved = reducedMotion ? FIELDS : FIELDS.slice(0, step);
  const current = settled ? null : FIELDS[step];

  return (
    <div className="mf-merge" ref={hostRef}>
      <header className="mf-merge-head">
        <span>Reconciling {JOB.customer}, after order {JOB_REF}</span>
        <span className="mf-merge-count">{resolved.length}/{FIELDS.length} fields</span>
      </header>

      <div className="mf-merge-body">
        <section className="mf-merge-side">
          <p className="mf-merge-cap">Three systems, three answers</p>
          <ul className="mf-merge-sources">
            {SOURCES.map((source, index) => {
              const value = current ? current.values[index] : "—";
              const missing = value === "—";
              const winning = Boolean(current) && current!.winner === index;
              return (
                <li
                  key={source}
                  className={
                    "mf-merge-src" +
                    (winning ? " is-winner" : "") +
                    (missing && current ? " is-missing" : "")
                  }
                >
                  <span className="mf-merge-src-name">{source}</span>
                  <span className="mf-merge-src-value">{current ? value : "reconciled"}</span>
                </li>
              );
            })}
          </ul>
          {current && (
            <p className="mf-merge-now" key={current.key}>
              Resolving <b>{current.key}</b>
            </p>
          )}
        </section>

        <section className="mf-merge-side mf-merge-side--out">
          <p className="mf-merge-cap">One record</p>
          <dl className="mf-merge-record">
            {resolved.map((field) => (
              <div key={field.key} className="mf-merge-row">
                <dt>{field.key}</dt>
                <dd>
                  {field.value}
                  <em>from {SOURCES[field.winner]} · {field.note}</em>
                </dd>
              </div>
            ))}
            {!settled && <div className="mf-merge-row mf-merge-row--pending" aria-hidden="true"><span /></div>}
          </dl>
        </section>
      </div>

      <p className={"mf-merge-foot " + (settled ? "is-settled" : "")}>
        <span>{settled ? "Trusted, and the same everywhere" : "Comparing sources…"}</span>
        <span aria-hidden="true">1 of 4,200 customers</span>
      </p>
    </div>
  );
}

export default RecordMerge;
