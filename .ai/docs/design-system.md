# DevMentor design system — agent quick reference

Read this before building or changing a screen in `packages/ui`. The authoritative, linked manuals and story states are in Storybook (`npm run storybook`). This file is a navigation aid and must stay aligned with the manuals. Product UI examples/copy are Polish; Storybook instructions are English. (Approved Q1; `.ai/specs/2026-11-06-design-system-storybook.md`.)

## Character and product boundary

**Factual, readable, warm, focused, workshop-like.** Avoid generic, flashy, noisy, cold or chaotic styling. DevMentor connects developers with experienced mentors for paid 25- or 50-minute text sessions. Mentees find a mentor and book; mentors publish expertise, prices and slots; operators handle invitations and disputes. (References P09–P10; brief scope, R01–R05.)

The design-system stories are UI fixtures. They do not implement backend behavior. Any unspecified contract (payment, fee, Connect, realtime, cancellation side effects, permissions) stays a documented gap, never an invented assumption. (Backlog E01–E05; R28, R29, R33; approved Q2.)

## Component index

| Component | Import | Use when | Do not use when |
| --- | --- | --- | --- |
| Button | `@devmentor/ui/components/ui/button` | In-place action such as save or publish. | Navigating; use a link. (R01.5; WCAG 4.1.2.) |
| Link | native `<a>`; `Button` with `variant="link"` for styled link action | Navigate to a page or public work. | Changing state; use a button. (R04; WCAG 4.1.2.) |
| Input | `@devmentor/ui/components/ui/input` | One-line text, email, password, URL or money. | Multi-line content; use Textarea. (P18.) |
| Textarea | `@devmentor/ui/components/ui/textarea` | Profile description, question or note. | Single-line value; use Input. (P18; R02.1.) |
| Select | `@devmentor/ui/components/ui/select` | One value from a compact known set. | Few visible options; use Radio group. (P18.) |
| Checkbox | `@devmentor/ui/components/ui/checkbox` | Independent choices, including stack tags. | Exactly one of a few options; use Radio group. (H1.) |
| Radio group | `@devmentor/ui/components/ui/radio-group` | One visible choice, such as duration or slot. | Searchable/large list; no search-select is approved. (E03-S02.) |
| Field | `@devmentor/ui/components/ui/field` | Label, hint, control and field error. | Decorative text without a control. (P18; WCAG 3.3.2.) |
| Card | `@devmentor/ui/components/ui/card` | Bounded form/detail panel. | Dense rows; use a divided list/table. (R01.3.) |
| Badge | `@devmentor/ui/components/ui/badge` | Short factual status next to text. | Click action or color-only status. (R01.5; WCAG 1.4.1.) |
| Avatar | `@devmentor/ui/components/ui/avatar` | Person identity with initials fallback. | Rating or decorative icon. (Q5.) |
| Alert | `@devmentor/ui/components/ui/alert` | Persistent important feedback. | Hidden/transient action-required error. (WCAG 3.3.1.) |
| Dialog | `@devmentor/ui/components/ui/dialog` | Short interruptive task in current context. | Consequential confirmation; use Alert dialog. (WAI-ARIA Dialog Pattern.) |
| Alert dialog | `@devmentor/ui/components/ui/alert-dialog` | Confirm a named consequential action. | Routine detail/form. (R27; WAI-ARIA Alert Dialog Pattern.) |
| Dropdown menu | `@devmentor/ui/components/ui/dropdown-menu` | A few secondary actions for one object. | Primary or essential always-visible action. (R01.6.) |
| Tooltip | `@devmentor/ui/components/ui/tooltip` | Non-essential hover/focus help. | Required instruction. (WCAG 1.4.13.) |
| Skeleton | `@devmentor/ui/components/ui/skeleton` | Reserve known content shape while loading. | Error or empty data. (Stage-3 pattern plan.) |
| Separator | `@devmentor/ui/components/ui/separator` | Separate related regions. | Dense list rows; use row dividers. (R01.3.) |
| Table | `@devmentor/ui/components/ui/table` | Structured rows with headers. | Responsive object summary. (R01.1, R01.3.) |
| LoadingMessage | `@devmentor/ui/backend/feedback` | Announced loading region. | Empty/error state. (P18; WCAG 4.1.3.) |
| ErrorMessage | `@devmentor/ui/backend/feedback` | Region-level failure with recovery step. | Field validation. (Engineering standards; WCAG 3.3.1.) |
| EmptyState | `@devmentor/ui/backend/feedback` | No items; explain why and next action. | No filter matches; show clear-filters action. (Stage-3 list pattern.) |
| CrudForm | `@devmentor/ui/backend/forms` | Schema-driven create/edit with server errors. | Calendar picker or non-form workflow. (P18; engineering standards.) |
| DataTable | `@devmentor/ui/backend/tables` | Data list with loading/error/empty/pagination. | One record's details. (Engineering standards.) |
| AccessDenied | `@devmentor/ui/backend/feedback` | Authenticated actor lacks permission. | Anonymous access; redirect to sign-in. (E01-S01; P3.) |
| AppShell | `@devmentor/ui/backend/layout` | Navigation for signed-in area. | Public marketing page. (P3.) |
| AuthMessage | `@devmentor/ui/components/auth/AuthMessage` | Known safe auth/OAuth result. | Raw provider/server detail. (E01-S01.) |
| GitHubButton | `@devmentor/ui/components/auth/GitHubButton` | GitHub sign-in/link. | Local save or generic external link. (R06.) |
| SignOutButton | `@devmentor/ui/components/auth/SignOutButton` | End session after server confirmation. | Ordinary navigation. (E01-S01.) |
| MentorList | `@devmentor/ui/components/mentors/MentorList` | Stack-filtered mentors in published-slot order. | Ranking/search marketplace. (R13; N02.) |
| MentorListRow | `@devmentor/ui/components/mentors/MentorListRow` | One dense mentor result with next slot. | Full profile description. (R01.1, R01.5.) |
| MentorProfile | `@devmentor/ui/components/mentors/MentorProfile` | One mentor's expertise, prices, slots and work. | Reviews/ratings. (R04, R08; N02.) |
| PublicWorkLink | `@devmentor/ui/components/mentors/PublicWorkLink` | Factual external work sample. | Invented endorsement. (R04; N02.) |
| StackFilter | `@devmentor/ui/components/mentors/StackFilter` | Filter results by technology. | Unapproved search/ranking. (R13.) |
| StackTags | `@devmentor/ui/components/mentors/StackTags` | Display or edit technology tags. | Status labels or unspecified taxonomy. (R13; H1.) |
| MessageComposer | `@devmentor/ui/components/messages/MessageComposer` | Draft one text-session message. | Threads, video or emoji chat. (R02.2, R02.5, R02.8.) |
| SessionTranscript | `@devmentor/ui/components/messages/SessionTranscript` | Confirmed messages with author/time. | Unconfirmed drafts. (R02.3.) |
| PrivateNote | `@devmentor/ui/components/notes/PrivateNote` | One private co-edited note. | Public review or threaded notes. (R26, R31.) |
| ConnectStatus | `@devmentor/ui/components/payments/ConnectStatus` | Known Connect onboarding state. | Unmapped provider state. (E05-S01; proposal.) |
| PayoutList | `@devmentor/ui/components/payments/PayoutList` | Payout rows with approved labels. | Fee/timing calculations without a contract. (R05, R28; G5.) |

