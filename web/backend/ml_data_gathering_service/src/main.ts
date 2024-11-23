import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

interface MLRoute {
  ml_type: string;
  data_collection_handler: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void;
}

function createExpressServer(
  mlRoutes: MLRoute[],
  port: number,
): express.Application {
  const app = express();
  app.use(cors());

  mlRoutes.forEach((route) => {
    app.post(`/ml/${route.ml_type}`, route.data_collection_handler);
  });

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });

  return app;
}

function create_ml_handler<T>(handler(request: express.Request, response: express.Response<{}>)) {

}


const handlers: MLRoute[] = [
  {
    ml_type: 'handler1`',
    data_collection_handler: (req: express.Request, res: express.Response) => {
      console.log('Received data for handler1:', req.body);
      res.send('Data received for handler1');
    },
  },
  {
    ml_type: 'handler2',
    data_collection_handler: (req, res) => {
      console.log('Received data for handler2:', req.body);
      res.send('Data received for handler2');
    },
  },
];

createExpressServer(handlers, 5000);
