# Review shared contracts across complete flows

- **Date:** 2026-10-31
- **Context:** applying the review of the platform-primitives and account specifications before implementation.
- **Finding:** individually plausible contracts conflicted when composed: a local-only redirect could not start OAuth, request-wide event dispatch did not match transaction ownership, and protecting takeover alone left linking and password login able to race credential replacement.
- **How to apply:** for every shared primitive, walk its first consumer end to end and identify the response destination, authoritative transaction, credential/version snapshot and failure outcome. Review every alternate path that mutates or authenticates the same identity together, including in-flight requests. Reconcile diagrams, API tables, delivery phases and regression-test requirements after changing the contract; do not mark a review resolved by editing only the normative paragraph.
