import express,{ Express, Request, Response } from "express";

import { db } from '../db_repo';

export const userRouter = express.Router();

userRouter.post(
  '/new',
  async (
    req: Request<{}, {}, { userId: number; username: string }>,
    res: Response<{ isCreatedSuccessfully: boolean }>,
  ) => {
    try {
      await db.users.create(req.body.userId, req.body.username);
      return res.status(201).json({ isCreatedSuccessfully: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message } as any);
    }
  },
);