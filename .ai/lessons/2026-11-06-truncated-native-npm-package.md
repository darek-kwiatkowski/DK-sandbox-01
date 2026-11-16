# Check binary completeness before changing native-package versions

- **Date:** 2026-11-06
- **Context:** After interrupted npm installations, Rolldown reported a missing native binding. Directly requiring the Windows binding instead reported `ERR_DLOPEN_FAILED`.
- **Finding:** The installed x64 PE binary was truncated to 5,102,500 bytes although its sections required 23,133,184 bytes. Node and package architecture matched. Replacing it from `npm pack @rolldown/binding-win32-x64-msvc@1.2.16` restored loading and the Storybook build without version changes.
- **How to apply:** For native load failures after an interrupted install, require the platform package directly, inspect its file size/header, and compare with a fresh archive of the locked version. A successful subsequent `npm install` does not prove previously extracted files are complete. Let installations finish; do not stop them just because output is quiet.
