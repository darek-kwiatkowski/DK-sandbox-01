# DevMentor — product brief

- Date: 2026-10-24
- Mode: own; Owner: Product owner; Pass: full
- Evidence basis: seven interviews, one Discord export (109 threads/14 days), a self-selected Discord survey (54), founder notes and benchmarks checked 2026-09-04. Supports some costly help-seeking, not DevMentor demand, a first use case or mentor capacity; survey overlap is unknown.
- Coverage: 34 claims — 29 sourced (interview 6, data 2, document 17, product 0, benchmark 4), 0 synthetic, 5 assumed; 1 entry on the collection plan
- Synthetic hypotheses outside Coverage: 0
- Definition of Ready signed by: Product owner for the direction and experiment cap; ready for: designing the manual test after Q01–Q03, not implementation planning
- Sources: `research/`; repository snapshot: `README.md`, `BACKWARD_COMPATIBILITY.md`

## Decision summary

Chosen direction: personally paid, prepaid text help, 25 or 50 minutes, within a 25-hour experiment cap (D01–D05). This is not demand evidence: 3/54 survey respondents paid for their last help situation.

Before taking payment, choose the situation, price, response/refund terms and safe-sharing rules (Q01–Q03). Text fits bugs; an interviewee wanted conversation for estimates. Mentors raised barriers to unknown askers, listings and invoicing. Test manually within the cap; defer checkout/matching.

## Vision

Help a developer get useful guidance on a specific technical problem through paid written help. Intended direction, not a demonstrated outcome. [DOCUMENT] `research/decisions/D01.md`

## Target group and stakeholders

- Customer: developer paying personally by decision. [DOCUMENT] `research/decisions/D02.md`
- User: developer with a recent problem; use case open. [ASSUMPTION] Q01
- Provider: relevant engineer; availability/payment untested. Two interviews cite barriers to invoices, unknown askers and listings. [INTERVIEW] `research/2026-09-03-interview-senior-python-meetups.md`; `research/2026-09-03-interview-staff-engineer-declined-before.md`
- Decider/stakeholders: Founder A (Product Owner); mentors deliver. [DOCUMENT] `research/2026-09-04-miro-board-stakeholders.md`; `research/2026-09-05-miro-board-raci-matrix.md`

## Problems, with evidence

- One developer searched 40 minutes for a TypeScript release issue, then shipped a workaround. [INTERVIEW] `research/2026-08-20-interview-working-dev.md`
- One fintech developer searched an hour, got wrong Discord advice, rolled back and delayed a release; frequency/payment untested. [INTERVIEW] `research/2026-09-01-interview-backend-dev-fintech.md`
- One freelancer lost about a week after underestimating a migration; text for bugs, conversation for estimates, and possible personal payment were stated. [INTERVIEW] `research/2026-09-02-interview-freelancer-react.md`
- One Discord: 23/109 threads unanswered; median first reply 68 minutes; 31 urgency signals. One founder labeled threads; resolution was not verified. [DATA] `research/2026-09-04-data-request-discord-help.md`; `research/2026-09-04-discord-help-requests.csv`
- Same-community survey: 3/54 paid last time; 37/54 hypothetically would pay for an answer within an hour. Neither is DevMentor demand. [DATA] `research/2026-09-04-survey-discord-willingness-to-pay.md`

## Product and how it stands out

- What it is: prepaid, 25- or 50-minute text-help sessions. [DOCUMENT] `research/decisions/D01.md`–`D04.md`
- Difference: problem-specific matching and useful guidance are untested. [ASSUMPTION] A01–A02

| reference | what it does well | where it falls short for this brief | checked on | link |
|---|---|---|---|---|
| Codementor | Live help; pricing per 15 minutes. | Text fit unknown; article last edited 2025-01-22. [BENCHMARK] `research/2026-09-04-benchmark-codementor.md` | 2026-09-04 | https://support.codementor.io/en/articles/4222721 |
| Topmate | Priority DM with deadline/refund; 10% own-link, 20% marketplace fee. | General expert offer. [BENCHMARK] `research/2026-09-04-benchmark-topmate.md` | 2026-09-04 | https://topmate.io/; https://topmate.io/pricing |
| MentorCruise | Ongoing software mentoring. | Differs from one-off direction. [BENCHMARK] `research/2026-09-04-benchmark-mentorcruise.md` | 2026-09-04 | https://mentorcruise.com/filter/softwaredevelopment/ |
| ADPList | Free 1:1 mentoring, usually video. | Not paid text help. [BENCHMARK] `research/2026-09-04-benchmark-adplist.md` | 2026-09-04 | https://adplist.org/become-a-mentor |

## Goals and success criteria

- Business goal: test prepayment and delivery within D05; no revenue/pass target.
- User outcome: useful guidance in time to act. [INTERVIEW] `research/2026-08-20-interview-working-dev.md`; `research/2026-09-01-interview-backend-dev-fintech.md`
- Metric: offer, payment, delivery, reported outcome and effort; baseline, threshold/date open.
- Constraints: text-only (R01); publish session material only with mentee approval (R02).

## Scope

- **Now:** manually offer one prepaid 25- or 50-minute text session within D05; answer Q01–Q03 first.
- **Later:** marketplace, knowledge vault/MCP and subscriptions are unvalidated proposals. [DOCUMENT] `research/2026-09-02-miro-board-product-goals.md`
- **Not doing:** see N01–N03.

