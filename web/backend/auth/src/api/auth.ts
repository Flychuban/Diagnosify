import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { DB, IDB } from '../db_clients/auth_repository';
import { hasher } from '../hasher';
import { twofa } from '../TwoFA';

const app = express();
app.use(cors());
const PORT = 8080;

const JWT_SECRET_KEY = process.env.JWT_SECRET || 'hihi';

//! TODO introduce async bcrypt to improve performance

const db: IDB = new DB();
app.use(bodyParser.json());

app.post('/auth/login', async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const User = await db.get_user(username); //*TODO
    if (User === null) {
      return res.status(404).json({ err: 'User not found' });
    }

    // const isPasswordValid = hasher.validate_password(password, User.password);
    // if (!isPasswordValid) {
    //   return res
    //     .status(401)
    //     .json({ error: 'User not found or invalid credentials' });
    // }
    // twofa.createCode(User.username); // npt awaiting since we just need to fire an event
    // res.status(201).json("sent 2fa")

    const token = jwt.sign({ username }, JWT_SECRET_KEY);
    return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/auth/signup', async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const createUserResult: { success: boolean; message?: string } =
      await db.create_user(username, hasher.hash_password(password));

    if (createUserResult.success) {
      res.status(201).json({ message: 'User created successfully' });
    } else {
      res.status(400).json({ error: createUserResult.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/testing_route', (req: Request, res: Response) => {
  return res.status(201).json(jwt.verify(req.body.token, JWT_SECRET_KEY));
});

//app.post;

