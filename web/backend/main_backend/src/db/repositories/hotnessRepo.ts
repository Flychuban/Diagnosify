

import Redis from 'ioredis';

interface IHotnessRepo{
    oneUpHotness(id: string): Promise<void>
    getHotness(id: string): Promise<number>
}
class HotnessRepo implements IHotnessRepo {
  public redisClient: Redis;

  constructor() {
    this.redisClient = new Redis();
    this.redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });
  }

  // Connect to Redis asynchronously
  async connect(): Promise<void> {
    // IORedis automatically connects when instantiated
    // We'll keep this method for interface compatibility
    console.log("Connected to Redis");
  }

  async getHotness(id: string): Promise<number> {
    const hotness = await this.redisClient.get(id);
    return hotness ? parseInt(hotness, 10) : 0;
  }

  async oneUpHotness(id: string): Promise<void> {
    await this.redisClient.incr(id);
  }

  async close(): Promise<void> {
    await this.redisClient.quit();
    console.log("Redis connection closed");
  }
}

export const hotnessRepo = new HotnessRepo()
process.on('SIGINT', async () => {
    console.log('\nSIGINT received. Closing Redis connection...');
    await hotnessRepo.close();
    process.exit(0);
});

