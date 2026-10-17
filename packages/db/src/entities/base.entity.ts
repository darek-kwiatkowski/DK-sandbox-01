import { randomUUID } from "node:crypto";
import { p } from "@mikro-orm/postgresql";

/**
 * Columns shared by every entity. UUID ids avoid sequential-id enumeration.
 * A function, so each entity gets its own property builders.
 */
export const baseProperties = () => ({
  id: p.uuid().primary().onCreate(() => randomUUID()),
  createdAt: p.datetime().onCreate(() => new Date()),
});
