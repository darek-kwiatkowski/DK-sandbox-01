import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";

// Same major as production (docker-compose.yml, CI).
const POSTGRES_IMAGE = "postgres:17-alpine";

export interface TestDatabase {
  url: string;
  stop: () => Promise<void>;
}

/**
 * Starts an ephemeral PostgreSQL with Testcontainers. Setting TEST_DATABASE_URL
 * uses that (disposable!) database instead, e.g. where Docker is unavailable.
 */
export async function startTestDatabase(): Promise<TestDatabase> {
  const external = process.env.TEST_DATABASE_URL;
  if (external) {
    assertNotDevDatabase(external);
    return { url: external, stop: async () => undefined };
  }
  const container: StartedPostgreSqlContainer = await new PostgreSqlContainer(POSTGRES_IMAGE)
    .withDatabase("devmentor_test")
    .start();
  const url = container.getConnectionUri();
  return { url, stop: async () => void (await container.stop()) };
}

/** Tests drop the schema: refuse to point them at the configured dev/prod database. */
export function assertNotDevDatabase(url: string): void {
  if (process.env.DATABASE_URL && url === process.env.DATABASE_URL) {
    throw new Error("The test database must not be DATABASE_URL: tests drop its schema.");
  }
}
