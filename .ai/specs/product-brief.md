# DevMentor — product brief

- Date: 2026-10-25
- Mode: own; Owner: Product owner; Pass: full
- Evidence basis: seven interviews, one Discord export (109 threads/14 days), a self-selected Discord survey (54), founder notes and benchmarks checked 2026-09-04. Supports some costly help-seeking, not DevMentor demand, a first use case or mentor capacity; survey overlap is unknown.
- Coverage: 37 claims — 32 sourced (interview 6, data 2, document 20, product 0, benchmark 4), 0 synthetic, 5 assumed; 1 entry on the collection plan
- Synthetic hypotheses outside Coverage: 0
- Definition of Ready signed by: Product owner for the staged experiment and its 25-hour cap; ready for: planning the manual pre-payment test, not implementation planning
- Sources: `research/`; repository snapshot: `README.md`, `BACKWARD_COMPATIBILITY.md`

## Decision summary

Chosen direction: paid, prepaid text help remains the intended product (D01–D04), but the first 25-hour experiment will test a release-blocking problem and mentor delivery in a manually coordinated, unpaid text session before any price or payment flow is introduced (D06). This is not demand evidence: 3/54 survey respondents paid for their last help situation.

The first situation is a release-blocking problem; no mentor response within 24 hours counts as refusal. The user is responsible for excluding sensitive data and internal-system access from shared code; the system will not inspect or police it. Price is deferred until a later stage. Mentors raised barriers to unknown askers, listings and invoicing, and delivery capacity remains untested.

## Vision

The intended later product is paid written help for a developer with a specific technical problem; this is a chosen direction, not a demonstrated outcome. [DOCUMENT] `research/decisions/D01.md`

## Target group and stakeholders

- Customer: developer paying personally by decision. [DOCUMENT] `research/decisions/D02.md`
- User: developer facing a release-blocking problem. Two individual accounts describe this situation; the selected test case is not evidence of a broad segment. [INTERVIEW] `research/2026-08-20-interview-working-dev.md`; `research/2026-09-01-interview-backend-dev-fintech.md`; test selection [DOCUMENT] `research/decisions/D06.md`
- Provider: relevant engineer; availability/payment untested. Two interviews cite barriers to invoices, unknown askers and listings. [INTERVIEW] `research/2026-09-03-interview-senior-python-meetups.md`; `research/2026-09-03-interview-staff-engineer-declined-before.md`
- Decider/stakeholders: Founder A (Product Owner); mentors deliver. [DOCUMENT] `research/2026-09-04-miro-board-stakeholders.md`; `research/2026-09-05-miro-board-raci-matrix.md`

## Problems, with evidence

- One developer searched 40 minutes for a TypeScript release issue, then shipped a workaround. [INTERVIEW] `research/2026-08-20-interview-working-dev.md`
- One fintech developer searched an hour, got wrong Discord advice, rolled back and delayed a release; frequency/payment untested. [INTERVIEW] `research/2026-09-01-interview-backend-dev-fintech.md`
- One freelancer lost about a week after underestimating a migration; text for bugs, conversation for estimates, and possible personal payment were stated. [INTERVIEW] `research/2026-09-02-interview-freelancer-react.md`
- One Discord: 23/109 threads unanswered; median first reply 68 minutes; 31 urgency signals. One founder labeled threads; resolution was not verified. [DATA] `research/2026-09-04-data-request-discord-help.md`; `research/2026-09-04-discord-help-requests.csv`
- Same-community survey: 3/54 paid last time; 37/54 hypothetically would pay for an answer within an hour. Neither is DevMentor demand. [DATA] `research/2026-09-04-survey-discord-willingness-to-pay.md`

## Product and how it stands out

- Intended later product: prepaid, 25- or 50-minute text-help sessions. The current experiment is unpaid and does not set a duration. [DOCUMENT] `research/decisions/D01.md`–`D04.md`, `research/decisions/D06.md`
- Difference: problem-specific matching and useful guidance are untested. [ASSUMPTION] A01–A02

