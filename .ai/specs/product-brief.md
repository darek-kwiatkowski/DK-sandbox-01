# DevMentor — product brief

- Date: 2026-10-26 (refresh of the 2026-09-14 draft); Mode: own; Owner: founder A (Oliwia), scope decider; refresh run by founder B (Maciej); Pass: full refresh with independent review.
- Evidence basis: seven supplied interview records (four mentee situations, three mentor situations); the longer records are edited transcripts and summaries, not verified verbatim transcripts, and their stated dates, authors and roles are provenance, not verified identities. A 109-thread Discord export, a 54-response survey from the same community and a 50-prospect mentor list broaden the material but are not independent samples of the market. Founder decisions set scope. The most consequential untested belief is A02: developers pay for a scheduled text session.
- Coverage: 117 claims — 86 sourced (interview 10, data 3, document 68, product 0, benchmark 5), 0 synthetic, 31 assumed; 4 entries on the collection plan
- Synthetic hypotheses outside Coverage: 18; their cited walkthrough report is not in the repository (see Hypotheses to test).
- Definition of Ready signed by: founder B (Maciej) on 2026-10-26, reporting founder A's agreement; ready for: implementation planning of the full 1.0 scope; taking real payments needs founder A's approved terms (R33) and an operator-set fee (R28).
- Sources: interviews, data, benchmarks and workshop records in `research/`; decision records in `research/decisions/` and, for D07, `../../devmentor-synthetic-input/.ai/specs/research/decisions/`. Short references below resolve inside `research/`; paths starting with `../../` resolve from this brief's directory. Checked 2026-10-26 and **not** in the repository: `.ai/specs/backlog.md`, `research/2026-09-14-source-provenance.md`, `research/2026-09-14-brief-refresh.md`, the 2026-09-14 walkthrough report, the price-policy specification, `decisions/Q03-support-export.md`, and records for D03–D06 (as the 2026-09-14 draft used those ids), D11–D20 and D23–D28. In `research/`, commit 4366dca overwrote two interviews: `2026-08-20-interview-working-dev.md` now duplicates the fintech record and `2026-09-02-interview-platform-dev-solves-alone.md` holds the working-dev text; the originals are cited from `../../devmentor-synthetic-input/.ai/specs/research/`. Five root-level files in `research/` (`D07-login.md`, `D21-finding-a-mentor.md`, `D22-session-timing.md`, `D27-session-channel.md`, `N01-no-video.md`) carry contents that do not match their names; cite only `decisions/` records. The GitHub tracker holds one issue (#3, local setup installer) and no backlog issues. The previous committed brief (2026-10-25, git `b53b314`) chose an unpaid manual experiment under its own R/A/Q/N ids; D30 supersedes that direction and its experiment-only rows lapse with it.

## Decision summary

**Decision.** DevMentor builds the full paid 1.0 session marketplace now (D30, D34), instead of first running one unpaid, hand-arranged session (D06, superseded). Founder B confirmed this on 2026-10-26 and reported founder A's agreement.

**Who has the problem.** Four mentee records describe a developer stuck on a specific technical problem: 40 minutes to an hour of search, contradictory community advice, then a workaround, a rollback or a solo fix. One of them solved it alone and would not have paid. Three mentor records describe answering unpaid questions selectively. One Discord shows 23 of 109 help threads with no human reply. See Problems and Target group. None of this shows that people will pay DevMentor.

**What 1.0 does.**
- **Mentors:** join by invitation (R07) and publish a profile, PLN prices within operator bounds (R08, R29) and slots bookable at least two hours ahead (R14).
- **Mentees:** find a mentor through a stack-filtered list or a share link (R13) and pay through Stripe (R05). Payment is final, with no refunds (R27). They hold the text session inside DevMentor (R20) and keep a private note they co-edit with the mentor and approve (R26).
- **Operator:** works through screens (R23), sets the fee (R28) and can resolve a dispute or a mentor no-show with a replacement session (R30).

**What changed in this refresh.**
- D30 supersedes D06. D36 supersedes D16's ship date, which is now set after the backlog is sized; the ten-paid-sessions-a-week target is kept. D37 replaces manual operator work with screens. D38 and D42 replace mentor-drafted notes with a co-edited note the mentee approves.
- Later the same day: D39 replaces free cancellation with no refunds at all; D40 has the operator set the fee with no default; D41 sets PLN with operator-set bounds and no price list yet; D27 (session inside DevMentor) is confirmed; D43 adds replacement sessions for disputes and mentor no-shows; D44 drops the sharing notice.
- The 2026-09-14 draft's decisions D02–D06 collided with existing records of the same ids. They are renumbered D31–D35, and its D01 is the existing D04.
- Many of the draft's "active" decisions had no record and were never confirmed. They became proposals; the fee, prices, session place and sharing rule have since been decided (above), while the risk checks (D17, D18), the beachhead (D24) and the vault decisions remain proposals.
- The draft's backlog references (#19, #25, `backlog.md`) do not exist and are removed.

**What could change the choice.**
- A02: no paid booking has happened, and who pays is mixed. Some developers would pay personally, some expect their employer to pay, and D02 assumes personal payment.
- A03: no mentor has been invited. The two listed prospects who were interviewed asked not to be on a shared list and to see the question before accepting; 1.0 does neither (Q27).
- A04: urgent cases want help inside an hour, while 1.0 offers slots two or more hours ahead.
- No refunds (D39): the freelancer asked for a same-day refund on a no-show. 1.0 offers a replacement session instead (R30), and nothing when the mentor cancels (R32). Whether buyers accept that is untested.

Building first means paid bookings after ship are the first real test. The week-four check that would act on them (D17) is still a proposal with no date.

**Next.** Plan the backlog for the full 1.0. Founder A writes the mentee and mentor terms before real payments (R33); they must state the no-refund policy, replacement sessions and mentor cancellation. The ship date (Q24) follows the sized backlog. Before taking real payments, someone must write and approve the mentee and mentor terms, including the no-refund policy (Q29, founder A by default). The ship date (Q24) is set once the backlog is sized.

## Vision

The founders intend developers to get specific technical help from a named mentor, with reusable mentor-owned knowledge as a later direction if A01 survives its test. This is intended benefit, not demonstrated uptake. `[DOCUMENT]` `2026-09-02-miro-board-vision-target-needs.md`, `decisions/D34-scope.md`

## Target group and stakeholders

- Customer (chosen): a mentee buys a 25/50-minute session and pays it personally before the session (D02, D03); payment runs through Stripe (D33/R05); the operator sets the platform fee (D40/R28); payment is final, with no refunds (D39/R27). `[DOCUMENT]` `decisions/D02.md`, `decisions/D03.md`, `decisions/D33-stripe-connect.md`, `decisions/D39-no-refunds.md`
- Who pays is mixed in the material: the platform engineer said "nie płacę za rzeczy do pracy sam" (I don't pay for work things myself), the fintech developer "sam bym zapłacił. chyba" (I'd pay myself. I think), and the freelancer pays alone. In the survey, 24 would pay personally, 19 said their employer would (13 if asked, 6 without asking), 2 their client and 9 nobody. D02 and D03 were recorded for the first test; extending them to 1.0 is a choice, not evidence. `[INTERVIEW]` `../../devmentor-synthetic-input/.ai/specs/research/2026-09-02-interview-platform-dev-solves-alone.md`, `2026-09-01-interview-backend-dev-fintech.md`; survey `2026-09-04-survey-discord-willingness-to-pay.md`
- Mentee situations in the supplied material: a product-company TypeScript blocker, a fintech infrastructure incident, a freelancer estimating React work, and a platform engineer who solved an agent issue alone. These are four records, not prevalence estimates; the last is contrary evidence for routine willingness to outsource. `[INTERVIEW]` `../../devmentor-synthetic-input/.ai/specs/research/2026-08-20-interview-working-dev.md`, `2026-09-01-interview-backend-dev-fintech.md`, `2026-09-02-interview-freelancer-react.md`, `../../devmentor-synthetic-input/.ai/specs/research/2026-09-02-interview-platform-dev-solves-alone.md`
- Mentor situations: side mentoring with reusable private notes; a Python meetup speaker answering recurring questions; a staff engineer who declined ongoing mentoring and prefers selective one-off help. Joining, rates and time commitment are not established by these accounts. `[INTERVIEW]` `2026-08-22-interview-mentor.md`, `2026-09-03-interview-senior-python-meetups.md`, `2026-09-03-interview-staff-engineer-declined-before.md`
- Mentor supply: invitation only, in batches of 20 (D08). The supplied prospect list has 50 entries, all marked uncontacted at export (two of them were interviewed on 2026-09-03); 29 have a warm contact; public work was found for 33, partly for 6, not checked for 11. A list is not accepted supply. `[DATA]` `2026-09-04-mentor-list.csv`, provenance `2026-09-04-mentor-list-note.md`
- Scope decider: founder A (Oliwia). Operator: both founders under the D19 proposal, working through 1.0 screens (D37). The supplied RACI assigns founder A sponsor/product/UX roles and founder B project/technical/development roles; QA and legal are unstaffed there. It does not waive repository QA requirements or establish legal approval. `[DOCUMENT]` `2026-08-26-workshop-export.md`, `2026-09-05-miro-board-raci-matrix.md`, `decisions/D37-operator-screens.md`

