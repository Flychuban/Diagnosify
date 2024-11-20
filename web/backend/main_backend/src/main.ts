import express, { Request, Response } from 'express';
import cors from 'cors';

import { db } from './db_repo';
import { userRouter } from './routes/users';
import { votingRouter } from './routes/votings';
import { diagnosisRouter } from './routes/diagnoses';
const app = express();
const port = 3003;

app.use(express.json());
app.use(cors());


// User Routes

// Voting Routes

// Combine Routers under /diag
const diagRouter = express.Router();
diagRouter.use('/diagnosis', diagnosisRouter);
diagRouter.use('/user', userRouter);
diagRouter.use('/voting', votingRouter);

app.use('/diag', diagRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
