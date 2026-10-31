# Apply specification review

- Goal: apply the recommendations in `.ai/analysis/2026-10-31-spec-consistency-review.md` to both 2026-10-31 specifications.
- Authorization: user requested applying the review recommendations; no implementation requested.
- Plan: reconcile platform contracts and simplify PP1; update account flows and verification requirements; independently review the resulting documents; record resolutions and reusable lessons.
- Decisions: explicit GitHub linking requires a matching verified email; rate limiting counts all attempts atomically, without failure counters/refunds; workflow owns the outer transaction; future mechanisms stay with their consumers.
- Work: read current specs, lessons and git status; delegated account-spec edits while updating platform contracts.
- Validation: document consistency review and `git diff --check`; application checks are not applicable to specification-only edits.
- Work completed: revised both source specifications, added regression-test requirements, recorded all 12 finding resolutions in the review, and added the shared-contract review lesson.
- Independent check: reviewed scope, cross-document contracts and phasing; no remaining major conflict identified. The suggested terminology cleanup was already present in the edited source and confirmed by `rg`.
- Commands/results: `git diff --check` passed; `git diff --stat` and targeted `rg` checked the changes and stale phrases. One initial `rg` used a Windows wildcard path that was rejected; repeated successfully using `-g`.
- Tests: no lint/typecheck/unit/integration/build/E2E or browser checks run; changes are specifications and review records only. Required future implementation tests remain in the specs.
- Status: completed; no open decision required. No application code changed, committed or pushed.
