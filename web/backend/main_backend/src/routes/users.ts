import express,{ Express, Request, Response } from "express";

import { db } from '../db_repo';
import { User } from "@prisma/client";

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

userRouter.get(
  '/:username',
async  (req: Request<{username: string}, {}, {}>, res: Response<{user: User | null}>) => {
  try {
  
    const user = await db.users.get(
      {
        username: req.params.username,
        userId: null
      }
    )
    return res.status(200).json({user})
    } catch (e) { 
      return res.status(404).json({error: e.message} as any)
    }
  }
)