import bodyParser from 'body-parser';
import express, { Request, Response } from 'express';
import cors from 'cors';

import { db } from './db/db';
import { userRouter } from './routes/users';
import { votingRouter } from './routes/votings';
import { diagnosisRouter } from './routes/diagnoses';
import { chatRouter } from './routes/chat';
const app = express();
const port = 3003;

app.use(bodyParser.json())
app.use(cors());
app.use((req, res, next) => {
  console.log("req recieved")
  next()
})

const diagRouter = express.Router();
diagRouter.use('/diagnosis', diagnosisRouter);
diagRouter.use('/user', userRouter);
diagRouter.use('/voting', votingRouter);
diagRouter.use('/chat', chatRouter)




app.use("/diag",diagRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
