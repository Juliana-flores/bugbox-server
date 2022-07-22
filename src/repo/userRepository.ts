import { TemplateRepository } from './templateRepository';
import { Email, User } from '../models';
export class UserRepository extends TemplateRepository<User> {
  async exists(username: string): Promise<boolean> {
    return this.repository.findOneBy({ username });
  }

  async findByEmail(username: string): Promise<User | null> {
    return this.repository.findOneBy({ username });
  }

  mail(username: string) {
    return this.repository.findOneBy({
      username,
    });
  }

  async inbox(username: string) {
    return this.mail(username).then(({ inbox }) => inbox);
  }

  outbox(username: string) {
    return this.mail(username).then(({ outbox }) => outbox);
  }

  async delete(username: string, id: string) {
    const user = await this.findByEmail(username);

    if (!user) {
      return;
    }
    const index = user.inbox.findIndex((mail: Email) => mail.sid === id);

    const mail = user.inbox[index];

    if (!mail) {
      return;
    }

    mail.removed = true;

    user.inbox[index] = mail;

    return this.updateOne({ username }, user);
  }

  trashCan(username: string) {
    return this.mail(username).then(({ inbox }) => inbox.filter(({ removed }: Email) => !removed));
  }
}
