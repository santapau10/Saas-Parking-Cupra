import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export class AuthMiddleware {//
  private static JWT_SECRET = 'your_secret_key'; // Asegúrate de que es la misma usada para firmar el token

  static verifyToken(req: Request, res: Response, next: NextFunction): void {
    try {//
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Authorization header missing or invalid' });
        return;
      }

      const token = authHeader.split(' ')[1];

      const decoded = jwt.verify(token, AuthMiddleware.JWT_SECRET) as JwtPayload;

      req.body.authData = decoded;

      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  }
}
