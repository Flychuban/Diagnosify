import dotenv from 'dotenv';
dotenv.config();
import mongoose, { Document, Schema } from 'mongoose';

const uri: string = process.env.MONGO_URI || '';
mongoose.connect(uri);

export interface IUser extends Document {
  username: string;
  password: string;
  has_2fa: boolean;
}

const userSchema: Schema = new mongoose.Schema({
  username: String,
  password: String,
  has_2fa: Boolean,
});

const User = mongoose.model('User', userSchema);

export interface IDB {
  get_user(username: string): Promise<IUser | null>;
  create_user(
    username: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }>;
}

class DB implements IDB {
  constructor() {}

  async get_user(username: string): Promise<IUser | null> {
    try {
      const user: IUser | null = await User.findOne({ username });
      return user; // Return true if the user is found, otherwise false
    } catch (error) {
      console.error('Error checking for user:', error);
      return null;
    }
  }

  async create_user(
    username: string,
    password: string,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const existingUser: IUser | null = await User.findOne({ username });
      if (existingUser) {
        return { success: false, message: 'Username already exists' };
      }

      const newUser = new User({ username, password, has_2fa: false });
      await newUser.save();

      return { success: true, message: 'User created successfully' };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, message: 'Error creating user' };
    }
  }
}

export { DB };