## Problems, with evidence

- The first developer record describes a TypeScript release blocker, 40 minutes of search, contradictory Discord answers and a workaround still considered uncertain. The fintech record describes an ingress upgrade, unsuccessful search/help and rollback. Each is a reported incident; frequency and cost across the segment are unknown. `[INTERVIEW]` `../../devmentor-synthetic-input/.ai/specs/research/2026-08-20-interview-working-dev.md`, `2026-09-01-interview-backend-dev-fintech.md`
- The freelancer wants a same-day refund when the other side does not show up ("jak nie przyjdzie to zwrot tego samego dnia a nie jakis ticket"). `[INTERVIEW]` `2026-09-02-interview-freelancer-react.md`
- The freelancer record describes two evenings researching an estimate, an unhelpful community reply and underestimation said to cost about a week of personal time. It distinguishes talking through estimates from text for bugs; text-only is therefore a product constraint, not a universal preference. `[INTERVIEW]` `2026-09-02-interview-freelancer-react.md`
- The platform engineer reports solving a lint/agent problem alone in half a day, having internal help and not wanting to pay for that case. This limits the claim that every blocker needs a paid mentor. `[INTERVIEW]` `../../devmentor-synthetic-input/.ai/specs/research/2026-09-02-interview-platform-dev-solves-alone.md`
- Mentor records describe recurring unpaid questions and private paste documents; the staff engineer instead stresses control of time, questions and audience. Their conditions for joining are statements, not commitments: the staff engineer said "nie wsadzajcie mnie na listę obok ludzi, których nie znam" (don't put me on a list next to people I don't know), and both listed prospects want to see the question before accepting. `[INTERVIEW]` `2026-08-22-interview-mentor.md`, `2026-09-03-interview-senior-python-meetups.md`, `2026-09-03-interview-staff-engineer-declined-before.md`
- The Discord CSV holds 109 help threads from 2026-08-18 to 2026-08-31: 23 have no human reply; the median first-reply wait among the 86 answered threads is 67 minutes; 31 got a reply within 30 minutes; 31 carry an urgency signal. Resolution labels: 35 yes, 20 partial, 45 no, 9 unknown. Recalculated from the rows on 2026-10-26; the reading aid's 68-minute median is superseded. One moderator assigned topic and resolution labels, and a first reply is not a solution. `[DATA]` `2026-09-04-discord-help-requests.csv`, `2026-09-04-data-request-discord-help.md`
- The survey aggregates 54 self-selected responses from that Discord: 37 choose a nonzero hypothetical price for text help within an hour; 3 report paying someone the last time they were stuck; 33 prefer text, 9 a call, 12 say it depends. This is reported behaviour and stated preference for another proposition (within an hour, EUR), not DevMentor conversion. No respondent-level cross-tab is supplied, so the reading aid's employed/payment split is not used. `[DATA]` `2026-09-04-survey-discord-willingness-to-pay.md`
- An earlier support export is excluded from usage claims; the 2026-09-14 draft calls it test data, but that record is not in the repository.

## Product and how it stands out

- What it is: a session marketplace for paid, scheduled 25/50-minute text help with a named, invited mentor, ending in a private written result (D34; Scope). `[DOCUMENT]` `decisions/D34-scope.md`, `decisions/D04.md`
- The intended distinction is a bounded text consultation, public-work evidence instead of ratings, and a written result (N01, N02, D38). Whether that is enough to switch from existing help is A02/A03, not a benchmark finding. `[DOCUMENT]` `decisions/N01-no-video.md`, `decisions/N02-no-ratings.md`

The rows summarize supplied benchmark notes dated 2026-09-04; sites were not rechecked in this refresh. An absent feature on the checked page is not proof the service lacks it.

| reference | what it does well | where it falls short for our users | checked on | link |
|---|---|---|---|---|
| Codementor | Recorded as offering one-off developer help. `[BENCHMARK]` `2026-09-04-benchmark-codementor.md` | Supplied interview describes one slow search/call difficulty; not a service-wide finding. | 2026-09-04, supplied note | https://www.codementor.io/ |
| MentorCruise | Recorded as ongoing mentor relationships. `[BENCHMARK]` `2026-09-04-benchmark-mentorcruise.md` | Ongoing commitment mismatches the staff engineer's stated preference for one-off help. | 2026-09-04, supplied note | https://mentorcruise.com/ |
| ADPList | Recorded as free mentorship booking. `[BENCHMARK]` `2026-09-04-benchmark-adplist.md` | Mentor earnings were not established by the pages described in the note. | 2026-09-04, supplied note | https://adplist.org/ |
| Topmate | Recorded as an expert selling through a personal link and marketplace. `[BENCHMARK]` `2026-09-04-benchmark-topmate.md` | General expert services rather than only developer help; no claim that marketplace discovery is absent. | 2026-09-04, supplied note | https://topmate.io/ |
| Preply | Recorded as a useful booking/cancellation reference. `[BENCHMARK]` `2026-09-04-benchmark-preply.md` | Language tutoring is an adjacent flow, not evidence of coding-help demand. | 2026-09-04, supplied note | https://preply.com/en/how-it-works |

## Goals and success criteria

- Business goal: ten paid sessions a week for two consecutive weeks within 61 days of ship; the ship date is set after the backlog is sized (D36). A provisional target chosen by the founders, not a measurement. `[DOCUMENT]` `decisions/D36-ship-date-and-target.md`
- Baseline: no DevMentor booking or payment has been measured; baseline unknown.
- User outcome: the mentee gets an answer to the booked question and keeps the written result; the mentor offers bounded paid help. Whether that arrives in time is A04. `[DOCUMENT]` `decisions/D34-scope.md`, `decisions/D22-session-timing.md`
- Measurements: paid sessions per week (D36); booking-to-start time for every booking (R15). The week-four check (D17), the first-batch supply check (D18) and the non-booker interviews (Q20) are proposals or open.
- Later vault target: D35 (100 published mentor vaults within twelve months) is a proposal and not a 1.0 exit criterion.
- What must not get worse: publication only with mentee approval (R02), stated prices (R08), Stripe as the single payment and payout provider (R05), and no promise of urgent timing (R14).

## Scope

- **Now, full 1.0 (D30, D34; confirmed as "accounts, invited mentor profiles, list/filter and share link, booking with payment, text session, private note, operator support"):**
  - accounts and role access (R06);
  - invited mentors (R07) with public-work profiles (R04), stack tags (R13), prices within bounds (R08) and published slots (R14);
  - finding a mentor by list/filter or share link (R13);
  - choosing a 25/50-minute slot (R01), booking and payment (R05);
  - notifications, cancellation without refunds (R27), the operator-set platform fee (R28) and Connect payouts (R05);
  - the text session inside DevMentor (R03, R20) and the written answer;
  - the co-edited private session note, final after the mentee approves it (R26);
  - operator screens for invitations, price bounds in PLN (R29), fee (R28) and disputes with replacement sessions (R23, R30);
  - booking-to-start measurement (R15).
