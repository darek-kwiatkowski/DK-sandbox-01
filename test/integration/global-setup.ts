import { startTestDatabase } from "../support/postgres";

/** One ephemeral PostgreSQL (Testcontainers) for the whole integration run. */
export default async function setup() {
  const database = await startTestDatabase();
  // Test workers start after global setup, so they inherit this variable.
  process.env.TEST_DATABASE_URL = database.url;
  return () => database.stop();
}
