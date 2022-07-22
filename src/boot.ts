import { ServerRepository, UserRepository } from './repo';
import { Server, User, Email } from './models';
import { Cursor, Source } from './database';

interface LoadedServices {
  serverRepository: ServerRepository;
  userRepository: UserRepository;
  cursor: Cursor;
}

export const load = async (): Promise<LoadedServices> => {
  const cursor = new Cursor(Source);
  await cursor.connect();

  const serverRepository = new ServerRepository(cursor, Server);
  const userRepository = new UserRepository(cursor, User);

  return {
    serverRepository,
    userRepository,
    cursor,
  };
};
