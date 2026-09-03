import { useEffect, useState } from "react";
import { JOB } from "./thread";
import { useOnScreen } from "./useOnScreen";

export type OpsDeskProps = {
  reducedMotion?: boolean;
};

type Job = {
  ref: string;
  customer: string;
  site: string;
  owner: string;
  due: string;
  stage: number;
};

/** Ordered: a job only ever moves forward through these. */
const STAGES = ["Quoted", "Scheduled", "In progress", "Invoiced"];

const JOBS: Job[] = [
  { ref: "#" + JOB.ref, customer: JOB.customer, site: JOB.site, owner: JOB.owner, due: "Tue", stage: 1 },
  { ref: "#5511", customer: "Redgate Supplies", site: "Unit 4", owner: "DW", due: "Tue", stage: 2 },
  { ref: "#5510", customer: "Brayford Wharf", site: "Yard", owner: "MK", due: "Wed", stage: 3 },
  { ref: "#5509", customer: "Okonkwo Ltd", site: "Head office", owner: "SI", due: "Wed", stage: 0 },
  { ref: "#5508", customer: "Marlow & Co", site: "Bay 2", owner: "DW", due: "Thu", stage: 2 },
];

const NAV = ["Jobs", "Quotes", "Stock", "Invoices"];
const STEP_MS = 2600;

function OpsDesk({ reducedMotion = false }: OpsDeskProps) {
  const [hostRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [stages, setStages] = useState(() => JOBS.map((job) => job.stage));
  const [touched, setTouched] = useState(-1);

  useEffect(() => {
    if (reducedMotion || !onScreen) return;

    let step = 0;
    const id = window.setInterval(() => {
      const row = step % JOBS.length;
      setStages((current) =>
        current.map((stage, index) => (index === row ? (stage + 1) % STAGES.length : stage)),
      );
      // Each tick touches a different row, so the class moves and the flash
      // replays without remounting anything.
      setTouched(row);
      step += 1;
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [reducedMotion, onScreen]);

  const open = stages.filter((stage) => stage < 3).length;

  return (
    <div className="mf-ops" ref={hostRef}>
      <header className="mf-ops-bar">
        <span className="mf-ops-app">
          <i aria-hidden="true" />
          Fieldwork
        </span>
        <span className="mf-ops-search" aria-hidden="true">Search jobs</span>
        <span className="mf-ops-new" aria-hidden="true">New job</span>
      </header>

      <div className="mf-ops-body">
        <nav className="mf-ops-nav" aria-label="Tool sections">
          {NAV.map((item, index) => (
            <span key={item} className={index === 0 ? "is-current" : ""}>{item}</span>
          ))}
        </nav>

        <table className="mf-ops-table">
          <caption className="mf-ops-caption">Jobs in progress</caption>
          <thead>
            <tr>
              <th scope="col">Ref</th>
              <th scope="col">Customer</th>
              <th scope="col">Stage</th>
              <th scope="col">Owner</th>
              <th scope="col">Due</th>
            </tr>
          </thead>
          <tbody>
            {JOBS.map((job, index) => (
              <tr key={job.ref} className={index === touched ? "is-touched" : ""}>
                <td className="mf-ops-ref">{job.ref}</td>
                <td>
                  <strong>{job.customer}</strong>
                  <em>{job.site}</em>
                </td>
                <td>
                  <span className={"mf-ops-stage is-s" + stages[index]}>
                    <i aria-hidden="true" />
                    {STAGES[stages[index]]}
                  </span>
                </td>
                <td><span className="mf-ops-owner">{job.owner}</span></td>
                <td className="mf-ops-due">{job.due}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mf-ops-foot">
        <span>{open} open</span>
        <span>Built for one team, not for everyone</span>
      </p>
    </div>
  );
}

export default OpsDesk;
