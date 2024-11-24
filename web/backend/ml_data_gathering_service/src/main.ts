import bodyParser  from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import AWS from "aws-sdk"

enum requestCompletionStatus{
  OK,
  ERRORED
}

const app = express()
app.use(cors())
app.use(bodyParser.json());
const { S3_USER_CLIENT, S3_USER_SECRET, S3_BUCKET_NAME, S3_REGION } =
  process.env;

if (!S3_USER_CLIENT || !S3_USER_SECRET || !S3_BUCKET_NAME || !S3_REGION) {
  throw new Error("Missing required S3 environment variables");
}

const s3 = new AWS.S3({
  accessKeyId: S3_USER_CLIENT,
  secretAccessKey: S3_USER_SECRET,
  region: S3_REGION,
});

const dataCollectionRouter = express.Router();

function createRoute<T>(route: string, handler: (data: T) => { status: requestCompletionStatus, err?: string, dataForS3Upload?: { Bucket: string,Key: string, Body: Buffer, ContentType: string } }) {
  dataCollectionRouter.post(route,async (req: express.Request<{}, {}, T>, res: express.Response<{ status: requestCompletionStatus, err: string | null }>) => {
    const result = handler(req.body);
    if (result.status === requestCompletionStatus.OK) {

      const uploadResult = await s3.upload(result.dataForS3Upload).promise();
      res.status(200).json({ status: requestCompletionStatus.OK, err: null });
      return;
    } else {
      res.status(500).json({ status: requestCompletionStatus.ERRORED, err: result.err });
      return
    }
  })
}

function generateFileName() {
  const timestamp = new Date().getTime();
  return `${timestamp}.json`;
}

createRoute<{Pregnancies: string,
    Glucose: string,
    BloodPressure: string,
    SkinThickness: string,
    Insulin: string,
    BMI: string,
    DiabetesPedigreeFunction: string,
  Age: string
}>("/diabetes", (data => {
     try {

        if (!data) {
          return { status: requestCompletionStatus.ERRORED, err: "Data is missing" };
        }

        // Create an in-memory file using Buffer
        const fileBuffer = Buffer.from(JSON.stringify(data), 'utf-8');

        // Upload to S3
        const params = {
            Bucket: S3_BUCKET_NAME,
            Key: `diag/diabetes/${generateFileName()}`, // File name in S3
            Body: fileBuffer,
            ContentType: 'text/plain',
            ACL: "public-read",
        };

        return { status: requestCompletionStatus.OK, dataForS3Upload: params };
    } catch (error) {
        console.error('Upload error:', error);
      return { status: requestCompletionStatus.ERRORED, err: error };
     } 
}))
    

app.use("/data", dataCollectionRouter)

const port = 4001
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})