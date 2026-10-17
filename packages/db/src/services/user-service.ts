import type { EntityManager } from "@mikro-orm/postgresql";
import { User } from "../entities";

export class UserService {
  private readonly em: EntityManager;

  constructor({ em }: { em: EntityManager }) {
    this.em = em;
  }

  list(): Promise<User[]> {
    return this.em.find(User, {}, { orderBy: { createdAt: "desc" } });
  }

  async create(input: { email: string; name: string }): Promise<User> {
    const user = this.em.create(User, input);
    await this.em.persist(user).flush();
    return user;
  }
}
