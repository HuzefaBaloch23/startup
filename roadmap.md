# Roadmap

## In progress: contact form really sends
- [ ] Email domain setup — postponed by user
- [ ] Scaffold email templates once domain is configured
- [ ] Build contact-enquiry email template + server send path (validate, rate-limit, send to owner's personal inbox)
- [ ] Rewire ContactForm.tsx: real submit, sending/success/error states, send + success animations (styles in polish.css)
- [ ] Store owner's destination email as a secret — BLOCKER: user hasn't given the personal email yet
- [ ] Verify: build clean, form behaves (error path until domain verifies), Playwright check

## Standing / waiting on user
- [x] Site email set to team@codavolt.tech
- Real client work + founder line: bring back a proof section only when real projects exist
