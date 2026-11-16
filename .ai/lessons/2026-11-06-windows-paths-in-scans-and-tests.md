# Normalize filesystem paths at comparison boundaries

- **Date:** 2026-11-06
- **Context:** The design-token scanner compared `path.relative()` output with a slash-separated token-file constant. On Windows, backslashes caused it to scan the allowed token source itself. A full unit run also exposed a filesystem test that hard-coded POSIX paths.
- **Finding:** Path APIs return platform-native separators. Comparing those values with repository-relative slash paths silently breaks exclusions; tests that assert resolved paths should use the platform path API.
- **How to apply:** Normalize relative paths to `/` before comparing repository constants. In tests, construct expected absolute paths with `resolve()` and normalize paths before comparing repository-relative names.