## Domain glossary

| Term | Meaning | Owned by | Visible to |
|---|---|---|---|
| Prepaid session | Pay before one 25- or 50-minute text session; stored credits undecided. | Product owner | Developer and mentor |

## Key flows

- Current: search, ask a colleague/community, sometimes wait or get conflicting advice; evidence is limited to cases and one community. [INTERVIEW] `research/2026-08-20-interview-working-dev.md`; [DATA] `research/2026-09-04-data-request-discord-help.md`
- Proposed: developer submits a problem; mentor accepts; developer prepays; they exchange text and record outcome. Match, timing and terms open. [ASSUMPTION] A01–A02

## Business rules

| Id | Rule | Applies to | Source | Status | Review by | Required path to change | Owner | Supersedes |
|---|---|---|---|---|---|---|---|---|
| R01 | Text-only. | Sessions | [DOCUMENT] `research/decisions/N01-no-video.md` | active | If reopened | Founder A approval | Founder A | none |
| R02 | Publish only with mentee approval. | Publication | [DOCUMENT] `research/2026-08-26-workshop-export.md` | active | Before publication | Both founders approve | Both founders | none |
| R03 | 25 or 50 minutes. | First test | [DOCUMENT] `research/decisions/D04.md` | active | After test | Product Owner approval | Product owner | none |
| R04 | 25-hour cap. | First experiment | [DOCUMENT] `research/decisions/D05.md` | active | At cap/end | Product Owner approval | Product owner | none |

## Non-goals

| Id | We are not building | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|
| N01 | Video. | R01 | Founder A | active | If reopened | Founder A approval | [DOCUMENT] `research/decisions/N01-no-video.md` | none |
| N02 | Mentor ratings. | Active choice; interviewees also reject. | Founder A | active | If reopened | Founder A approval | [DOCUMENT] `research/decisions/N02-no-ratings.md` | none |
| N03 | Marketplace/vault/MCP/subscriptions in first test. | Deferred proposals. | Product owner | proposal | Before implementation | Product Owner approval | [DOCUMENT] `research/2026-09-02-miro-board-product-goals.md`; D01 | none |

## Decisions

| Id | Date | Decision | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|---|
| D01 | 2026-10-24 | Paid text-help MVP. | Chosen direction; demand unproven. | Product owner | active | Before expansion | Product Owner approval | [DOCUMENT] `research/decisions/D01.md` | none |
| D02 | 2026-10-24 | Developer pays personally. | Test model, not observed willingness. | Product owner | active | After purchase | Product Owner approval | [DOCUMENT] `research/decisions/D02.md` | none |
| D03 | 2026-10-24 | Prepay each session. | Price/flow open. | Product owner | active | After test | Product Owner approval | [DOCUMENT] `research/decisions/D03.md` | none |
| D04 | 2026-10-24 | 25- or 50-minute text sessions. | Confirmed duration choices. | Product owner | active | After test | Product Owner approval | [DOCUMENT] `research/decisions/D04.md` | none |
| D05 | 2026-10-24 | Cap first test at 25 work hours. | Bound learning. | Product owner | active | At cap/end | Product Owner approval | [DOCUMENT] `research/decisions/D05.md` | none |

## Riskiest assumptions

| Id | Assumption | Importance | Evidence today | If false | Smallest test | Owner | By when | Result |
|---|---|---|---|---|---|---|---|---|
| A01 | Developer in chosen situation prepays. [ASSUMPTION] | high | 3/54 paid last time, not DevMentor. [DATA] `research/2026-09-04-survey-discord-willingness-to-pay.md` | Change offer/target. | Real offer; observe payment/refusal. | Product owner | D05 | untested |
| A02 | Mentor accepts and delivers useful text help. [ASSUMPTION] | high | Prospects not contacted; barriers include invoices, unknown askers, listings. [INTERVIEW] `research/2026-09-03-interview-senior-python-meetups.md`; `research/2026-09-03-interview-staff-engineer-declined-before.md` | Stay manual/change supply. | Invite relevant mentor; observe delivery/effort. | Product owner | D05 | untested |

## Kill criteria

Threshold open; Product owner decides at the cap from payment, delivery and outcome, not stated intent.

## Hypotheses to test

No synthetic-user walkthrough has been completed; none is counted. Test A01–A02 with real offers and delivery.

## Open questions

| Id | Question | Blocking | Who can answer | Status |
|---|---|---|---|---|
| Q01 | First situation: release blocker or freelancer estimate? | Yes; recruitment/text fit. | Product owner | open |
| Q02 | Price per duration? | Yes; before offer. | Product owner, buyers | open |
| Q03 | Response, refund/no-show and code-sharing terms? | Yes; before payment/material. | Product owner, mentor | open |

## Definition of Ready addendum (own)

Cases support a problem, not a broad segment or text fit for both situations. Direction and cap are chosen; Q01–Q03 block the paid test. Manual design follows; implementation is not ready.

## Collection plan

### Record one real prepaid offer and delivery

- Decision: continue manually or build booking/payment.
- Who/how: developer with Q01 problem plus relevant mentor; resolve Q01–Q03, then make a real prepaid offer.
- Record payment, acceptance, delivery, outcome and effort in `research/templates/data-request.md`.
- Owner/timing: Product owner; within D05 cap; date unknown.
