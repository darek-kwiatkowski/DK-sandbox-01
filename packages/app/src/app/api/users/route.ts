import { makeCrudRoute } from "@devmentor/core";

// DB access only in force-dynamic routes: the app builds and boots without a database.
export const dynamic = "force-dynamic";

// Public on purpose: read-only list backing the /backend demo page, as before.
// Switch to access: "session" (and an admin check) when the auth concept lands.
export const { GET } = makeCrudRoute({
  access: "public",
  list: ({ cradle }) => cradle.userService.list(),
});
