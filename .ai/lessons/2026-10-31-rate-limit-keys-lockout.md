# A per-account rate-limit key that also counts successes is a lockout weapon

- **Data:** 2026-10-31
- **Kontekst:** grilling the S01/primitives specs. Login was limited to 10 attempts per 15 min per email hash, counting every attempt with no reset. One IP could lock a password-only user out indefinitely, and the suggested escape (GitHub sign-in) deleted their password through the Q12 takeover.
- **Wniosek:** a tight limit keyed only by a victim-controlled identifier (email, username) lets anyone deny that account cheaply. The fix was to key the tight limit on (identifier, IP) and keep only a loose per-identifier ceiling against distributed guessing.
- **Jak stosować:** when reviewing or designing a rate limit, ask "can a third party exhaust this bucket for someone else?" Tight limits go on (identifier, client); identifier-only buckets get a ceiling high enough that a lockout needs sustained distributed traffic. Check that every documented escape path does not itself destroy data.
