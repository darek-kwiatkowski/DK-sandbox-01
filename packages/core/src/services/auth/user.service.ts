import { UniqueConstraintViolationException, User, type EntityManager } from "@devmentor/db";
import { ConflictError } from "../../http/errors";

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
    try {
      await this.em.persist(user).flush();
    } catch (error) {
      if (error instanceof UniqueConstraintViolationException) {
        throw new ConflictError("Użytkownik o tym adresie e-mail już istnieje.", { email: ["Ten adres e-mail jest już zajęty."] });
      }
      throw error;
    }
    return user;
  }
}
