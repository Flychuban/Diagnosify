import express,{Request, Response} from 'express';
import { Diagnosis } from '@prisma/client';
import { db } from '../db_repo';



export const diagnosisRouter = express.Router();
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
