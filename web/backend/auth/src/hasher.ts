import bcrypt from 'bcrypt';

interface IPasswordHasher {
  validate_password(password: string, hashed_password: string): boolean;
  hash_password(password: string): string;
}

export class PasswordHasher implements IPasswordHasher {
  validate_password(password: string, hashed_password: string): boolean {
    return bcrypt.compareSync(password, hashed_password);
  }
  hash_password(password: string): string {
    const saltLentgh = 7;

    try {
      const salt = bcrypt.genSaltSync(saltLentgh); // async is best practice but using sync to not introduce unnecessary complexity if it needs debugging in thye future
      const hashedPassword = bcrypt.hashSync(password, salt);

      return hashedPassword;
    } catch (err) {
      throw new Error('checkout the error logged above');
    }
  }
}

export const hasher: IPasswordHasher = new PasswordHasher();
