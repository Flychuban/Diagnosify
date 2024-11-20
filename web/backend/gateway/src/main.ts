import axios from "axios";
import { API } from "./api";
import { Gateway } from "./gateway";

// Initialize and start the Gateway
const api = new API();
const gateway = new Gateway(7000);
const authServiceUrl = process.env.AUTH_SERVICE_URL;

if (!authServiceUrl) {
  throw new Error("No AUTH_SERVICE_URL found");
}

// Add custom middleware dynamically
gateway.addMiddleware((req, res, next) => {
  try {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  } catch (err) {
    console.error("Error in logging middleware:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

gateway.addMiddleware(async (req, res, next) => {
  try {
    if (req.path.includes("auth")) {
      next();
    } else {
      const authHeader: string | undefined = req.headers["authorization"]?.split(" ")[1];
      console.log("head",authHeader)
      if (!authHeader) {
        res.status(401).json({
          msg: `Unauthorized: Missing token, but it is required for route: {${req.path}}`,
        });
        return;
      }

      try {
        const tokenExists = await axios.post< boolean>(
          `${authServiceUrl}/auth/doesTokenExist`,
          { token: authHeader }
        );
        console.log(tokenExists.data)
        if (!tokenExists.data) {
          res.status(401).json({ msg: "Unauthorized: Invalid token" });
          return;
        }

        next();
      } catch (err) {
        console.error("Error verifying token:", err);
        res.status(500).json({ msg: "Internal Server Error: Token verification failed" });
      }
    }
  } catch (err) {
    console.error("Error in authentication middleware:", err);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

// Start the server
try {
  gateway.start(api);
  console.log(`Gateway started on port ${gateway.port}`);
} catch (err) {
  console.error("Error starting the gateway:", err);
  process.exit(1); // Exit with error
}
