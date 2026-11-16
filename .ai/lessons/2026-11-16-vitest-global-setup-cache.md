# Vitest root setup and Docker availability

- **Date:** 2026-11-16
- **Context:** integration startup hid a missing Docker engine behind `code.charCodeAt is not a function` in Vite source mapping.
- **Finding:** disabling `fsModuleCache` only in Vitest child projects does not cover root `globalSetup`. In the installed Vitest 5.0.5/Vite combination the cached setup source can be a Buffer, masking the original exception. The root test config also needs `fsModuleCache: false` until that upstream behaviour is fixed.
- **Apply:** preserve source mapping; disable the affected root cache instead of suppressing errors. Then diagnose the original setup failure. On Windows verify Docker Desktop's engine is ready (`docker info`), not merely that the CLI is installed; run Testcontainers with the required sandbox access. Do not substitute the development database for ephemeral test databases.
