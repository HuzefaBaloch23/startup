import { type FormEvent, useState } from "react";

export type ContactFormProps = {
  email: string;
};

type Fields = {
  name: string;
  email: string;
  phone: string;
  want: string;
};

type Errors = Partial<Record<keyof Fields, string>>;

const EMPTY: Fields = { name: "", email: "", phone: "", want: "" };

/** Deliberately loose: enough to catch a typo, not to reject a valid address. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (fields: Fields): Errors => {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Please tell us your name.";
  if (!fields.email.trim()) {
    errors.email = "We need an email to reply to.";
  } else if (!EMAIL_SHAPE.test(fields.email.trim())) {
    errors.email = "That does not look like an email address.";
  }
  if (!fields.want.trim()) errors.want = "Tell us what you would like to automate.";
  return errors;
};

function ContactForm({ email }: ContactFormProps) {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const set = (key: keyof Fields) => (event: { target: { value: string } }) => {
    setFields((current) => ({ ...current, [key]: event.target.value }));
    // Clear a field's error as soon as the person starts fixing it.
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = document.getElementById("cf-" + (Object.keys(found)[0] as string));
      first?.focus();
      return;
    }

    const body = [
      "Name: " + fields.name.trim(),
      "Email: " + fields.email.trim(),
      fields.phone.trim() ? "Phone: " + fields.phone.trim() : "Phone: not given",
      "",
      "What they would like to automate:",
      fields.want.trim(),
    ].join("\n");

    window.location.href =
      "mailto:" + email +
      "?subject=" + encodeURIComponent("New enquiry from " + fields.name.trim()) +
      "&body=" + encodeURIComponent(body);

    setSent(true);
  };

  const field = (key: keyof Fields) => ({
    id: "cf-" + key,
    value: fields[key],
    onChange: set(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? "cf-" + key + "-error" : undefined,
  });

  return (
    <form className="mf-form" onSubmit={onSubmit} noValidate>
      <div className="mf-form-row">
        <div className="mf-form-field">
          <label htmlFor="cf-name">Your name</label>
          <input type="text" autoComplete="name" {...field("name")} />
          {errors.name && <p className="mf-form-error" id="cf-name-error">{errors.name}</p>}
        </div>

        <div className="mf-form-field">
          <label htmlFor="cf-email">Email</label>
          <input type="email" autoComplete="email" {...field("email")} />
          {errors.email && <p className="mf-form-error" id="cf-email-error">{errors.email}</p>}
        </div>
      </div>

      <div className="mf-form-field">
        <label htmlFor="cf-phone">Phone <span>optional</span></label>
        <input type="tel" autoComplete="tel" {...field("phone")} />
      </div>

      <div className="mf-form-field">
        <label htmlFor="cf-want">What would you like to automate?</label>
        <textarea rows={4} {...field("want")} />
        {errors.want && <p className="mf-form-error" id="cf-want-error">{errors.want}</p>}
      </div>

      <div className="mf-form-foot">
        <button type="submit" className="mf-form-send" data-cursor>Send it to us</button>
        <span className="mf-form-note">We will come back to you within one working day.</span>
      </div>

      <p className="mf-form-status" role="status">
        {sent ? "Your email should be open with the details filled in — press send there and it reaches us." : ""}
      </p>
    </form>
  );
}

export default ContactForm;