## Semantic tokens

Use names by purpose. Raw `sand-*`, `ochre-*` and red values are only sources inside the token file; never use them directly in components. (Approved `lekcja-06/tokeny.md`; user brief: token rule.)

| Token | Purpose |
| --- | --- |
| `bg-background`, `text-foreground` | Main page surface and text. (R01.4; P01.) |
| `bg-primary`, `text-primary-foreground` | One primary action on a screen. (R01.5; K3.) |
| `text-muted-foreground` | Metadata and secondary descriptions, not prices or message content. (R02.3; R01.1.) |
| `border-border`, `divide-border` | Thin row/region separation. (R01.3.) |
| `border-input`, `ring-ring` | Form-control boundary and keyboard focus. (WCAG 1.4.11, 2.4.7.) |
| `bg-accent`, `text-accent-foreground` | Hover/active surface, not brand color. (R01.1; `tokeny.md`.) |
| `bg-destructive`, `text-destructive-foreground` | Error/destructive state with text or icon; never color alone. (WCAG 1.4.1.) |
| `gap-in-group`, `gap-between-groups`, `p-panel`, `gap-section` | Spacing by relationship, not arbitrary values. (K1; approved token decisions.) |
| `max-w-reading`, `max-w-page` | Reading measure and overall content width. (R02.1; F1.) |
| `font-mono`, `bg-code`, `text-code-foreground` | Code, filenames, branch names and versions only. (R01.2.) |

Dark mode uses the same semantic token names. Set it on the document root so portals inherit it. (Approved theme decision; user brief rule 9.)

## If… then…

- In-place action → Button; navigation → Link. (R01.5; WCAG 4.1.2.)
- One visible choice → Radio group; many compact known choices → Select; independent choices → Checkbox. Search-select has no approved component. (E03-S02; H1; Q5.)
- Required help → visible copy; optional hover/focus hint → Tooltip. (WCAG 1.4.13.)
- Field-specific error → Field error; region-level actionable failure → persistent Alert/ErrorMessage; non-actionable success → inline status. Never make an actionable error a toast. (WCAG 3.3.1, 4.1.3.)
- Repeated records → DataTable/table or divided list; one record → detail pattern; bounded form/detail panel → Card. (R01.1, R01.3.)
- Short interruptive task → Dialog; consequential confirmation → Alert dialog; major task/navigation → separate page. (WAI-ARIA Dialog Patterns; WCAG 2.4.5.)
- Known content shape loading → Skeleton plus one region announcement; unknown failure → ErrorMessage. (WCAG 4.1.3.)

## Avoid

- No gradients, glass/blur/glow, sparkle icons, emoji reactions, rating stars, learning progress, video controls, urgency promises or three-card AI landing-page patterns. (A01–A06; P11–P16.)
- No palette classes (`bg-zinc-900`), raw colors outside tokens, arbitrary values (`p-[13px]`), speculative variants or `div` click actions. Run `npm run check:tokens`. (Approved `tokeny.md`; WCAG 2.1.1, 4.1.2.)
- No placeholder-only labels, color-only status, unexplained disabled action, transient action-required error or essential tooltip-only instruction. (WCAG 1.4.1, 1.4.13, 3.3.1, 3.3.2; P18.)
- Keep lists dense with dividers; keep session text calm and readable; use one visual priority per screen. (R01.1, R01.3, R01.5; R02.1; K1/K3.)

## Storybook commands

~~~sh
npm run storybook
npm run build-storybook
npm run test:storybook
npm run check:tokens
~~~

See [Storybook contribution guide](../../packages/ui/stories/design-system/Contributing.mdx) for manual structure and review rules. (User design-system brief: stage 4.)
