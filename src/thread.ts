/**
 * One job, followed across the whole page.
 *
 * Every live panel on this site shows the same piece of work from a different
 * angle: it arrives on WhatsApp, closes itself in the run log, sits as a row in
 * the internal tool, and forces a customer record to be reconciled. Keeping the
 * identity in one place is what makes those read as one connected system rather
 * than five unrelated demos.
 */
export const JOB = {
  /** How the customer is referred to conversationally. */
  customer: "Halcyon Fixings",
  /** The reconciled, legal-form name the merged record settles on. */
  legalName: "Halcyon Fixings Ltd",
  /** The order reference, shown wherever this job surfaces. */
  ref: "5512",
  site: "Depot 3",
  owner: "SI",
  channel: "WhatsApp",
} as const;

/** Prefixed form, for anywhere the reference is shown on its own. */
export const JOB_REF = "#" + JOB.ref;
