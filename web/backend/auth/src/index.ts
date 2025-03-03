import express, { type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import { SessionsManager, type AuthToken } from './session';
import { db } from './db/db';
import { password } from 'bun';
type ErrorResponse = {
    error: string;
}

type BaseResponse<T> = T | ErrorResponse
const app = express();
app.use(bodyParser.json())

const authRouter = express.Router();
const sessions = new SessionsManager()
// potentially vulnerable to sniffing attacks if the thread actor gets to the inside infra 

// not the best design but this service is more suited for grpc but dont want to set it up for something so small
authRouter.post(
  "/checkIfTokenBelongsToUser",
  async (
    req: express.Request<{}, {exists: boolean}, { token: AuthToken, username: string }>, 
    res
  ) => {
    const username = req.body.username;
    const token = req.body.token;

    // Check if token belongs to the user
    const exists = await sessions.checkIfTokenBelongsToUser( token, username);

    res.json({ exists });
      return;
  }
);


authRouter.post("/issueNewTokenForUser", async(req: express.Request<{}, {}, { username: string }>, res: Response<BaseResponse<{authToken: AuthToken}>>) => { 
    try {
        const token = await sessions.issueNewTokenForUser(req.body.username) 
        res.status(200).json({ authToken: token })
    } catch(err) {
        console.error(err)
        res.status(500).json({ error: err.message })
    }

})

authRouter.post(
  "/doesTokenExist",
  (req: express.Request<{}, {}, { token: AuthToken }>, res: express.Response<{exists: boolean}>) => {
    const token = sessions.tokenExists(req.body.token) 
    res.status(200).json({exists: token});
  }
);


authRouter.post("/login", async (req: Request<{}, {}, {username: string, password: string}>, res: Response<BaseResponse<{token: AuthToken}>>) => {
  try{
    if (await db.userRepo.getUserPassword(req.body.username) === req.body.password) {
      res.status(200).json({
        token: await sessions.issueNewTokenForUser(req.body.username)
      })
      return
    }
    res.status(400).json({ error: "username or password is invalid" })
  } catch (e) {
	  console.log(e)
    res.status(404).json({msg: "user does not exist"})
  }
})


app.use("/auth", authRouter);





const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
