declare namespace NodeJS {
  interface ProcessEnv {
    /** PostgreSQL connection string */
    DATABASE_URL: string;
    /** JWT access token signing secret */
    JWT_ACCESS_SECRET: string;
    /** JWT refresh token signing secret */
    JWT_REFRESH_SECRET: string;
    /** Access token expiration in seconds */
    JWT_ACCESS_EXPIRES_IN: string;
    /** Refresh token expiration in seconds */
    JWT_REFRESH_EXPIRES_IN: string;
    /** Application port (default: 3000) */
    PORT: string;
    /** Node environment */
    environment: 'development' | 'production' | 'test' | (string & {});
  }
}
