import 'dotenv/config';

export const databaseCredentials = {
  username: process.env.DATABASE_USERNAME || 'dev',
  host: process.env.DATABASE_HOST || 'localhost',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
};

export const serverParams = {
  basePath: process.env.BASE_PATH || 'localhost',
  environment: process.env.ENVIRONMENT || 'dev',
  name: process.env.SERVER_NAME || 'mailbox',
  port: parseInt(process.env.PORT as string) || 3001,
};