- **Historical first iteration:** the 2026-09-14 draft named a 25-hour first-iteration budget (D32) and a fourteen-story cut (D13). Neither has a record, the story list is not in the repository, and D36 now sets the date from the sized backlog. Both are proposals and history only.
- **Later:** vault publication, vault subscriptions, single-note purchase, MCP, team plans, async Q&A, transcription and AI note drafting (D34). Vault work waits for the A01 interviews and D14 (proposal).
- **Not doing:** N01 and N02; 1.0 also has no sharing notice, ownership verification, NDA flow or employer approval (D44, R31).

## Domain glossary

| Term | Meaning | Owned by | Visible to |
|---|---|---|---|
| Session | Paid 25/50-minute text exchange inside DevMentor (R01, R03, R20). | mentor offers it; both parties participate | parties and the operator |
| Written answer | Session result delivered by the mentor. | mentor | mentor and mentee |
| Session note | One private note mentor and mentee co-edit after a session; final after the mentee approves it (R26). | both parties | both parties |
| Bookable mentor | Invited mentor with a profile, prices and at least one published slot; Connect onboarding is complete before the first payout (R05). | mentor; operator invites | public mentor page |
| Slot | An offered start time; bookable only at least two hours ahead (R14). | mentor | mentees browsing availability |
| Operator | Founders administering invitations, price bounds, fee and disputes through 1.0 screens (D37). | both founders (D19 proposal) | internal |
| Price / platform fee | Mentor's own PLN price within operator-set bounds (R08, R29) / platform share set by the operator (R28). | mentor / operator | relevant parties |
| Vault / MCP | Later publishing/subscription and coding-agent access, conditional on A01 and D14. | mentor | later subscribers |

## Key flows

- Current developer workaround: search, ask a colleague or community, then get help, ship a workaround, delay, or solve alone. Outcomes differ by interview; no single combined story is presented as one participant's experience. `[INTERVIEW]` the four mentee records in Problems
- Current mentor workaround: reply selectively in DMs/Slack/Discord, often from a private document; three records describe different motivations. `[INTERVIEW]` the three mentor records in Problems
- Future mentor onboarding (decided steps): operator invites through a screen (R07, R23) → mentor signs in (R06) → public-work profile and stack tags (R04, R13) → prices within bounds once the operator has set them (R08, R29) → published slots (R14) → visible in the list and through a share link (R13); Connect onboarding before the first payout (R05). The order of Connect relative to publishing is a spec detail. `[DOCUMENT]` `decisions/D08-invite-only.md`, `decisions/D09-pricing.md`, `decisions/D21-finding-a-mentor.md`, `decisions/D22-session-timing.md`, `decisions/D33-stripe-connect.md`, `decisions/D37-operator-screens.md`
- Future booking and delivery: mentee finds a mentor (R13) → chooses duration and a slot at least two hours ahead (R01, R14) → sees the price and the no-refund terms (R08, R27) → pays through Stripe Checkout once the operator has set a fee (R05, R28) → gets a confirmation → holds the text session inside DevMentor (R03, R20) → gets the written answer → co-edits the note, which the mentee approves (R26). No sharing notice is shown (R31). `[DOCUMENT]` `decisions/D03.md`, `decisions/D39-no-refunds.md`, `decisions/D33-stripe-connect.md`, `decisions/D42-mentee-approves-note.md`
- Future payment and support branch: a failed payment must not create a paid booking; cancellation follows R27 (no refunds); the operator resolves quality disputes through screens (R23), and can grant a free replacement session whose payout goes to the replacement mentor (R30); fee and payout follow R28 and R05. Payment states and failure handling belong in the covering spec. `[DOCUMENT]` `decisions/D39-no-refunds.md`, `decisions/D37-operator-screens.md`
- Future measurement: count paid sessions per week and booking-to-start time (D36, R15); non-booker recruitment waits for Q20. `[DOCUMENT]` `decisions/D36-ship-date-and-target.md`, `decisions/D22-session-timing.md`

## Business rules

