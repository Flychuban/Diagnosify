import axios from "axios";
import { API } from "./api";
import { Gateway } from "./gateway";

// Initialize and start the Gateway
const api = new API();
const gateway = new Gateway(7000);

// Add custom middleware dynamically
gateway.addMiddleware((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

const authServiceUrl = process.env.AUTH_SERVICE_URL 
if (authServiceUrl === undefined) {
  throw new Error("no auth service url found`")
} 


gateway.addMiddleware(async (req, res, next) => {
      if (req.path.includes('auth')) {
        next();
      } else {
        const authHeader: string | undefined = req.headers['authorization']?.split(' ')[1]
        if (authHeader === undefined) {
          res
            .status(401)
            .json({ msg: 'Unauthorized\n, missing token but it is required for route: {' + req.path + "}" });
          return;
        }
        const tokenExists = await axios.post<{token: string}>(`${authServiceUrl}/doesTokenExist`, {
          token:authHeader 
        })
        
        if (!tokenExists) { 
          res
           .status(401)
           .json({ msg: 'Unauthorized\n, invalid token' });
          return;
        }

        next();

      }
    });



// Start the server
gateway.start(api);

