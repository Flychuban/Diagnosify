import { DB, redis } from './redis_db';

class Cleaner {
  private redis: DB;
  constructor(redis: DB) {
    this.redis = redis;
  }
  clean() {}
}

const cleaner = new Cleaner(new redis(null));
