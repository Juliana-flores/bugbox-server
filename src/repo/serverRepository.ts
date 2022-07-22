import { TemplateRepository } from './templateRepository';
import { extractServer } from '../helpers/mail';
import { serverParams } from '../config/env';
import { Server } from '../models';

export class ServerRepository extends TemplateRepository<Server> {
  isFromSameServer(mail: string): boolean {
    const currentServer = extractServer(mail);

    return currentServer === serverParams.name;
  }
}
