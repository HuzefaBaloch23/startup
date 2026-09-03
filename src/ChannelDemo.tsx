import { type CSSProperties, useEffect, useState } from "react";
import { JOB, JOB_REF } from "./thread";
import { useOnScreen } from "./useOnScreen";

export type ChannelDemoProps = {
  reducedMotion?: boolean;
};

type WaMessage = { from: "them" | "us"; text: string; time: string; read?: boolean };
type SlackMessage = {
  author: string;
  initials: string;
  color: string;
  time: string;
  text: string;
  app?: boolean;
};

type Common = {
  label: string;
  /** Text-safe on a dark ground: footer, bullets, panel rule, tab dot. */
  accent: string;
  /** Brand fill behind the active tab, where contrast is handled by tabText. */
  fill: string;
  tabText: string;
  outcome: string;
};

type Channel =
  | (Common & { id: "whatsapp"; contact: string; initials: string; presence: string; messages: WaMessage[] })
  | (Common & { id: "email"; subject: string; from: string; initials: string; address: string; time: string; body: string[]; actions: string[] })
  | (Common & { id: "slack"; room: string; messages: SlackMessage[] })
  | (Common & { id: "form"; formName: string; fields: { label: string; value: string }[]; confirmations: string[] });

const CHANNELS: Channel[] = [
  {
    id: "whatsapp",
    label: "WhatsApp",
    accent: "#25D366",
    fill: "#25D366",
    tabText: "#0A0A0D",
    outcome: "Order " + JOB_REF + " created, no one waiting",
    contact: JOB.customer,
    initials: "HF",
    presence: "online",
    messages: [
      { from: "them", text: "Do you have the 40mm brackets in stock?", time: "09:41" },
      { from: "us", text: "Checking " + JOB.site + " for you.", time: "09:41", read: true },
      { from: "us", text: "120 in stock. Want me to reserve 50?", time: "09:41", read: true },
      { from: "them", text: "Yes please", time: "09:42" },
      { from: "us", text: "Reserved. Order " + JOB_REF + " created, invoice on its way.", time: "09:42", read: true },
    ],
  },
  {
    id: "email",
    label: "Email",
    accent: "#8AB4F8",
    fill: "#8AB4F8",
    tabText: "#0A0A0D",
    outcome: "Filed against the right PO",
    subject: "Invoice INV-2214",
    from: "Redgate Supplies",
    initials: "R",
    address: "accounts@redgate.example",
    time: "08:12",
    body: [
      "Morning — invoice attached for last week's delivery.",
      "Payment terms 30 days as agreed. INV-2214, £4,180.00.",
    ],
    actions: [
      "Read the attachment and pulled the line items.",
      "Matched to PO-881. Totals agree.",
      "Filed and queued for Friday's payment run.",
    ],
  },
  {
    id: "slack",
    label: "Slack",
    accent: "#36C5F0",
    fill: "#4A154B",
    tabText: "#FFFFFF",
    outcome: "Owner assigned with context",
    room: "sales-inbound",
    messages: [
      {
        author: "Mainframe",
        initials: "M",
        color: "#3F0E40",
        time: "11:04",
        text: "New lead — Okonkwo Ltd. 40 seats, enterprise plan.",
        app: true,
      },
      {
        author: "Mainframe",
        initials: "M",
        color: "#3F0E40",
        time: "11:04",
        text: "Matched an existing account. Assigned to Sana, context added to the CRM.",
        app: true,
      },
      {
        author: "Sana Iqbal",
        initials: "SI",
        color: "#2C7A6B",
        time: "11:06",
        text: "Got it, calling them now",
      },
    ],
  },
  {
    id: "form",
    label: "Web form",
    accent: "#E9B9C8",
    fill: "#E9B9C8",
    tabText: "#0A0A0D",
    outcome: "Confirmed and on the calendar",
    formName: "Book a site visit",
    fields: [
      { label: "Name", value: "Dara Whitfield" },
      { label: "Site", value: "Unit 4, Brayford Wharf" },
      { label: "Preferred slot", value: "Tuesday, 3:00pm" },
    ],
    confirmations: [
      "Checked the calendar. That slot is free.",
      "Confirmed and invite sent.",
      "CRM updated with the visit.",
    ],
  },
];

const STEP_MS = 1050;

const totalSteps = (channel: Channel) => {
  switch (channel.id) {
    case "whatsapp":
      return channel.messages.length;
    case "slack":
      return channel.messages.length;
    case "email":
      return 1 + channel.actions.length;
    case "form":
      return 1 + channel.confirmations.length;
  }
};

function Ticks({ read }: { read?: boolean }) {
  return (
    <svg className={"mf-wa-ticks " + (read ? "is-read" : "")} viewBox="0 0 16 11" aria-hidden="true">
      <path d="M1 5.6 3.4 8 8.6 2.6" />
      <path d="M6.2 5.6 8.6 8 13.8 2.6" />
    </svg>
  );
}

type DemoState = { channel: number; shown: number; holding: boolean };

