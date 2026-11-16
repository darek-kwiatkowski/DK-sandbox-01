# Repair Rolldown on Windows

- Goal: restore the existing Rolldown installation and verify Storybook starts.
- Related spec: `.ai/specs/2026-11-06-design-system-storybook.md`.
- Diagnosis: Node and PE architecture are both x64. Installed native binding is truncated to 5,102,500 bytes; its PE sections require 23,133,184 bytes.
- Action: download exactly `@rolldown/binding-win32-x64-msvc@1.2.16` through npm, replace the truncated binary, then verify native loading and Storybook build/tests. No dependency version changes.
- Download: `npm pack` succeeded; tarball contains a 23.1 MB native binary. Offline attempt had no cached registry metadata.
- Verification: direct native import succeeds. Fixed the previous continuation's MDX import to `@storybook/addon-docs/blocks`; `npm run build-storybook` succeeds. Installed Chromium 1254; `npm run test:storybook` succeeds with 160/160 stories per theme (25 files each), a11y error mode and existing documented exceptions.
- Full unit run: 228 tests pass, but coverage gate fails because existing mentor components have no unit tests (95.63% statements, 89.04% branches, 93.68% functions, 95.66% lines). This remains stage-3 work; no thresholds changed.
- Temporary download and extraction files removed after repair. No dependency-version or lockfile changes.
- Status: completed — Rolldown and browser test environment repaired. Stage 3 is still incomplete, as recorded in POSTEP.md.
