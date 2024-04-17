import dotenv from 'dotenv';
import mongoose, { Document, Schema } from 'mongoose';

dotenv.config();

const uri: string = process.env.MONGO_URI || '';
console.log("debug",uri)
mongoose.connect(uri);

interface IUser extends Document {
  username: string;
  password: string;
  has_2fa: boolean;
  id: number;
}

const userSchema: Schema = new Schema({
  username: String,
  password: String,
  has_2fa: Boolean,
  id: Number,
});

const User = mongoose.model<IUser>('User', userSchema);

interface IDB {
  get_user(username: string): Promise<IUser | null>;
  create_user(
    username: string,
    password: string,
  ): Promise<{ success: boolean; message?: string; newUser: IUser }>;
}

class DB implements IDB {
  constructor() {}

  async get_user(username: string): Promise<IUser | null> {
    try {
      const user: IUser | null = await User.findOne({ username });
      return user;
    } catch (error) {
      console.error('Error checking for user:', error);
      return null;
    }
  }

  async create_user(
    username: string,
    password: string,
  ): Promise<{ success: boolean; message?: string; newUser: IUser }> {
    try {
      const allUsers = await User.find({});

      const newId = allUsers.length > 0 ? allUsers.length + 1 : 1;

      const newUser = new User({
        username,
        password,
        has_2fa: false,
        id: newId,
      });

      await newUser.save();

      return {
        success: true,
        message: 'User created successfully',
        newUser,
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, message: 'Error creating user' };
    }
  }
}

export { DB };
