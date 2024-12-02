
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import { API } from './api';
import { getConfig, getServiceUrl } from './utils';

export class Gateway {
  private app: Application;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;

    // Core middleware
    this.app.use(cors());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }

  /**
   * Adds middleware to the Express application.
   * @param handler Middleware handler function.
   */
  public addMiddleware(handler: (req: Request, res: Response, next: NextFunction) => void): void {
    this.app.use(handler);
  }

  /**
   * Starts the Express server.
   */
  public start(api: API): void {
    this.app.all('*', async (req: Request, res: Response) => {
      console.log('----------------------------------------------------------------');
      const parsedUrl = req.url;

      console.log('Requested URL:', parsedUrl);
      console.log('Request Body:', req.body);
      console.log('Request Method:', req.method);

      try {
        const config = await getConfig();
        const targetUrl = getServiceUrl(parsedUrl, config);
        console.log('Target URL: {' + targetUrl + '}');

        if (!targetUrl) {
          res.status(404).send('Service not found\n');
          return;
        }

        // Axios configuration
        const axiosConfig: AxiosRequestConfig = (() => {
          if (req.is('multipart/form-data')) {
            const formData = new FormData();

            // Add form fields
            for (const key in req.body) {
              if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                formData.append(key, req.body[key]);
              }
            }

            // Add files if using multer or similar middleware
            if (req.files) {
              for (const file of req.files as Express.Multer.File[]) {
                formData.append(file.fieldname, file.buffer, {
                  filename: file.originalname,
                  contentType: file.mimetype,
                });
              }
            }

            return {
              method: req.method,
              url: targetUrl,
              data: formData,
              headers: {
                ...formData.getHeaders(),
                accept: req.headers.accept as string,
                'User-Agent': req.headers['user-agent'] as string,
              },
            };
          } else {
            return {
              method: req.method,
              url: targetUrl,
              data: req.body,
              headers: {
                accept: req.headers.accept as string,
                'User-Agent': req.headers['user-agent'] as string,
              },
            };
          }
        })();

        console.log('----------------------------------------------------------------');

        // Send request using API wrapper
        const response = await api.sendReq(axiosConfig);

        res.status(response.status).send(response.data);
      } catch (e) {
        console.error('Service not found or request error:', e);
        res.status(500).json({ error: 'Internal Server Error', details: e });
      }
    });

    // Start the server
    this.app.listen(this.port, () => {
      console.log(`Gateway listening on port ${this.port}`);
    });
  }
}

