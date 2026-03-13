export enum EnvObjects {
  MONGO_OPTIONS = 'MongoOptions',
  POSTGRES_OPTIONS = 'PostgresOptions',
  REDIS_OPTIONS = 'RedisOptions',
  SYSTEM_OPTIONS = 'SystemOptions',
  JWT_OPTIONS = 'JwtOptions',
}

export interface MongoOptions {
  host: string;
  options: {
    maxIdleTimeMS: number;
    dbName: string;
    auth: {
      username: string;
      password: string;
    };
    tls: boolean;
    tlsCAFile: string | null;
  };
}

export interface PostgresOptions {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RedisOptions {
  host: string;
  port: number;
  pass: string;
}

export interface SystemOptions {
  port: number;
  nodeEnv: string;
  apiMode: string;
}

export interface JwtOptions {
  accessSecret: string;
  refreshSecret: string;
  accessExpiresIn: string;
  refreshExpiresIn: string;
}

export const configuration = (): any => ({
  SystemOptions: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    apiMode: process.env.API_MODE || 'development',
  },
  MongoOptions: {
    host: process.env.MONGO_DB_URL,
    options: {
      maxIdleTimeMS: process.env.MONGO_DB_MAX_IDLE_TIME_MS
        ? parseInt(process.env.MONGO_DB_MAX_IDLE_TIME_MS)
        : 60000,
      dbName: process.env.MONGO_DB_NAME,
      auth: {
        username: process.env.MONGO_DB_USER,
        password: process.env.MONGO_DB_PASS,
      },
      tls: process.env.MONGO_DB_USE_TLS === 'true',
      tlsCAFile: process.env.MONGO_DB_TLS_CA_FILE || null,
    },
  },
  PostgresOptions: {
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT)
      : 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
    database: process.env.POSTGRES_DB,
  },
  RedisOptions: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
    pass: process.env.REDIS_PASS,
  },
  JwtOptions: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'change-me-in-production',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'change-me-refresh-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '1h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
});
