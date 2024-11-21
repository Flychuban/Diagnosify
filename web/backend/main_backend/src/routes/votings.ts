import  express,{Request, Response} from 'express';
import { db } from '../db_repo';



export const votingRouter = express.Router();

votingRouter.post(
  '/diagnoses/:diagnosisId/vote',
  async (
    req: Request<{ diagnosisId: string }, {}, { userId: number; vote: boolean }>,
    res: Response<{ wasVotingSuccessful: boolean }>
  ) => {
    try {
      const diagnosisId = parseInt(req.params.diagnosisId);
      const userId = req.body.userId; 
      const vote = req.body.vote;
      await db.votings.vote(diagnosisId, userId, vote);
      res.status(200).json({ wasVotingSuccessful: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message } as any);
    }
  }
);
