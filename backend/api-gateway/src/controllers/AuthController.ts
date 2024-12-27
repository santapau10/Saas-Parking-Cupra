// controllers/AuthController.ts

import { Request, Response } from 'express';
import FirestoreUserRepository from '../repositories/FirestoreUserRepository';
import { User } from '../models/user.model';
import FirebaseTenantRepository from '../repositories/FirestoreTenantRepository';

const userRepository = new FirestoreUserRepository();
const tenantRepository = new FirebaseTenantRepository();

class AuthController {
  static async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = new User(req.body.username, req.body.password, req.body.tenant_id, req.body.email)
      const userId = await userRepository.create(newUser, false);

      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error });
    }
  }
  static async registerTenant(req: Request, res: Response): Promise<void> {
    try {
      const tenant = await tenantRepository.create(req.body.name, req.body.plan);
      const newUser = new User(req.body.name, req.body.password, tenant, req.body.email)
      const userId = await userRepository.create(newUser, true);
      res.status(201).json({ message: 'Tenant registered successfully', userId });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error });
    }
  }
  static async login(req: Request, res: Response): Promise<void> {
      try {
        if (!req.body.token) {
          res.status(400).json({ message: 'El token es requerido' });
          return;
        }
        const userInfo = await userRepository.login(req.body.token);
        res.status(200).json({
          message: 'Login exitoso',
          user: {
            userId: userInfo.userId,
            role: userInfo.role,
          },
        });
      } catch (error) {
        if (error instanceof Error) {
          res.status(401).json({ message: error.message });
        } else {
          res.status(500).json({ message: 'Error inesperado al iniciar sesión', error: String(error) });
        }
      }
    }
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Logout failed', error: error });
    }
  }
}

export default AuthController;
