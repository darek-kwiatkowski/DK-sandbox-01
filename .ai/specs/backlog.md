# Backlogs

## .ai/specs/product-brief.md
Backlog source: .ai/specs/product-brief.md
Last filed: 2026-10-26

| Id | Issue | Title | Epic / story | Depends on | Adopted |
|---|---|---|---|---|---|
| E01 | [#5](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/5) | Accounts and access | — | — | no |
| E02 | [#6](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/6) | Mentor offer | — | — | no |
| E03 | [#7](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/7) | Finding and booking | — | — | no |
| E04 | [#8](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/8) | Session and note | — | — | no |
| E05 | [#9](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/9) | Payouts | — | — | no |
| E06 | [#10](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/10) | Later | — | — | no |
| E01-S01 | [#11](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/11) | A developer or mentor signs in with GitHub and only sees what their role allows | #5 | — | no |
| E01-S02 | [#12](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/12) | The operator invites mentors from a screen and only invited people can become mentors | #5 | E01-S01 | no |
| E02-S01 | [#13](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/13) | An invited mentor publishes a profile with public work, a description and stack tags | #6 | E01-S02 | no |
| E02-S02 | [#14](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/14) | The operator sets PLN price bounds and the fee, and a mentor sets both prices inside the bounds | #6 | E02-S01 | no |
| E02-S03 | [#15](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/15) | A mentor publishes 25- or 50-minute slots, bookable only at least two hours ahead | #6 | E02-S02 | no |
| E03-S01 | [#16](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/16) | A mentee finds a mentor through a stack-filtered list or a share link | #7 | E02-S01, E02-S03 | no |
| E03-S02 | [#17](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/17) | A mentee books a slot, sees the price and the no-refund terms, pays through Stripe, and both get a confirmation | #7 | E03-S01, E02-S02 | no |
| E03-S03 | [#18](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/18) | Either party cancels a booking and the money follows the no-refund rules | #7 | E03-S02 | no |
| E04-S01 | [#19](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/19) | Mentor and mentee hold the text session inside DevMentor, and the mentor delivers a written answer | #8 | E03-S02 | no |
| E04-S02 | [#20](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/20) | Mentor and mentee co-edit one private note, which becomes final when the mentee approves it | #8 | E04-S01 | no |
| E05-S01 | [#21](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/21) | A mentor completes Connect onboarding and is paid after delivery, minus the fee | #9 | E03-S02, E04-S01 | no |
| E03-S02-T01 | [#22](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/22) | Payment port with an in-memory adapter and a Stripe Checkout adapter | #17 | — | no |
| E03-S02-T02 | [#23](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/23) | Notification port with an in-memory adapter | #17 | — | no |
| E05-S01-T01 | [#24](https://github.com/darek-kwiatkowski/DK-sandbox-01/issues/24) | Connect onboarding and payouts through the payment port | #21 | E03-S02-T01 | no |

Reserved, never filed: the 2026-09-14 draft brief named E00–E05 ids and issues #19 and #25 that did not exist in this tracker. E05-S02 (dispute and replacement-session screen) was drafted on 2026-10-26 and moved to Later by D48 before filing; the id stays reserved for its return.
