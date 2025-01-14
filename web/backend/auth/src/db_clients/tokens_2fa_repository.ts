import Redis from 'ioredis';

export interface TwoFADB {
  getToken(key: string): Promise<string | null>;
  setToken(key: string, value: string): Promise<void>;
  deleteToken(key: string): void;
}

export class redis implements TwoFADB {
  private client;

  constructor(
    options: {
      port: number;
      host: string;
      username: string;
      password: string;
      db: number;
    } | null,
  ) {
    this.client = options !== null ? new Redis(options) : new Redis();
  }

  async setExpire(key: string, seconds: number): Promise<void> {
    this.client.expire(key, seconds);
  }

  async getToken(key: string): Promise<string | null> {
    const data = this.client.get(key);
    return data;
  }

  async setToken(key: string, value: string): Promise<void> {
    //! Potential bug if you want to get the value from set since its not awaited
    this.client.set(key, value);
    const EVERY_30_MINUTES = 1 * 60 * 30;
    this.setExpire(key, EVERY_30_MINUTES);
  }

  deleteToken(key: string) {
    this.client.del(key);
  }
}