| reference | what it does well | where it falls short for this brief | checked on | link |
|---|---|---|---|---|
| Codementor | Live help; pricing per 15 minutes. | Text fit unknown; article last edited 2025-01-22. [BENCHMARK] `research/2026-09-04-benchmark-codementor.md` | 2026-09-04 | https://support.codementor.io/en/articles/4222721 |
| Topmate | Priority DM with deadline/refund; 10% own-link, 20% marketplace fee. | General expert offer. [BENCHMARK] `research/2026-09-04-benchmark-topmate.md` | 2026-09-04 | https://topmate.io/; https://topmate.io/pricing |
| MentorCruise | Ongoing software mentoring. | Differs from one-off direction. [BENCHMARK] `research/2026-09-04-benchmark-mentorcruise.md` | 2026-09-04 | https://mentorcruise.com/filter/softwaredevelopment/ |
| ADPList | Free 1:1 mentoring, usually video. | Not paid text help. [BENCHMARK] `research/2026-09-04-benchmark-adplist.md` | 2026-09-04 | https://adplist.org/become-a-mentor |

## Goals and success criteria

- Business goal: within a 25-hour cap, observe whether a developer with a release-blocking problem submits it, a relevant mentor accepts within 24 hours, and an unpaid text session is delivered; record outcome and effort. This staged test does not measure willingness to pay or set a session duration. [DOCUMENT] `research/decisions/D06.md`
- User outcome: useful guidance in time to act. [INTERVIEW] `research/2026-08-20-interview-working-dev.md`; `research/2026-09-01-interview-backend-dev-fintech.md`
- Metric: invitations, response within 24 hours, acceptance/refusal, delivery, developer-reported outcome and effort; baseline, threshold/date open. This experiment does not measure willingness to pay.
- Constraints: text-only (R01); publish session material only with mentee approval (R02).

## Scope

- **Now:** manually invite a relevant mentor to help with a developer's release-blocking problem, then deliver an unpaid text-help session if accepted; an explicit decline or no response within 24 hours is refusal. Stay within the 25-hour cap (D06).
- **Later:** use one of the 25- or 50-minute durations chosen in D04, set a configurable price for a paid test, then test prepayment; only after that consider checkout/matching. Marketplace, knowledge vault/MCP and subscriptions remain unvalidated proposals. [DOCUMENT] `research/2026-09-02-miro-board-product-goals.md`
- **Not doing:** see N01–N03.

## Domain glossary

| Term | Meaning | Owned by | Visible to |
|---|---|---|---|
| Prepaid session | Later-stage offer: pay before one 25- or 50-minute text session; stored credits undecided. Not part of the current experiment. | Product owner | Developer and mentor |

## Key flows

- Current: search, ask a colleague/community, sometimes wait or get conflicting advice; evidence is limited to cases and one community. [INTERVIEW] `research/2026-08-20-interview-working-dev.md`; [DATA] `research/2026-09-04-data-request-discord-help.md`
- Proposed for the current manual test: developer submits a release-blocking problem; product owner invites a relevant mentor; an explicit decline or no response within 24 hours counts as refusal; if accepted, they exchange text without payment and record delivery, developer-reported outcome and effort. Payment and matching are deferred. [DOCUMENT] `research/decisions/D06.md`

## Business rules

