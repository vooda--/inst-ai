import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default {
  development: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: {
      filename: process.env.DB_FILENAME || './dev.sqlite3'
    },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: {
      filename: process.env.DB_FILENAME || './prod.sqlite3'
    },
    migrations: {
      directory: './migrations'
    },
    useNullAsDefault: true
  }
};
