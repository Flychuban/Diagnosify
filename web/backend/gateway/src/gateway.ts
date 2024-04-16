import express, { Request, Response } from 'express';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
const config = JSON.parse(process.env.CONFIG);
console.log(config)
class API {
  private getIndexAfterServiceName(subRoute: string): number {
    for (let i = 1; i < subRoute.length; i += 1) {
      if (subRoute[i] === '/') {
        return i;
      }
    }
    return subRoute.length;
  }

  public getServiceUrl(subRoute: string): string | null {
    const serviceName = subRoute.slice(
      1,
      this.getIndexAfterServiceName(subRoute),
    );
    return config[serviceName]?.redirect_url || null; // Use optional chaining and provide a default value
  }

  public async sendReq(reqConfig: AxiosRequestConfig): Promise<AxiosResponse> {
    try {
      const response = await axios(reqConfig);
      return response;
    } catch (error) {
      throw new Error(`Error sending request: ${error.message}`);
    }
  }
}

const api = new API();
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.all('*', async (req: Request, res: Response) => {
  const parsedUrl = req.originalUrl;

  console.log('Requested URL:', parsedUrl);
  console.log('Request Body:', req.body);
  console.log('Request Method:', req.method);

  const targetUrl = api.getServiceUrl(parsedUrl);
  console.log('Target URL:', targetUrl + parsedUrl);

  if (!targetUrl) {
    res.status(404).send('Service not found\n');
    return;
  }

  try {
    const axiosConfig: AxiosRequestConfig = {
      method: req.method as any, // You may need to cast to 'any' due to mismatch between HTTP methods in Express and Axios
      url: targetUrl + parsedUrl,
      data: req.body,
      headers: {
        accept: req.headers.accept as string,
        'User-Agent': req.headers['user-agent'] as string,
      },
    };
    console.log('before', axiosConfig);
    const response = await api.sendReq(axiosConfig);
    console.log('response', response);
    res.status(response.status).send(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error\n');
  }
});

const port = 7000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
