import { apiHandler } from "@devmentor/core";

export const dynamic = "force-dynamic";

// Liveness only: does not touch the database, so it answers while the DB is down.
export const GET = apiHandler(() => ({ status: "ok" }));
