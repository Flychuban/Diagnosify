import bodyParser  from 'body-parser';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import AWS from "aws-sdk"
import multer from "multer"
import { buffer } from 'stream/consumers';
enum requestCompletionStatus{
  OK,
  ERRORED
}

const app = express()
app.use(cors())
app.use(bodyParser.json());
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.use((req, res, next) => {
  console.log('Request received:', req.method, req.url);
  next();
})
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

type ApiResponse = { err: string } | { link_to_data_blob_which_holds_prediction_params: string }

function createRoute<T>(
  route: string,
  handler: (data: T) => { status: requestCompletionStatus, err?: string, dataForS3Upload?: { Bucket: string, Key: string, Body: Buffer, ContentType: string } }
) {
  dataCollectionRouter.post(route, async (req: express.Request<{}, {}, T>, res: express.Response<ApiResponse>) => {
    const result = handler(req.body);
    if (result.status === requestCompletionStatus.OK) {

      const uploadResult = await s3.upload(result.dataForS3Upload).promise();
      res.status(200).json({link_to_data_blob_which_holds_prediction_params: uploadResult.Location})
      return;
    } else {
      res.status(500).json({ err: result.err });
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
        console.log("handling req")
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

function createRouteForTextDataResponseData<T>(diseaseName: string) {
  createRoute<T>(`/${diseaseName}`, (data) => {
    try {
      if (!data) {
        return { status: requestCompletionStatus.ERRORED, err: "Data is missing" };
      }

      const fileBuffer = Buffer.from(JSON.stringify(data), 'utf-8')

      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: `diag/${diseaseName}/${generateFileName()}`,
        Body: fileBuffer,
        ContentType: 'text/plain',
        ACL: "public-read",
      }

      return { status: requestCompletionStatus.OK, dataForS3Upload: params };

    } catch (err) {
      return { status: requestCompletionStatus.ERRORED, err: err };
    }
  })
}

createRouteForTextDataResponseData("liver-disease")
createRouteForTextDataResponseData("breast-cancer")
createRouteForTextDataResponseData("parkinson")
createRouteForTextDataResponseData("heart-disease")
createRouteForTextDataResponseData("kidney-disease")
createRouteForTextDataResponseData("bodyfat")

dataCollectionRouter.post(
  "/cancer-segmentation",
  upload.single('data'), // Add multer middleware here
  async (req, res: express.Response<ApiResponse>) => {
    try {
      if (!req.file) { // Correct the check
        return res.status(400).json({ err: "File not found" });
      }

      const params = {
        Bucket: S3_BUCKET_NAME,
        Key: `diag/cancer-segmentation/${generateFileName()}`,
        Body: req.file.buffer, // Use file buffer
        ContentType: req.file.mimetype, // Ensure correct content type
        ACL: "public-read",
      };

      const uploadResult = await s3.upload(params).promise();

      res.status(200).json({ link_to_data_blob_which_holds_prediction_params: uploadResult.Location });
    } catch (e) {
      res.status(500).json({ err: e.message });
    }
  }
);

app.post("/canc",upload.single('data'), async (req: Request<{file: File}, {}, {file: File}>, res) => { 
  try {
    console.log("hit endpoint")
    console.log("data",req.file)
    if (!req.file) {
      res.status(500).json({ err: "file not found"})
    }

   const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `diag/predictions/${JSON.stringify(new Date())}`,
      Body: req.file.buffer,
      ContentType: req.filter.mimetype,
      ACL: "public-read"
    }


    const uploadResult = await s3.upload(params).promise();

    res.status(200).json({ s3_loc: uploadResult.Location})

    return 


  } catch (e) {
    console.log(e)
    res.status(500).json({err: e})
  }
})


function ImageDataTextReposnseHandler(diseaseEndpoint: string) {

  app.post(`/${diseaseEndpoint}`, upload.single('data'),(req: Request<{ file: File },{},{}>, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }


    const params = {
      Bucket: S3_BUCKET_NAME,
      Key: `diag/${diseaseEndpoint}/${JSON.stringify(new Date())}`,
      Body: req.file.buffer,
      ContentType: req.filter.mimetype,
      ACL: "public-read",
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error uploading file to S3" });
      }
      return res.status(200).json({ link_to_data_blob_which_holds_prediction_params: data.Location });
    });
  })
}


ImageDataTextReposnseHandler("pneumonia")
ImageDataTextReposnseHandler("malaria")




app.use("/data", dataCollectionRouter)

const port = 4001
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})