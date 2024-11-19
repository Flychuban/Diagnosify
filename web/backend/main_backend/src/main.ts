import express, { Request, Response } from 'express';
import cors from 'cors';
import { db } from './db_repo';
import { Diagnosis } from '@prisma/client';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

// Diagnosis Routes
const diagnosisRouter = express.Router();

diagnosisRouter.post(
  '/user/:userId/diagnoses',
  async (
    req: Request<{ userId: string }, {}, { verified_prediction_status?: boolean; [key: string]: any }>,
    res: Response<Diagnosis>
  ) => {
    try {
      const userId = parseInt(req.params.userId);
      const newDiagnosis = await db.diagnoses.create(userId, req.body);
      if (req.body.verified_prediction_status !== undefined) {
        await db.diagnoses.verify(newDiagnosis.id, req.body.verified_prediction_status);
      }
      return res.status(201).json(newDiagnosis);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message } as any);
    }
  }
);

diagnosisRouter.get(
  '/user/:userId/diagnoses',
  async (
    req: Request<{ userId: string }>,
    res: Response<{ diagnoses: Diagnosis[] }>
  ) => {
    try {
      const userId = parseInt(req.params.userId);
      const diagnoses = await db.users.getDiagnoses(userId);
      res.status(200).json({ diagnoses });
    } catch (error) {
      res.status(500).json({ error: error.message } as any);
    }
  }
);

diagnosisRouter.get(
  '/diagnoses/:diagnosisId',
  async (
    req: Request<{ diagnosisId: string }>,
    res: Response<{ diagnosis: Diagnosis }>
  ) => {
    try {
      const diagnosisId = parseInt(req.params.diagnosisId);
      const diagnosis = await db.diagnoses.get(diagnosisId);
      if (!diagnosis) {
        return res.status(404).json({ error: 'Diagnosis not found' } as any);
      }
      return res.status(200).json({ diagnosis });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message } as any);
    }
  }
);

diagnosisRouter.get(
  '/diagnoses',
  async (
    req: Request,
    res: Response<{ diagnoses: Diagnosis[] }>
  ) => {
    try {
      const diagnoses = await db.diagnoses.getAll();
      res.status(200).json({ diagnoses });
    } catch (error) {
      res.status(500).json({ error: error.message } as any);
    }
  }
);

diagnosisRouter.get(
  '/ml/get_verified_data',
  async (
    req: Request,
    res: Response<{ data: any }> // Replace `any` with the specific type if known
  ) => {
    try {
      const data = await db.diagnoses.getForModelTraining();
      return res.status(200).json(data);
    } catch (error) {
      return res.status(500).json({ error: error.message } as any);
    }
  }
);

// User Routes
const userRouter = express.Router();

userRouter.post(
  '/new',
  async (
    req: Request<{}, {}, { userId: number; username: string }>,
    res: Response<{ isCreatedSuccessfully: boolean }>
  ) => {
    try {
      await db.users.create(req.body.userId, req.body.username);
      return res.status(201).json({ isCreatedSuccessfully: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message } as any);
    }
  }
);

// Voting Routes
const votingRouter = express.Router();

votingRouter.post(
  '/diagnoses/:diagnosisId/vote',
  async (
    req: Request<{ diagnosisId: string }, {}, { userId: number; vote: boolean }>,
    res: Response<{ wasVotingSuccessful: boolean }>
  ) => {
    try {
      const diagnosisId = parseInt(req.params.diagnosisId);
      const userId = parseInt(req.body.userId);
      const vote = req.body.vote;
      await db.votings.vote(diagnosisId, userId, vote);
      res.status(200).json({ wasVotingSuccessful: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message } as any);
    }
  }
);

// Combine Routers under /diag
const diagRouter = express.Router();
diagRouter.use('/diagnosis', diagnosisRouter);
diagRouter.use('/user', userRouter);
diagRouter.use('/voting', votingRouter);

app.use('/diag', diagRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