| Id | Rule | Applies to | Source | Status | Review by | Required path to change | Owner | Supersedes |
|---|---|---|---|---|---|---|---|---|
| R01 | A session is 25 or 50 minutes, "bookable in a lunch break". | every session | `[DOCUMENT]` `decisions/D04.md`, `2026-08-26-workshop-export.md` | active | after the paid test (D04) | a superseding record by founder A | founder A (Oliwia) | none |
| R02 | Nothing from a session is published without the mentee's approval. | every session, note, and later vault | `[DOCUMENT]` `2026-08-26-workshop-export.md` (D31) | active | before publication | a superseding record by both founders | founder A (Oliwia) with founder B (Maciej) | none |
| R03 | Sessions are text; the product says so on every session screen. | every session screen | `[DOCUMENT]` `decisions/N01-no-video.md` | active | if reopened | a superseding record by founder A | founder A (Oliwia) | none |
| R04 | No ratings or reviews; every mentor page carries a link to public work and a plain description. | mentor pages | `[DOCUMENT]` `decisions/N02-no-ratings.md` | active | if reopened | a superseding record by founder A | founder A (Oliwia) | none |
| R05 | Stripe is the only payment provider: Stripe Checkout for sessions, Stripe Connect for payouts; a mentor completes Connect onboarding before the first payout. | payments, payouts | `[DOCUMENT]` `decisions/D33-stripe-connect.md` | active | a country Stripe does not serve | a superseding record by founder A | founder A (Oliwia) | none |
| R06 | Sign-in with GitHub for every role; email plus password as the fallback. | accounts | `[DOCUMENT]` `../../devmentor-synthetic-input/.ai/specs/research/decisions/D07-login.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) | none |
| R07 | Mentors join by invitation only in 1.0; there is no open registration. | mentor accounts | `[DOCUMENT]` `decisions/D08-invite-only.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) | none |
| R08 | Each mentor sets their own 25- and 50-minute prices within operator-set bounds. | mentor pricing | `[DOCUMENT]` `decisions/D09-pricing.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) | none |
| R09 | Free cancellation up to 24 hours before a session; later cancellations forfeit the fee; quality disputes are resolved by the operator; no automatic refunds in 1.0. | bookings, disputes | `[DOCUMENT]` `decisions/D10-cancellation.md` | superseded by R27 | — | — | founder A (Oliwia) | none |
| R10 | The platform fee is 20% of a session, configurable by the operator; the vault fee is set when the vault returns to scope. | every session | `[ASSUMPTION]` D11 in the 2026-09-14 draft, no record | superseded by R28 | — | — | founder A (Oliwia) | none |
| R11 | A vault answer always cites the mentor and the note it came from. | vault answers, MCP (later scope) | `[ASSUMPTION]` D15 in the 2026-09-14 draft, no record | proposal | when the vault returns to scope | founder B confirms or changes | founder B (Maciej), pending | none |
| R12 | The mentor drafts the session note; the mentee approves it in full or declines it with a comment; the mentor redrafts; no co-editing in 1.0. | every session note | `[DOCUMENT]` superseded by `decisions/D38-co-edited-note.md` | superseded by R22, now R26 | — | — | founder A (Oliwia) | none |
| R13 | A mentee finds a mentor through the list filtered by stack tag (TypeScript, React, Python, AI agents) or through the mentor's share link; the list is ordered by most recent published availability, never by a score; no search and no ranking in 1.0. | the mentor list, mentor pages | `[DOCUMENT]` `decisions/D21-finding-a-mentor.md` | active | more than 30 published mentors, or mentees unable to find a fit | a superseding record by founder A | founder A (Oliwia) | none |
| R14 | A slot can be booked only when it starts at least two hours after the booking; 1.0 copy makes no promise of speed. | booking, every screen that describes sessions | `[DOCUMENT]` `decisions/D22-session-timing.md` | active | median booking-to-start above 48 hours in the first four weeks | a superseding record by founder A | founder A (Oliwia) | none |
| R15 | The product records the time from booking to session start for every booking. | every booking | `[DOCUMENT]` `decisions/D22-session-timing.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) | none |
| R16 | Invitations and stack tags in 1.0 come only from the beachhead pool: English-speaking TypeScript, React, Python and AI-agent developers. | invitations, stack tags | `[ASSUMPTION]` D24 in the 2026-09-14 draft, no record | proposal | Q25 | founder A confirms or changes | founder A (Oliwia), pending | none |
| R17 | Invitations go out in batches of 20; each asks the mentor to publish at least one bookable session within two weeks of accepting. | invitations | `[DOCUMENT]` `decisions/D08-invite-only.md` | superseded by R24 and R25 | — | — | founder A (Oliwia) with founder B (Maciej) | none |
| R18 | An operator action that has no story in the current iteration is done by hand by the founders and logged in the shared operator note. | operator actions | `[DOCUMENT]` superseded by `decisions/D37-operator-screens.md` | superseded by R23 | — | — | founder A (Oliwia) with founder B (Maciej) | none |
| R19 | Booking confirmation and the session screen say: "Paste only what you are allowed to share. DevMentor does not check who owns it." No NDA, employer approval or code filtering in 1.0. | booking confirmation and session content | `[ASSUMPTION]` D26 in the 2026-09-14 draft, no record | superseded by R31 | — | — | founder A (Oliwia) | none |
| R20 | The text exchange stays in a session screen inside DevMentor; a mentor cannot move the 1.0 session to their own channel. | text session | `[DOCUMENT]` `decisions/D27-session-channel.md` | active | invited mentors refusing to type in a browser | a superseding record by founder A | founder A (Oliwia) | none |
| R21 | Platform currency is PLN. Initial inclusive bounds are PLN 90 to 600 for 25 minutes and PLN 180 to 1,200 for 50 minutes. | mentor prices and booking price display | `[ASSUMPTION]` D28 in the 2026-09-14 draft, no record | superseded by R29 | — | — | founder A (Oliwia) | none |
| R22 | Mentor and mentee edit one shared session note; it stays private between them (D34); publication still needs the mentee's approval (R02). | every session note | `[DOCUMENT]` `decisions/D38-co-edited-note.md`, `decisions/D34-scope.md` | superseded by R26 | — | — | founder A (Oliwia) with founder B (Maciej) | R12 |
| R23 | The operator works through 1.0 screens for invitations, price bounds, the platform fee and disputes. | operator actions | `[DOCUMENT]` `decisions/D37-operator-screens.md` | active | unknown | a superseding record by both founders | founder A (Oliwia) with founder B (Maciej) | R18 |
| R24 | Invitations go out in batches of 20. | invitations | `[DOCUMENT]` `decisions/D08-invite-only.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) with founder B (Maciej) | R17 (batch size) |
| R25 | Each invitation asks the mentor to publish at least one bookable session within two weeks of accepting. | invitations | `[ASSUMPTION]` D18 in the 2026-09-14 draft, no record | proposal | Q25 | both founders confirm | both founders, pending | R17 (two-week ask) |
| R26 | Mentor and mentee edit one shared session note; it counts as final only after the mentee approves it; it stays private between them; publication still needs the mentee's approval (R02). | every session note | `[DOCUMENT]` `decisions/D42-mentee-approves-note.md`, `decisions/D38-co-edited-note.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) with founder B (Maciej) | R22 |
| R27 | Payment is final: no refunds in 1.0 for any cancellation or no-show; any cancellation forfeits the fee; the operator resolves quality disputes (a resolution can be a replacement session, R30). | bookings, cancellations, disputes | `[DOCUMENT]` `decisions/D39-no-refunds.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) with founder B (Maciej) | R09 |
| R28 | The operator sets one platform fee in the admin screen and can change it at any time; no default is decided; payments cannot be taken until the operator has set a fee. | every session | `[DOCUMENT]` `decisions/D40-operator-fee.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) with founder B (Maciej) | R10 |
| R29 | Platform currency is PLN. The operator sets the price bounds through the 1.0 screens; no initial bounds are decided. | mentor prices and booking price display | `[DOCUMENT]` `decisions/D41-pln-operator-bounds.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) with founder B (Maciej) | R21 |
| R30 | For a quality dispute or a mentor no-show, the operator can grant the mentee a replacement session (same or another mentor) without a new payment; the original mentor is not paid and the replacement mentor receives the payout from the original payment; payouts therefore wait until a session is delivered or a dispute window has passed (window length is a spec detail). | disputes, no-shows, payouts | `[DOCUMENT]` `decisions/D43-replacement-session.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) with founder B (Maciej) | none |
| R31 | 1.0 shows no notice about what may be shared and checks nothing: no NDA, ownership verification, employer approval or code filtering. | booking confirmation and session content | `[DOCUMENT]` `decisions/D44-no-sharing-notice.md` | active | an ownership dispute or a team-plan proposal | a superseding record by founder A | founder A (Oliwia) with founder B (Maciej) | R19 |
| R32 | When a mentor cancels a booked session, the mentee loses the payment; the cancelling mentor gets no payout and the platform keeps the payment. | mentor cancellations, payouts | `[DOCUMENT]` `decisions/D45-mentor-cancellation.md` | active | later; no trigger set | a superseding record by founder A | founder A (Oliwia) with founder B (Maciej) | none |
| R33 | No real payment is taken before founder A has approved the mentee and mentor terms. | payments | `[DOCUMENT]` `decisions/D46-terms-owner.md` | active | unknown | a superseding record by founder A | founder A (Oliwia) | none |

## Non-goals

| Id | We are not building | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|
| N01 | Video calls. | The workshop constraint said no video and the mentee said "text is fine, faster"; sessions are text. | founder A (Oliwia) | active | if reopened | a superseding record approved by founder A | `[DOCUMENT]` `decisions/N01-no-video.md` | none |
| N02 | A ratings or reviews profile. | The source chooses public work and a plain description. | founder A (Oliwia) | active | if reopened | a superseding record approved by founder A | `[DOCUMENT]` `decisions/N02-no-ratings.md` | none |

## Decisions