function ChannelDemo({ reducedMotion = false }: ChannelDemoProps) {
  const [hostRef, onScreen] = useOnScreen<HTMLDivElement>();
  const [state, setState] = useState<DemoState>({ channel: 0, shown: 1, holding: false });
  // Once someone picks a channel themselves, stop moving the goalposts on them.
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (reducedMotion || !onScreen) return;

    const id = window.setInterval(() => {
      setState((current) => {
        const total = totalSteps(CHANNELS[current.channel]);

        if (current.shown < total) return { ...current, shown: current.shown + 1 };
        if (manual) return current;
        if (!current.holding) return { ...current, holding: true };
        return { channel: (current.channel + 1) % CHANNELS.length, shown: 1, holding: false };
      });
    }, STEP_MS);

    return () => window.clearInterval(id);
  }, [reducedMotion, manual, onScreen]);

  const channel = CHANNELS[state.channel];
  const total = totalSteps(channel);
  const shown = reducedMotion ? total : state.shown;
  const complete = shown >= total;

  const pick = (index: number) => {
    setManual(true);
    setState({
      channel: index,
      shown: reducedMotion ? totalSteps(CHANNELS[index]) : 1,
      holding: false,
    });
  };

  return (
    <div
      className="mf-channel-demo"
      ref={hostRef}
      data-channel={channel.id}
      style={{ "--ch-accent": channel.accent } as CSSProperties}
    >
      <div className="mf-channel-tabs" role="tablist" aria-label="Channels we build on">
        {CHANNELS.map((entry, index) => {
          const isActive = index === state.channel;
          const style = {
            "--tab-accent": entry.accent,
            ...(isActive ? { background: entry.fill, color: entry.tabText } : null),
          } as CSSProperties;

          return (
            <button
              key={entry.id}
              type="button"
              role="tab"
              id={"channel-tab-" + entry.id}
              aria-selected={isActive}
              aria-controls="channel-thread"
              tabIndex={isActive ? 0 : -1}
              onClick={() => pick(index)}
              style={style}
              data-cursor
            >
              <i aria-hidden="true" style={isActive ? { background: entry.tabText, opacity: 0.5 } : undefined} />
              {entry.label}
            </button>
          );
        })}
      </div>

      <div
        className="mf-channel-stage"
        id="channel-thread"
        role="tabpanel"
        aria-labelledby={"channel-tab-" + channel.id}
        tabIndex={0}
      >
        {channel.id === "whatsapp" && (
          <div className="mf-wa">
            <header className="mf-wa-bar">
              <span className="mf-wa-avatar" aria-hidden="true">{channel.initials}</span>
              <span className="mf-wa-who">
                <strong>{channel.contact}</strong>
                <em>{channel.presence}</em>
              </span>
            </header>
            <ol className="mf-wa-body">
              {channel.messages.slice(0, shown).map((message, index) => (
                <li key={index} className={"mf-wa-msg mf-wa-msg--" + message.from}>
                  {message.text}
                  <span className="mf-wa-meta">
                    {message.time}
                    {message.from === "us" && <Ticks read={message.read} />}
                  </span>
                </li>
              ))}
            </ol>
            <footer className="mf-wa-input" aria-hidden="true"><span>Message</span></footer>
          </div>
        )}

        {channel.id === "slack" && (
          <div className="mf-sl">
            <header className="mf-sl-bar">
              <span aria-hidden="true">#</span>{channel.room}
            </header>
            <ol className="mf-sl-body">
              {channel.messages.slice(0, shown).map((message, index) => (
                <li key={index} className="mf-sl-msg">
                  <span className="mf-sl-avatar" style={{ background: message.color }} aria-hidden="true">
                    {message.initials}
                  </span>
                  <span className="mf-sl-head">
                    <strong>{message.author}</strong>
                    {message.app && <b className="mf-sl-app">APP</b>}
                    <time>{message.time}</time>
                  </span>
                  <p>{message.text}</p>
                </li>
              ))}
            </ol>
          </div>
        )}

        {channel.id === "email" && (
          <div className="mf-gm">
            <h4 className="mf-gm-subject">{channel.subject}</h4>
            <div className="mf-gm-from">
              <span className="mf-gm-avatar" aria-hidden="true">{channel.initials}</span>
              <span className="mf-gm-id">
                <strong>{channel.from}</strong>
                <em>{channel.address}</em>
              </span>
              <time>{channel.time}</time>
            </div>
            <div className="mf-gm-body">
              {channel.body.map((line) => <p key={line}>{line}</p>)}
              <span className="mf-gm-attach" aria-hidden="true">INV-2214.pdf</span>
            </div>
            <ol className="mf-gm-actions">
              {channel.actions.slice(0, Math.max(0, shown - 1)).map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ol>
          </div>
        )}

        {channel.id === "form" && (
          <div className="mf-fm">
            <header className="mf-fm-bar">{channel.formName}</header>
            <dl className="mf-fm-fields">
              {channel.fields.map((field) => (
                <div key={field.label}>
                  <dt>{field.label}</dt>
                  <dd>{field.value}</dd>
                </div>
              ))}
            </dl>
            <ol className="mf-fm-log">
              {channel.confirmations.slice(0, Math.max(0, shown - 1)).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ol>
          </div>
        )}
      </div>

      <p className={"mf-channel-foot " + (complete ? "is-complete" : "")}>
        <span>{complete ? channel.outcome : "Working…"}</span>
        <span aria-hidden="true">{shown}/{total}</span>
      </p>
    </div>
  );
}

export default ChannelDemo;
