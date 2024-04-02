import { redis, TwoFADB } from './db_clients/tokens_2fa_repository';

class TwoFA {
  //two factor auth where the pair is stored like that $USERNAME : $TOKEN
  private db;
  constructor(db: TwoFADB) {
    this.db = db;
  }
  private generateRandomNumber() {
    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return getRandomInt(1, 1000);
  }
  createUserCodePair(username: string) {
    this.db.setToken(username, this.generateRandomNumber().toString());
  }
  async checkUserCodePair(username: string, token: string): Promise<boolean> {
    const real_token = await this.db.getToken(username);
    const does_tokens_match = token === real_token;
    if (does_tokens_match) {
      this.db.deleteToken(username);
    }
    return does_tokens_match;
  }
}

export const twofa = new TwoFA(new redis(null));
