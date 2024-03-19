import { redis, TwoFADB } from './db_clients/tokens_2fa_repository';

class TwoFA {
  //two factor auth
  private db;
  constructor(db: TwoFADB) {
    this.db = db;
  }
  generateCode() {
    function getRandomInt(min: number, max: number) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    return getRandomInt(1, 1000);
  }
  createCode(username: string) {
    this.db.set(username, this.generateCode());
  }
  checkUserAgainstCode() {}
}

export const twofa = new TwoFA(new redis(null));
