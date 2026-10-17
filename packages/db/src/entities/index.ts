import { User } from "./user";

export { User };

/** Every entity must be listed here; MikroORM 7 has no folder discovery in this setup. */
export const entities = [User];
