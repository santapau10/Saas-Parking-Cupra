import { Request, Response, NextFunction } from "express";
import axios from "axios";

export const validateTokenMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ error: "Authorization header missing" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Token missing" });
      return;
    }

    const validationServiceURL = req.hostname;
    if (!validationServiceURL) {
      res.status(500).json({ error: "Validation service URL not configured" });
      return;
    }

    const response = await axios.post(
      `${validationServiceURL}/api-gateway/verify-token`,
      { 
        parkingId: req.params.parking 
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );


    if (response.status !== 200) {
      res.status(401).json({ error: "Token validation failed" });
      return;
    }

    next();
  } catch (error: any) {
    console.error("Error validating token:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
