import express, { Request, Response } from 'express';
import cors from 'cors';
import { db, IDB } from './db_repo'; // Assuming your DB class and IDB interface are in a file named db.ts

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get('/user/:id/diagnoses', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.id);
    const diagnoses = await db.get_user_diagnosises(userId);
    res.json(diagnoses);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.post('/diagnoses/verify/:id', async (req: Request, res: Response) => {
  const diag = await db.verify_diagnosis(req.params.id, req.body.label);
  res.status(200).json();
});

app.post('/user/:user_id/diagnoses', async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.user_id);
    const newDiagnosis = await db.create_new_diagnosis(userId, req.body);
    res.json(newDiagnosis);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

app.get('/diagnoses/training', async (req: Request, res: Response) => {
  try {
    await db.get_diagnosises_for_model_training();
    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/diagnoses/all', async (req: Request, res: Response) => {
  res.status(200).json();
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
