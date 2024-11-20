import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import axios, { AxiosRequestConfig } from 'axios';
import { API } from './api';
import {  getConfig, getServiceUrl  } from './utils';

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
      const config = await getConfig()
      console.log("kolok", config)


      try{
        const targetUrl = getServiceUrl(parsedUrl, config);
        const axiosConfig: AxiosRequestConfig = {
          method: req.method,
          url: targetUrl,
          data: req.body,
          headers: {
            accept: req.headers.accept as string,
            'User-Agent': req.headers['user-agent'] as string,
          },
        };

        console.log('Target URL:{' + targetUrl + "}");

        if (!targetUrl) {
          res.status(404).send('Service not found\n');
          return;
        }

        console.log('----------------------------------------------------------------');


        console.log("huiiii")
        const response = await api.sendReq(axiosConfig);
        
        console.log("huiiii")
        res.status(response.status).send(response.data);
              } catch (e) {
        console.log("service not found")
        res.status(404).json({err: "serviceNotFound"})
        return
      }
    });

    // Start the server
    this.app.listen(this.port, () => {
      console.log(`Gateway listening on port ${this.port}`);
    });
  }
}
