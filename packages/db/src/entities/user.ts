import { randomUUID } from "node:crypto";
import { defineEntity, p } from "@mikro-orm/postgresql";

export const UserSchema = defineEntity({
  name: "User",
  tableName: "users",
  properties: {
    id: p.uuid().primary().onCreate(() => randomUUID()),
    email: p.string().length(255).unique(),
    name: p.string(),
    createdAt: p.datetime().onCreate(() => new Date()),
  },
});

export class User extends UserSchema.class {}
UserSchema.setClass(User);
