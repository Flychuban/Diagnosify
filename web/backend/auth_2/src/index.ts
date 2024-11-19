import express from 'express';
import bodyParser from 'body-parser';
import { SessionsManager } from './session';

const app = express();
app.use(bodyParser.json())

const authRouter = express.Router();
const sessions = new SessionsManager()
// potentially vulnerable to sniffing attacks if the thread actor gets to the inside infra 

// not the best design but this service is more suited for grpc but dont want to set it up for something so small
authRouter.post(
  "/checkIfTokenBelongsToUser",
  (
    req: express.Request<{}, {exists: boolean}, { token: string, username: string }>, 
    res
  ) => {
    const username = req.body.username;
    const token = req.body.token;

    // Check if token belongs to the user
    const exists = sessions.checkIfTokenBelongsToUser(username, token);

    res.json({ exists });
      return;
  }
);


authRouter.post("/issueNewTokenForUser", (req: express.Request<{}, {}, {username: string}>, res) => { 
    try {
        sessions.issueNewTokenForUser(req.body.username) 
        res.status(200);
    }
    catch(err) {
        console.error(err)
        res.status(500).json({ error: err })
    }

})

authRouter.post(
  "/doesToken",
  (req: express.Request<{}, {}, { token: string }>, res) => {
    res.json(sessions.tokenExists(req.body.token));
  }
);

app.use("/auth", authRouter);




const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});