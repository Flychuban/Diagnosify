import express,{Request, Response} from 'express';
import { Diagnosis, Prisma } from '@prisma/client';
import { db, NewDiagnosisInfo } from '../db_repo';



export const diagnosisRouter = express.Router();
diagnosisRouter.post(
  '/user/:userId/diagnoses',
  async (
    req: Request<{ userId: string }, {}, NewDiagnosisInfo>,
    res: Response<Diagnosis>
  ) => {
    try {
      const userId = parseInt(req.params.userId);
      const newDiagnosis = await db.diagnoses.create(userId, req.body);
      return res.status(201).json(newDiagnosis);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: error.message } );
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
      res.status(500).json({ error: error.message } );
    }
  }
);
diagnosisRouter.get(
  '/diagnoses/:diagnosisId',
  async (
    req: Request<{ diagnosisId: string }>,
    res: Response<({
    voting: ({
        voters: {
            id: number;
            username: string;
        }[];
    } & {
        id: number;
        yes: number;
        no: number;
        diagnosisId: number;
    }) | null;
} & {
    id: number;
    type: string;
    userId: number;
    prediction: boolean;
    raw_data: Prisma.JsonValue;
    is_correct: boolean | null;
}) | null>
  ) => {
    try {
      const diagnosisId = parseInt(req.params.diagnosisId);
      const diagnosis = await db.diagnoses.get(diagnosisId);
      if (!diagnosis) {
        return res.status(404).json({ error: 'Diagnosis not found' } );
      }
      return res.status(200).json(diagnosis);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message } );
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
      res.status(500).json({ error: error.message });
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
      return res.status(500).json({ error: error.message } );
    }
  }
);
