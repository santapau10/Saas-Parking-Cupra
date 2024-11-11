import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Acceso no autorizado' });
  }

  try {
    const decoded: any = jwt.verify(token, 'secreto'); // 'secreto' debe ser una variable de entorno
    req.userId = decoded.userId; // Decodificamos y almacenamos el `userId` en el request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

export default authenticate;
