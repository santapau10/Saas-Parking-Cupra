import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

/**
 * Middleware para verificar roles basados en los custom claims de Firebase.
 * @param allowedRoles - Lista de roles permitidos para la ruta.
 */
export const verifyRole = (allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided or invalid format' });
      return;
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.role || !allowedRoles.includes(decodedToken.role)) {
        res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
        return;
      }

      // req.user = {
      //   uid: decodedToken.uid,
      //   email: decodedToken.email,
      //   role: decodedToken.role,
      //   tenantId: decodedToken.tenantId || null,
      // };

      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      res.status(403).json({ message: 'Forbidden: Invalid or expired token' });
    }
  };
};
