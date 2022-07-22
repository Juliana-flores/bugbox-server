import { DataSource } from 'typeorm';
import 'reflect-metadata';

import { databaseCredentials } from '../config/env';

import { Server, Email, User } from '../models';

enum Config {
  type = 'mongodb',
}

console.log(databaseCredentials);
export const Source = new DataSource({
  url: `mongodb+srv://${databaseCredentials.username}:${databaseCredentials.password}@${databaseCredentials.host}/${databaseCredentials.database}?retryWrites=true&w=majority`,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  type: Config.type,
  synchronize: true,
  logging: false,
  entities: [Server, User],
});
