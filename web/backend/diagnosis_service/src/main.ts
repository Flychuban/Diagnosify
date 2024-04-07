import express, { Request, Response } from 'express';
import cors from 'cors';
import { db, IDB } from './db_repo';

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.post(
  '/diag/user/:userId/diagnoses',
  async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const newDiagnosis = await db.createDiagnosis(userId, req.body);
      return res.status(200).json(newDiagnosis);
    } catch (error) {
      console.error(error);
      return res.status(404).json({ error: error.message });
    }
  },
);

app.get('/diag/user/:userId/diagnoses', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId);
    const diagnoses = await db.getUserDiagnoses(userId);
    res.json(diagnoses);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post(
  '/diag/diagnoses/:diagnosisId/vote',
  async (req: Request, res: Response) => {
    try {
      const diagnosisId = parseInt(req.params.diagnosisId);
      const userId = parseInt(req.body.userId);
      const vote = req.body.vote;
      await db.vote(diagnosisId, userId, vote);
      res.status(200).json({ message: 'Vote recorded successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },
);

app.get('/diag/diagnoses/:diagnosisId', async (req: Request, res: Response) => {
  try {
    const diagnosisId = parseInt(req.params.diagnosisId);
    const diagnosis = await db.getDiagnosis(diagnosisId);
    return res.status(200).json(diagnosis);
  } catch (e) {
    console.error(e);
    return res.status(404).json({ error: 'Diagnosis not found' });
  }
});

app.get('/diag/diagnoses', async (req: Request, res: Response) => {
  try {
    const diagnoses = await db.getAllDiagnoses();
    res.status(200).json(diagnoses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/diag/diagnoses/training', async (req: Request, res: Response) => {
  try {
    await db.getDiagnosesForModelTraining();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/diag/user/new', async (req: Request, res: Response) => {
  try {
    const newUser = await db.createUser(req.body.userId, req.body.username);
    return res.status(200).json(newUser);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