| Id | Date | Decision | Why | Owner | Status | Review by | Required path to change | Source | Supersedes |
|---|---|---|---|---|---|---|---|---|---|
| D01 | 2026-10-24 | Focus the MVP on paid text help. | Chosen direction; demand unproven. Its recorded consequence (validate purchase and mentor delivery before planning a self-service product) conflicts with D30 (Q28). | founder A (Oliwia), as Product owner | active | before expansion | Product Owner approval | `[DOCUMENT]` `decisions/D01.md` | none |
| D02 | 2026-10-24 | The developer pays personally. | Test model, not observed willingness. | founder A (Oliwia), as Product owner | active | after purchase | Product Owner approval | `[DOCUMENT]` `decisions/D02.md` | none |
| D03 | 2026-10-24 | Prepay each session. | Price and flow were open. | founder A (Oliwia), as Product owner | active | after the paid test | Product Owner approval | `[DOCUMENT]` `decisions/D03.md` | none |
| D04 | 2026-10-24 | Sessions are 25 or 50 minutes (R01). The 2026-09-14 draft listed the same choice as D01 from the 2026-08-26 workshop. | "Bookable in a lunch break." | founder A (Oliwia), as Product owner | active | after the paid test | Product Owner approval | `[DOCUMENT]` `decisions/D04.md`, `2026-08-26-workshop-export.md` | none |
| D05 | 2026-10-24 | Cap the first manual paid experiment at 25 work hours. | Bound learning. | founder A (Oliwia), as Product owner | superseded | — | — | `[DOCUMENT]` `decisions/D05.md` | none; superseded by D06 |
| D06 | 2026-10-25 | Run a manual, unpaid text-help experiment before price or prepayment. | Learn whether a mentor participates before payment. | founder A (Oliwia), as Product owner | superseded | — | — | `[DOCUMENT]` `decisions/D06.md` | D05; superseded by D30 |
| D07 | 2026-09-03 | Sign-in with GitHub for every role, email plus password as the fallback (R06). | Mentees are developers; the mentor said "my GitHub is my profile". | founder A (Oliwia) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `../../devmentor-synthetic-input/.ai/specs/research/decisions/D07-login.md` | none |
| D08 | 2026-09-03; confirmed 2026-10-26 | Mentors join by invitation in 1.0, in batches of 20 (R07, R24). | The channel plan: hand-picked seniors. Confirmed as written. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D08-invite-only.md` | none |
| D09 | 2026-09-03; confirmed 2026-10-26 | Each mentor sets their own 25- and 50-minute prices within operator bounds (R08). | The mentor asked for control over price; bounds protect the marketplace. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D09-pricing.md` | none |
| D10 | 2026-09-03; confirmed 2026-10-26 | Free cancellation up to 24 hours before; later cancellation forfeits the fee; operator resolves disputes; no automatic refunds (R09). | No reason recorded. | founder A (Oliwia) with founder B (Maciej) | superseded | — | — | `[DOCUMENT]` `decisions/D10-cancellation.md` | none; superseded by D39 |
| D11 | 2026-09-03 | Platform fee 20% of a session (R10). | Board revenue streams gave 15–20%. | founder A (Oliwia) | superseded | — | — | `[ASSUMPTION]` 2026-09-14 draft; no record | none; superseded by D40 |
| D12 | 2026-09-03 | A01 accepted untested for 1.0; everything resting on it is later. | Nothing in 1.0 depends on it. | both founders, pending | proposal | Q25 | both founders confirm | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D13 | 2026-09-03 | The first iteration is 14 listed stories; the rest of 1.0 is 1.1. | 25 hours (D32). | founder A (Oliwia), pending | proposal | Q25 | founder A confirms or drops | `[ASSUMPTION]` 2026-09-14 draft; no record; the story list is not in the repository | none |
| D14 | 2026-09-03 | If fewer than 3 of 10 interviewed developers would pay for a named mentor's notes, the vault is dropped. | Kill criterion for the vault. | both founders, pending | proposal | Q25 | both founders confirm | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D15 | 2026-09-03 | A vault answer always cites the mentor and the note (R11). | The mentor's condition "I keep my name on them". | founder B (Maciej), pending | proposal | when the vault returns | founder B confirms | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D16 | 2026-09-03 | Ship 2026-10-31; ten paid sessions a week for two weeks by 2026-12-31; week-four check. | Agent recommendation. | founder A (Oliwia) | superseded | — | — | `[ASSUMPTION]` 2026-09-14 draft; no record | none; superseded by D36 |
| D17 | 2026-09-03 | A02 accepted untested for 1.0, with a check four weeks after ship: fewer than 3 paid sessions that week stops feature work and opens non-booker interviews. | Agent recommendation; a paid booking is a stronger signal than an intention. | both founders, pending | proposal | Q25 | both founders confirm | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D18 | 2026-09-03 | A03 accepted for 1.0, checked at invitation: fewer than 5 of the first 20 publishing within two weeks stops invitations. | Agent recommendation. Batches of 20 are confirmed in D08. | both founders, pending | proposal | Q25 | both founders confirm | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D19 | 2026-09-03 | The operator is the two founders; operator work without a story is done by hand and logged. | Agent recommendation. | both founders | superseded by D37 for manual work; founders as operator remains a proposal | Q25 | both founders confirm | `[ASSUMPTION]` 2026-09-14 draft; no record | none; partly superseded by D37 |
| D20 | 2026-09-03 | The mentor drafts the note; the mentee approves or declines; no co-editing. | Agent recommendation. | founder A (Oliwia) | superseded | — | — | `[ASSUMPTION]` 2026-09-14 draft; no record | none; superseded by D38 |
| D21 | 2026-09-03; confirmed 2026-10-26 | Mentees find mentors through a stack-filtered list or a share link; no search, no ranking (R13). | Agent recommendation, confirmed as written; mentors bring their own audience; N02 forbids scores. | founder A (Oliwia) with founder B (Maciej) | active | more than 30 published mentors | a superseding record by founder A | `[DOCUMENT]` `decisions/D21-finding-a-mentor.md` | none |
| D22 | 2026-09-03; confirmed 2026-10-26 | Slots bookable at least two hours ahead; no speed promise; booking-to-start recorded (R14, R15). | Agent recommendation, confirmed as written; invited seniors cannot promise "within the hour". | founder A (Oliwia) with founder B (Maciej) | active | median booking-to-start above 48 hours in the first four weeks | a superseding record by founder A | `[DOCUMENT]` `decisions/D22-session-timing.md` | none |
| D23 | 2026-09-03 | Undated decisions and rules are reviewed at the 1.0 retrospective, four weeks after ship. | Agent recommendation; the 2026-11-28 date assumed the old ship date. | founder A (Oliwia), pending | proposal | Q25 | founder A confirms | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D24 | 2026-09-03 | Beachhead: English-speaking TypeScript, React, Python and AI-agent developers (R16). | Agent recommendation; the board names the beachhead. | founder A (Oliwia), pending | proposal | Q25 | founder A confirms | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D25 | 2026-09-03 | Founder B runs the ten A01 interviews; readout applies D14. | Agent recommendation. | both founders, pending | proposal | Q25 | both founders confirm | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D26 | 2026-09-04 | Adopt R19: the mentee shares only material they may share; 1.0 does not check ownership. | Weighed an NDA, employer approval, a visible rule and silence. | founder A (Oliwia) | superseded | — | — | `[ASSUMPTION]` 2026-09-14 draft; no record | none; superseded by D44 |
| D27 | 2026-09-04; confirmed 2026-10-26 | Adopt R20: the 1.0 text session happens inside DevMentor. | Agent recommendation, confirmed as written: disputes and the note need the exchange where the product can see it. | founder A (Oliwia) with founder B (Maciej) | active | invited mentors refusing to type in a browser | a superseding record by founder A | `[DOCUMENT]` `decisions/D27-session-channel.md` | none |
| D28 | 2026-09-10 | Adopt R21: PLN; bounds PLN 90–600 (25 min) and PLN 180–1,200 (50 min). | The draft cites a price specification approved 2026-09-10 that is not in the repository. | founder A (Oliwia) | superseded | — | — | `[ASSUMPTION]` 2026-09-14 draft; no record | none; superseded by D41 |
| D29 | 2026-09-14 | Proposed: include Connect, fee allocation and payouts in the first working release. | Moot while D30/D34 build the full marketplace; reopens only if a shortened paid release is proposed. | both founders, pending | proposal | if a shortened release is proposed | both founders confirm | `[ASSUMPTION]` 2026-09-14 draft | none |
| D30 | 2026-10-26 | Build the full paid 1.0 session marketplace now. | Chosen over keeping the unpaid experiment first or running it in parallel; no further reason given. | founder A (Oliwia) with founder B (Maciej) | active | the post-ship paid-session check (D36) | a superseding record by founder A | `[DOCUMENT]` `decisions/D30-full-marketplace-now.md` | D06 |
| D31 | 2026-08-26 | Nothing from a session is published without the mentee's approval (R02). Listed as D02 in the 2026-09-14 draft. | "Trust is the product." | both founders | active | before publication | a superseding record by both founders | `[DOCUMENT]` `2026-08-26-workshop-export.md` | none |
| D32 | 2026-09-03 | 25 hours is the budget of the first iteration, not of the MVP. Listed as D03 in the 2026-09-14 draft. | The workshop's 25 hours could not hold the whole 1.0. | founder A (Oliwia), pending | proposal | Q25 | founder A confirms or drops | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D33 | 2026-09-03; confirmed 2026-10-26 | Stripe is the only payment provider, with Connect for payouts (R05). Listed as D04 in the 2026-09-14 draft. | One provider end to end. | founder A (Oliwia) with founder B (Maciej) | active | a country Stripe does not serve | a superseding record by founder A | `[DOCUMENT]` `decisions/D33-stripe-connect.md` | none |
| D34 | 2026-09-03; confirmed 2026-10-26 | 1.0 is the session marketplace; vault, subscriptions, MCP, team plans and async Q&A are later. Listed as D05 in the 2026-09-14 draft. | Chosen over a smaller first release or leaving scope open. | founder A (Oliwia) with founder B (Maciej) | active | the A01 interview readout | a superseding record by founder A | `[DOCUMENT]` `decisions/D34-scope.md` | none |
| D35 | 2026-09-03 | 100 mentors with a published vault within 12 months of 1.0; subscription share set after A01's test. Listed as D06 in the 2026-09-14 draft. | Vault is later. | founder A (Oliwia), pending | proposal | Q25 | founder A confirms | `[ASSUMPTION]` 2026-09-14 draft; no record | none |
| D36 | 2026-10-26 | Ship date set after the backlog is sized; keep ten paid sessions a week for two consecutive weeks, within 61 days of ship. | Chosen over keeping 2026-10-31 or leaving both open; no marketplace code existed. | founder A (Oliwia) with founder B (Maciej) | active | when the backlog is sized | a superseding record by founder A | `[DOCUMENT]` `decisions/D36-ship-date-and-target.md` | D16 |
| D37 | 2026-10-26 | The operator gets 1.0 screens for invitations, price bounds, fee and disputes (R23). | Chosen over one founder operating by hand. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by both founders | `[DOCUMENT]` `decisions/D37-operator-screens.md` | D19 (manual work) |
| D38 | 2026-10-26 | Mentor and mentee co-edit one session note (R22, now R26). | Chosen over no note in 1.0 or a mentee-written note. | founder A (Oliwia) with founder B (Maciej) | active; completed by D42 | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D38-co-edited-note.md` | D20 |
| D39 | 2026-10-26 | No refunds in 1.0: payment is final; any cancellation or no-show forfeits the fee (R27). | Chosen over refunding cancellations made more than 24 hours ahead, or manual refunds by the operator; no further reason given. The freelancer interview asked for a same-day refund on a no-show. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D39-no-refunds.md` | D10 |
| D40 | 2026-10-26 | The operator sets the platform fee; no default is decided (R28). | Chosen over a per-mentor fee or a 20% starting value. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D40-operator-fee.md` | D11 |
| D41 | 2026-10-26 | Currency is PLN; price bounds are not decided now and are set by the operator (R29). | No price list or initial bounds are decided now; mentors cannot set prices until the operator has set bounds. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D41-pln-operator-bounds.md` | D28 |
| D42 | 2026-10-26 | The mentee approves the final version of the co-edited note (R26). | Answers Q23. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D42-mentee-approves-note.md` | none; completes D38 |
| D43 | 2026-10-26 | A quality dispute or mentor no-show can be resolved with a free replacement session; the payout moves to the replacement mentor (R30). | Chosen over only recording the dispute or refunding in disputes; for the payout, over operator choice per case or the platform paying. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D43-replacement-session.md` | none |
| D44 | 2026-10-26 | No sharing notice and no checks in 1.0 (R31). | Chosen over the proposed notice or leaving it open; the user terms (Q29) can cover sharing. | founder A (Oliwia) with founder B (Maciej) | active | an ownership dispute or team plans | a superseding record by founder A | `[DOCUMENT]` `decisions/D44-no-sharing-notice.md` | D26 |
| D45 | 2026-10-26 | When a mentor cancels, the mentee loses the payment and the platform keeps it (R32). | Chosen "for now" over a replacement session; for the money, over paying the mentor or operator choice. | founder A (Oliwia) with founder B (Maciej) | active | later; no trigger set | a superseding record by founder A | `[DOCUMENT]` `decisions/D45-mentor-cancellation.md` | none |
| D46 | 2026-10-26 | Founder A writes and approves the mentee and mentor terms; no real payment before approval (R33). | RACI default; chosen over adding an external lawyer or founder B. | founder A (Oliwia) with founder B (Maciej) | active | unknown | a superseding record by founder A | `[DOCUMENT]` `decisions/D46-terms-owner.md` | none |

