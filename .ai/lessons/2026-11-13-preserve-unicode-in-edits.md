# Preserve Unicode when editing Polish examples

- **Date:** 2026-11-13
- **Context:** review of Storybook session/payout screen compositions found Polish diacritics replaced by literal question marks after a shell-generated edit, despite successful typecheck and story tests.
- **Finding:** typechecking and accessibility checks do not detect damaged natural-language strings. A valid UTF-8 file can already contain replacement question marks.
- **How to apply:** prefer `apply_patch` for Unicode source edits. Review the actual changed copy as UTF-8 and inspect rendered examples; explicitly check Polish diacritics after shell-based generation. Do not treat build success as copy verification.
