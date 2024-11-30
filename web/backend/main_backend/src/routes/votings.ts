import  express,{Request, Response} from 'express';
import { db } from '../db/db';
import { Chat, Prisma, PrismaClient, Vote, Voting } from '@prisma/client';



export const votingRouter = express.Router();

votingRouter.post(
  '/:votingId/vote',
  async (
    req: Request<{ votingId: string }, {}, { userId: number; vote: boolean }>,
    res: Response<{ wasVotingSuccessful: boolean }>
  ) => {
    try {
      const votingId = parseInt(req.params.votingId);
      const userId = req.body.userId;
      const vote = req.body.vote;
      await db.votings.vote(votingId, userId, vote);
      res.status(200).json({ wasVotingSuccessful: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message } as any);
    }
  }
);

votingRouter.get(
  "/chat/:chatId",
  async (req: Request<{chatId: string}, {}, {}>, res: Response<{voting: object} | {error: string}>) => {
    const prisma = new PrismaClient()
    try {
      const chat = await (prisma).chat.findUnique({
        where: {
          id: parseInt(req.params.chatId),
        },
        include: {
          diagnosis: true,
        },
      })

      const voting = await prisma.diagnosis.findUnique({
        where: {
          id: chat?.diagnosis?.id,
        },
        include: {
          voting: {
            include: {
              votes: true,
            },
          },
        },
      })

      if (voting === null) {
        return res.status(404).json({ error: 'No diagnosis associated with the chat' })
      }

      await prisma.$disconnect()
      return res.status(201).json({ voting: voting })
    } catch (e) {
      console.error(e)

      await prisma.$disconnect()
      return res.status(500).json({ error: e.message})
    } finally{
    }
  }
)
// gets the vote of the user for the selected voting
votingRouter.get(
  "/:votingId/:userId",
async  (req: Request<{ votingId: string, userId: string }, {}, {}>, res: Response<{ vote: Vote } | {error: string}>) => {
  try {
    if (req.params.userId === undefined || req.params.userId === null || req.params.votingId === null || req.params.votingId === undefined) {
      res.status(405).json({ error: "userId or votingId is missing"})
      }
      const vote = await db.votings.getUserVote(req.params.votingId, req.params.userId)
      if (vote === null) {
        return res.status(404).json({ error: 'User did not vote or voting with this id does not exist' })
      }
      return res.status(200).json({ vote: vote})
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: err.message })
    }
  })