Decisions confirmed on 2026-10-26 were confirmed by founder B, who reported founder A's agreement; founder A did not take part in the session and can supersede them.

## Riskiest assumptions

| Id | Assumption | Importance | Evidence today | If false | Smallest test | Owner | By when | Result |
|---|---|---|---|---|---|---|---|---|
| A01 | Mentees pay a recurring subscription for a named mentor's vault. `[ASSUMPTION]` original board vision | high for vault; low for session-only 1.0 | Interviews describe interest in immediate help and several objections to subscriptions; no vault purchase. | Drop the vault (D14, proposal). | Ten developer interviews (D25, proposal); a positive answer is a stated intention, not recurring payment. | founder B (Maciej), proposed | unknown | untested; acceptance (D12) is a proposal |
| A02 | Developers with a blocker pay for a scheduled 25/50-minute text session. `[ASSUMPTION]` original marketplace proposition | high | Four mentee records and the Discord export show specific help-seeking. Survey answers are hypothetical (within an hour, EUR); three respondents report paying someone the last time. No DevMentor transaction exists. | The session marketplace lacks paid demand. | Actual paid bookings after ship (D36); the week-four check (D17) and non-booker interviews (Q20) are proposals. | both founders | ship + 4 weeks; ship date open | untested; D30 builds before testing it |
| A03 | Invited mentors publish bookable text sessions before a vault exists. `[ASSUMPTION]` invitation plan | high | Three mentor records show repeated unpaid questions. The Python mentor states a twenty-minute setup limit and refuses bank details before a first booking; the staff engineer wants a personal link and rejects a shared list. Stated conditions, not commitments. The CSV marks all 50 prospects uncontacted at export (2026-09-04), although two listed prospects were interviewed on 2026-09-03; no mentor has been invited. | Invitations do not produce bookable supply. | First batch of 20 (D08): record acceptance, publication and objections (list, setup, bank-details timing); the five-of-twenty stop rule is the D18 proposal. | both founders | two weeks after the first batch accepts; date unknown | untested; D30 builds before testing it |
| A04 | A session booked at least two hours ahead arrives soon enough. `[ASSUMPTION]` D22 timing choice | high | Mentee records ask for twenty minutes, within an hour or the same day depending on the job. Discord median first reply is 67 minutes among answered threads; a reply is not a resolution. | Scheduled help fails urgent incidents even if it serves planned work. | Booking-to-start for every booking (R15); a median above 48 hours advances instant availability (D22). Ask separately whether the help came in time. | founder A (Oliwia), D22 | first four weeks after ship | untested |
| A05 | Working developers and freelancers have the expected relative demand and problem mix. `[ASSUMPTION]` original segmentation | medium | The Discord export labels 37 employed, 21 freelance, 10 student and 41 unknown asker contexts across threads in one community; not unique people or market proportions. | Acquisition targets the wrong situations or channels. | Segment actual invitations, bookings and non-booker interviews. | founder A (Oliwia) | unknown | partially informed |
| A06 | Mentees find a session note useful enough to keep and use. `[ASSUMPTION]` note proposition | medium | D38 defines co-editing; mentor records state conditions; one mentee record prefers their own runbook. No note data exists. | Note uptake is low and later publishing has little material. | Record whether notes are edited, kept and reopened after real sessions; ask what was useful. | not assigned | unknown | untested |
| A07 | English-speaking TypeScript, React, Python and AI-agent developers are the right initial pool. `[ASSUMPTION]` beachhead choice | medium | Four mentee records cover distinct contexts and the Discord export covers all four stacks; examples, not paid demand. | Early supply and invitations miss better-fitting work. | Compare bookings and reasons for not booking by stack. | founder A (Oliwia) | ship + 4 weeks | untested; the pool (D24) is a proposal |

## Kill criteria

- Vault: fewer than three of ten interviewees saying they would pay for a mentor's notes drops the vault (D14, proposal). This is a stated-intention threshold, not paid retention.
- 1.0 sessions: the target is ten paid sessions a week for two consecutive weeks within 61 days of ship (D36). The earlier stop rule (D17: fewer than three paid sessions in week four pauses feature work) is a proposal, and no result that ends the marketplace has been chosen (Q21).
- Mentor supply: fewer than five of the first twenty invited mentors publishing within two weeks pauses invitations (D18, proposal).

## Hypotheses to test

These eighteen rows come from a synthetic session dated 2026-09-14. Its cited report, `research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md`, is not in the repository; only a 2026-10-25 session's `personas.md` exists. The rows cannot be traced to their source and do not inform readiness. They are kept as questions for real research, in the Polish wording of the panel. Rows relating to R12/D20 now apply to the co-edited note (R22).