| Id | Rule | Applies to | Source | Status | Review by | Required path to change | Owner | Supersedes |
|---|---|---|---|---|---|---|---|---|
| R01 | Text-only. | Sessions | [DOCUMENT] `research/decisions/N01-no-video.md` | active | If reopened | Founder A approval | Founder A | none |
| R02 | Publish only with mentee approval. | Publication | [DOCUMENT] `research/2026-08-26-workshop-export.md` | active | Before publication | Both founders approve | Both founders | none |
| R03 | A paid text-help session lasts 25 or 50 minutes. | Later paid test | [DOCUMENT] `research/decisions/D04.md` | active | Before paid test | Product Owner approval | Product owner | none |
| R04 | Cap the manual pre-payment experiment at 25 work hours. | Current experiment | [DOCUMENT] `research/decisions/D06.md` | active | At cap/end | Product Owner approval | Product owner | D05 |
| R05 | Before sharing code, the user must remove sensitive data, credentials, tokens and details that grant access to internal systems; the system does not inspect or enforce this. | Shared code | [DOCUMENT] `research/decisions/D06.md` | active | Before any code-sharing flow | Product Owner approval | Product owner | none |
| R06 | If the invited mentor has not responded within 24 hours, record the request as refused. | First manual experiment | [DOCUMENT] `research/decisions/D06.md` | active | After first experiment | Product Owner approval | Product owner | none |

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
| D05 | 2026-10-24 | Cap the first manual paid text-help experiment at 25 work hours. | Bound learning. | Product owner | superseded | At cap/end | Product Owner approval | [DOCUMENT] `research/decisions/D05.md` | D06 |
| D06 | 2026-10-25 | Run a manual, unpaid text-help experiment for a release-blocking problem before testing price or prepayment; retain the 25-hour cap. | First establish whether the selected problem attracts a mentor who can deliver help; price will be configurable later. | Product owner | active | After the experiment | Product Owner approval | [DOCUMENT] `research/decisions/D06.md` | D05 |

## Riskiest assumptions

| Id | Assumption | Importance | Evidence today | If false | Smallest test | Owner | By when | Result |
|---|---|---|---|---|---|---|---|---|
| A01 | Developer in chosen situation prepays. [ASSUMPTION] | high | 3/54 paid last time, not DevMentor. [DATA] `research/2026-09-04-survey-discord-willingness-to-pay.md` | Change offer/target. | In a later stage, configure a price and make a real offer; observe payment/refusal. | Product owner | After D06 experiment | untested |
| A02 | Mentor accepts and delivers useful text help. [ASSUMPTION] | high | Prospects not contacted; barriers include invoices, unknown askers, listings. [INTERVIEW] `research/2026-09-03-interview-senior-python-meetups.md`; `research/2026-09-03-interview-staff-engineer-declined-before.md` | Stay manual/change supply. | In the current unpaid test, invite a relevant mentor; observe response, delivery and developer-reported outcome/effort. | Product owner | D06 experiment | untested |

## Kill criteria

Threshold open; at the 25-hour cap, the Product owner decides whether to continue based on mentor response/acceptance, delivery, developer-reported outcome and effort. This experiment produces no payment evidence.

## Hypotheses to test

No synthetic-user walkthrough has been completed; none is counted. The current unpaid test addresses A02 through mentor response and delivery; A01 remains untested until a later priced offer.

## Open questions

| Id | Question | Blocking | Who can answer | Status |
|---|---|---|---|---|
| Q01 | First situation: release blocker or freelancer estimate? | No; resolved for the first experiment as release-blocking problem. | Product owner | resolved: 2026-10-25 |
| Q02 | What configurable price should be tested for each duration? | No for the current unpaid experiment; blocks the later paid/prepayment test. | Product owner, buyers | deferred |
| Q03 | Response/refusal and code-sharing terms? | No; no-response cutoff and user responsibility for safe sharing resolved for the current experiment. Refund/no-show terms remain for the later paid test. | Product owner, mentor | partly resolved: 2026-10-25 |

## Definition of Ready addendum (own)

Cases support individual costly help-seeking, not a broad segment or DevMentor demand. The product owner chose a release-blocker case and a manual, unpaid delivery test; this is ready for experiment planning, not implementation. Price and payment remain out of this test and must be decided before a later paid offer.

## Collection plan

### Record one manual text-help request and delivery

- Decision: whether to proceed to a paid, configurable-price test after learning whether the selected problem attracts mentor participation and useful text delivery.
- Who/how: developer with a release-blocking problem and a relevant mentor; invite the mentor manually and, if accepted, coordinate one unpaid text-help session. Count explicit decline or no response within 24 hours as refusal. Before sharing code, the user removes sensitive data, credentials, tokens and details that grant access to internal systems; the system does not enforce this.
- Record request, response within 24 hours, acceptance/refusal, delivery, developer-reported outcome and effort in `research/templates/data-request.md`.
- Owner/timing: Product owner; within the 25-hour cap; date unknown.