| Id | Hypothesis | Relates to | Who and how to check | Source |
|---|---|---|---|---|
| H01 | `[SYNTHETIC]` Redakcja, pełna akceptacja lub odesłanie notatki mogą przedłużyć domknięcie sesji; potrzebna byłaby czytelna obsługa braku odpowiedzi lub kolejnej wersji. | A06; R12/D20 | mentor i mentee po konsultacji: Przejdź od szkicu z błędem do użytecznej notatki. Obserwuj poprawkę, brak odpowiedzi i to, kto uważa sesję za zakończoną. | [Session 001, H01](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H02 | `[SYNTHETIC]` Brak rozróżnienia nieobecności od sporu o jakość mógłby zatrzymać płatność mentee albo zobowiązanie mentora. Obie strony potrzebowałyby wiedzieć, co dzieje się z opłatą. | A02, A03; R09/R10 (R09/R10/R19 superseded by R27/R28/R31) | mentee i mentor po rzeczywistym no-show: Opowiedz o ostatniej nieobecności. Co otrzymała każda strona i kiedy? Następnie sprawdź rozumienie projektowanych zasad dla obu nieobecności. | [Session 001, H02](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H03 | `[SYNTHETIC]` Sam stack i świeża dostępność mogą nie wystarczyć do wyboru osoby; uczestnik potrzebowałby przykładu podobnej pracy. | A02, A07; R13/N02 | developer z konkretnym blockerem: Znajdź osobę do ostatniego problemu i wskaż pracę, która dowodzi dopasowania. Obserwuj co porównuje i gdzie nie potrafi wybrać. | [Session 001, H03](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H04 | `[SYNTHETIC]` 25/50 minut rozmowy może zostać pomylone z czasem uzyskania pomocy, mimo najwcześniejszego startu za dwie godziny. Źródłowe „do godziny” nie rozstrzyga, czy obejmuje oczekiwanie. | A04, A02; D22/R14 | developer z pilnym oraz zaplanowanym problemem: Pokaż konkretny problem i najpóźniejszy użyteczny termin odpowiedzi. Następnie odczytaj z oferty czas rozpoczęcia i trwania; nie sugeruj SLA. | [Session 001, H04](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H05 | `[SYNTHETIC]` Przy rezerwacji na czas bliższy niż 24 godziny uczestnik może od początku nie mieć bezpłatnego anulowania i nie zrozumieć tej konsekwencji. | A02, A04; R09/R14 (R09/R10/R19 superseded by R27/R28/R31) | mentee rezerwujący na ten sam dzień: Wskaż termin bliższy niż 24 godziny, a następnie wyjaśnij konsekwencję anulowania. Sprawdź rozumienie przed płatnością. | [Session 001, H05](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H06 | `[SYNTHETIC]` Samo przypomnienie o prawie do materiału może pozostawić uczestnika bez bezpiecznego przykładu do pracy. Panel nie zna uprawnień żadnego rzeczywistego klienta. | A02; D26/R19 (R09/R10/R19 superseded by R27/R28/R31) | developer przynoszący problem z pracy lub zlecenia: Przygotuj przykład problemu, który wolno przekazać osobie zewnętrznej. Jak zdecydowałeś, co usunąć? Nie zbieraj tajnego kodu. | [Session 001, H06](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H07 | `[SYNTHETIC]` Brak widocznej ceny w wariancie symulacji zatrzymałby ocenę oferty. Aktualny opis już podaje cenę, więc jest to warunek do sprawdzenia w interfejsie, nie wykryty brak produktu. | A02; R08, D28 | freelancer kupujący konsultację: Odczytaj kwotę za wybraną długość przed opisaniem problemu i logowaniem. Sprawdź, czy poprawnie rozumie cenę całkowitą. | [Session 001, H07](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H08 | `[SYNTHETIC]` Dłuższe przygotowanie oferty mogłoby skłonić mentora do pozostania przy DM. Źródłowe 20 minut jest deklarowanym warunkiem, nie zmierzonym limitem użyteczności. | A03; D18 | zaproszony mentor przygotowujący pierwszą ofertę: Przygotuj ofertę z rzeczywistym opisem, cenami i terminem. Zmierz wysiłek oraz zanotuj miejsca przerwania; nie narzucaj fikcyjnego czasu. | [Session 001, H08](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H09 | `[SYNTHETIC]` Samo zaproszenie do publikacji terminu nie wystarczyłoby do uznania mentora za aktywnego, gdy nie ustalił czasu, stawki i formalnej możliwości pomocy. | A03; D18/R17 | mentor z pierwszej partii zaproszeń: Otwórz własny kalendarz i przygotuj bookowalny termin oraz cenę. Odróżnij deklarację od opublikowanej oferty; użyj rzeczywistego pomiaru D18. | [Session 001, H09](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H10 | `[SYNTHETIC]` Mentor ceniący znaną społeczność może obawiać się rezerwacji od nieznanej osoby; sam share link nie gwarantuje znajomości odbiorcy. | A03; D21/R13 | mentor zapraszający własną publiczność: Jak wybierałeś osoby, którym pomogłeś ostatnio? Przejdź przez rezerwację od znanej i nieznanej osoby i wskaż granice pomocy. | [Session 001, H10](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H11 | `[SYNTHETIC]` Bez wcześniejszego wglądu w pytanie mentor może przyjąć temat poza kompetencjami lub pracę domową, której nie chce wykonywać. | A03; D05, R13 | mentor selekcjonujący konsultacje: Pokaż ostatnie pytanie, które odrzuciłeś. Jakiej informacji potrzebujesz przed przyjęciem konkretnej rezerwacji? | [Session 001, H11](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H12 | `[SYNTHETIC]` Mentor może oceniać ofertę przez możliwość korzystania z własnego zbioru odpowiedzi. Prywatna notatka nie realizuje całej oczekiwanej wartości tego zbioru; nie oznacza to zgody na włączenie vaulta do Now. | A03, A01; D05/D20 | mentor używający własnego zbioru odpowiedzi: Pokaż jak użyłeś własnego dokumentu przy ostatniej pomocy. Co z tego procesu da się wykonać w sesji i co musiałoby zostać poza produktem? | [Session 001, H12](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H13 | `[SYNTHETIC]` Wariant wymagający danych bankowych przed pierwszym klientem wywołałby opór w obu instancjach tego samego mentora. To ryzyko UX obowiązkowej ścieżki Connect, nie dowód, że Connect jest poza MVP albo że sekwencja produktu nadal nie została wybrana. | A03; D04/R05 | mentor przechodzący rzeczywisty onboarding Connect: Przejdź krok wymagający danych do wypłaty. Co musisz wcześniej wiedzieć o kliencie, przychodzie i wykorzystaniu danych, żeby kontynuować? | [Session 001, H13](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H14 | `[SYNTHETIC]` Przy małej istotności problemu wewnętrzna pomoc lub własna praca mogą wygrać z zakupem; usunięcie prywatnego kosztu nie tworzy automatycznie potrzeby. | A02, A07; D24 | developer z niepilnym problemem i wewnętrznym wsparciem: Opowiedz o ostatnim problemie rozwiązanym bez zewnętrznego eksperta. Co zdecydowało o pozostaniu przy tej drodze? | [Session 001, H14](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H15 | `[SYNTHETIC]` Developer niepłacący prywatnie za pracę może przerwać zakup, jeżeli nie potrafi przeprowadzić go po stronie firmy. Nie znamy rzeczywistej polityki zakupowej tego segmentu. | A02; D05 | developer kupujący pomoc dla pracodawcy: Odtwórz ostatni niewielki zakup wiedzy lub narzędzia dla firmy. Kto płacił, kto zatwierdził i jaki dokument był potrzebny? | [Session 001, H15](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H16 | `[SYNTHETIC]` Developer prowadzący własny zapis może nie widzieć wartości w dodatkowej notatce platformy, nawet gdy docenia samą konsultację. | A06; D20 | mentee prowadzący własny runbook lub notatki: Co zachowałeś po ostatniej konsultacji i gdzie do tego wróciłeś? Porównaj rzeczywiste użycie własnego zapisu z notatką sesyjną. | [Session 001, H16](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H17 | `[SYNTHETIC]` Sam kalendarz może nie skłonić mentora do zmiany; możliwość przychodu uruchamia jedynie dalszą ocenę, bez dowodu migracji publiczności. | A03; D18/D11 | mentor pomagający dotąd bezpłatnie: Pokaż ostatni przypadek przekierowania pytającego do płatnej pomocy, jeśli istniał. Co wtedy uzasadniało dodatkowy proces? | [Session 001, H17](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |
| H18 | `[SYNTHETIC]` Mentee może wstrzymać zakup, jeśli przed płatnością nie potrafi ustalić, czy zadanie mieści się w konsultacji. Czas sesji nie jest gwarancją naprawy. | A02; D05/R09 | mentee z konkretnym pytaniem: Przed zapłatą opisz, jaki wynik uznajesz za możliwy w wybranym czasie. Porównaj to z rozumieniem mentora. | [Session 001, H18](research/walkthroughs/2026-09-14-paid-text-session-session-001/report.md) |

## Open questions

| Id | Question | Blocking | Who can answer | Status |
|---|---|---|---|---|
| Q01 | Does a vault answer cite the mentor and the note? | no for 1.0 | founder B | answered by D15 (proposal) |
| Q02 | Pricing per mentor or per platform? | no | founder A | closed by D09 |
| Q03 | Is the support export real data? | no | founder A | closed: test data (record not in the repository) |
| Q04 | No record of Q04 exists; the id is left unused. | no | founders | no record |
| Q05 | What result kills the vault? | no for 1.0 | both founders | answered by D14 (proposal) |
| Q06 | What weekly paid-session threshold, by which date, tells you 1.0 works? | no | founder A | closed by D36 (target; date follows ship) |
| Q07 | Who runs the ten A01 interviews and by when? | no for 1.0; yes before vault work | both founders | answered by D25 (proposal) |
| Q08 | Is A02 accepted untested for 1.0, or tested first? | no | both founders | D30 builds before testing; the D17 check is a proposal (Q25) |
| Q09 | Is A03 accepted untested, or tested before the first invitations? | no | both founders | D30 builds before testing; the D18 check is a proposal (Q25) |
| Q10 | When does 1.0 ship? | no | founder A | superseded by Q24 |
| Q11 | Who is the operator in 1.0? | no | both founders | D37 adds screens; founders as operator is D19 (proposal) |
| Q12 | Who drafts the note after a session? | no | founder A | closed by D38 and D42 |
| Q13 | How does a mentee find a mentor in 1.0? | no | founder A | closed by D21 |
| Q14 | Which date reviews rules and decisions that carry none? | no | founder A | D23 (proposal) |
| Q15 | Does the beachhead become a decision with an owner? | no | founder A | D24 (proposal) |
| Q16 | Should the README say the vault and MCP are later? | no | founder A | the 2026-09-14 draft reports a README scope note; not rechecked |
| Q17 | How soon after booking must a session start? | no | founder A | closed by D22 |
| Q18 | Where does the text exchange happen? | no | founder A | closed by D27 |
| Q19 | How does a shortened first iteration handle payouts if Connect is deferred? | no while D30/D34 build the full marketplace | both founders | reopens only if a shortened paid release is proposed |
| Q20 | How will the founders recruit developers who visited a mentor page but did not book? | yes, for the non-booker recruitment and measurement story | both founders | open |
| Q21 | What result ends the session marketplace itself? | no for 1.0 implementation; yes for a predeclared stop rule | both founders | open |
| Q22 | Does founder A confirm, change or drop the 20% fee (D11/R10), PLN currency and price bounds (D28/R21), the in-app session (D27/R20) and the share-only-what-you-may rule (D26/R19)? | no | founder A (Oliwia) | closed 2026-10-26: fee by D40, currency and bounds by D41, session place by D27, sharing by D44 |
| Q23 | With a co-edited note (D38), does the mentee still approve a final version before it counts as done? | no | founder A (Oliwia) with founder B (Maciej) | closed by D42 |
| Q24 | When does 1.0 ship, once the backlog is sized? | no for backlog planning; yes for every date counted from ship (week-four check, review date, target deadline) | founder A (Oliwia) | open |
| Q25 | Should the unrecorded later and measurement decisions (D12–D15, D17, D18 check, D19 operator identity, D23–D25, D32, D35) be confirmed, changed or dropped? | no for 1.0 implementation; yes for the week-four and first-batch checks | both founders | open |
| Q26 | Does a free cancellation (more than 24 hours ahead) return the payment automatically, and what happens when the mentor or the mentee does not show up? | no | founder A (Oliwia) | closed by D39: no refunds in any case |
| Q27 | May a mentor stay off the public list (share link only), or see the question and accept or decline a booking, in 1.0? | no while R13 and D22 stand; a yes changes the list and booking stories | founder A (Oliwia) | open; two listed prospects set these conditions |
| Q28 | Is D01's consequence "validate purchase and mentor delivery before planning a self-service product" superseded by D30? | no for planning; leaves two active records in conflict | founder A (Oliwia) | open |
| Q29 | Who writes and approves the mentee and mentor terms before payments go live, and who settles payouts and dispute resolutions? | no | founder A (Oliwia) | closed by D46 (terms; still to be written); payouts and dispute resolutions are operator work (D37, R30) |
| Q30 | With no refunds (D39), what can the operator's resolution of a quality dispute or a mentor no-show do for the mentee? | no | founder A (Oliwia) | closed by D43 |
| Q31 | When a mentor cancels a booked session, does the mentee get a replacement session (R30) or lose the payment (R27)? | no | founder A (Oliwia) | closed by D45 (mentee loses it, for now) |

## Definition of Ready addendum (own)

Problems and users have relevant support in the supplied interview records and community data, with their limits stated above. These records show specific help-seeking situations; they do not validate the paid offer. The team chose to build the full 1.0 before testing payment or mentor supply (D30), and A02 and A03 stay untested. That choice is a decision about risk, not evidence.

Ready for implementation planning: the full 1.0 scope. Each item rests on an active decision or is a spec detail:
- accounts (R06);
- invitations and operator screens (R07, R23, R24, R28, R29, R30);
- mentor profiles, prices and slots (R04, R08, R13, R14, R29);
- the list and share link (R13);
- booking and Stripe payment (R01, R05, R14);
- no-refund cancellation by the mentee (R27) and by the mentor (R32);
- fee and payout, held until delivery or the dispute window passes (R05, R28, R30);
- the session inside DevMentor with the written answer (R03, R20, R31; D34 "text session");
- notifications: in Now since the 2026-09-14 draft; no product rule constrains them, so events and channel are spec details;
- the co-edited note (R26);
- booking-to-start measurement (R15).

Not blocking the build:
- R33: founder A's approved terms; blocks taking real payments, not building.
- Q24: ship date; set after sizing.
- Q27: mentor list exposure and seeing the question first; a yes would change two stories.
- Q28: the conflict between D01's validate-first consequence and D30.
- Q20: non-booker research method; collection plan.
- Q21, Q25: later stop rule and unrecorded later decisions; Q25 includes who the operator is (D19), which the operator screens' role access will need.

Decisions confirmed on 2026-10-26 rest on founder B's report of founder A's agreement. The specs must still define detailed states, failure handling, data and permission impact, and UI contracts.

## Collection plan

### Why did developers who saw a mentor page not book? (A02, A04)

- What decision or work needs it: whether 1.0 continues after the week-four check; Q20 blocks the method
- Who can answer it: developers who visited a mentor page and did not book
- How: interview about the actual blocker, alternatives, timing and reason for not booking; do not infer willingness from a hypothetical price answer
- Owner and by when: both founders; four weeks after ship (date open, Q24)
- Template: `research/templates/interview-note.md`

### Do invited mentors publish bookable sessions? (A03)

- What decision or work needs it: whether to send another invitation batch and write more mentor-side stories (D18, proposal)
- Who can answer it: the first twenty invited mentors, and decliners
- How: record acceptance and published availability for the first batch; interview decliners about shared-list exposure, setup effort and bank-details timing. The fifty-name list holds no commitments.
- Owner and by when: both founders; two weeks after the first batch accepts (date unknown)
- Template: data-request shape (the existing `research/templates/data-request.md` is the superseded experiment capture sheet and does not fit)

### Would developers pay for a named mentor's notes? (A01)

- What decision or work needs it: whether the vault returns to scope (D14, proposal)
- Who can answer it: ten appropriate developers
- How: interviews; keep the limited meaning of a stated intention
- Owner and by when: founder B (D25, proposal); unknown
- Template: `research/templates/interview-note.md`

### Do mentees keep and use the session note? (A06)

- What decision or work needs it: whether co-editing (D38) and later publishing have value
- Who can answer it: mentees and mentors after real sessions
- How: record whether notes are edited, kept and reopened; ask what was useful
- Owner and by when: not assigned; after the first sessions
- Template: data-request shape (the existing `research/templates/data-request.md` is the superseded experiment capture sheet and does not fit)
