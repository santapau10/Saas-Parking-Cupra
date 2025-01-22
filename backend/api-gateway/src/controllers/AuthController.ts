// controllers/AuthController.ts

import { Request, Response } from 'express';
import FirestoreUserRepository from '../repositories/FirestoreUserRepository';
import { User } from '../models/user.model';
import FirebaseTenantRepository from '../repositories/FirestoreTenantRepository';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const userRepository = new FirestoreUserRepository();
const tenantRepository = new FirebaseTenantRepository();

class AuthController {
  static async registerUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = new User(req.body.username, req.body.password, req.body.tenant_id, req.body.email, req.body.role)
      const userId = await userRepository.create(newUser, false);

      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error });
    }
  }
  static async registerTenant(req: Request, res: Response): Promise<void> {
    try {
      const tenant = await tenantRepository.create(req.body.name, req.body.plan);
      const newUser = new User(req.body.name, req.body.password, tenant, req.body.email, 'admin');
      const {token, userId} = await userRepository.create(newUser, true);
      const payload = {
        tenant,
        role:'admin',
        issuedAt: new Date().toISOString(),
      };
      const newToken = jwt.sign(payload, AuthController.JWT_SECRET, { expiresIn: '2h' });

      console.log(`Tenant created: `, tenant, `User created: `, userId);
      await tenantRepository.setUid(tenant, userId);
      if (req.body.plan === 'enterprise') {
        await axios.post('https://api.github.com/repos/santapau10/Saas-Parking-Cupra/actions/workflows/gke-install.yaml/dispatches', {
            ref: 'main',  // Asegúrate de incluir la referencia, como en el ejemplo de curl
            inputs: {
                namespace: tenant
            }
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });


        console.log(`GitHub Action triggered for tenant: ${req.body.name}`);//
      }

      // Responder con el éxito
      res.status(201).json({ message: 'Tenant registered successfully', newToken, userId });
    } catch (error) {
      // Manejo de errores
      res.status(500).json({ message: 'Registration failed', error: error });
    }
  }
  static async getTenantInfo(req: Request, res: Response): Promise<void> {
    try {
      const tenantId = req.params.tenantId;
      const tenant = await tenantRepository.get(tenantId);

      res.status(201).json({ message: 'Tenant info retrieved  successfully', tenant });
    } catch (error) {
      res.status(500).json({ message: 'Tenant retrieve failed', error: error });
    }
  }
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Logout failed', error: error });
    }
  }
  static async getTenantFromUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const tenantId = await userRepository.getTenant(userId);
      const tenant = await tenantRepository.get(tenantId);
      res.status(201).json({ message: 'Tenant retrieved successfully', tenant });
    } catch (error) {
      res.status(500).json({ message: 'Tenant retrieve failed', error: error });
    }
  }
  static async getUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.userId;
      const user = await userRepository.get(userId);
      res.status(201).json({ message: 'User retrieved successfully', user });
    } catch (error) {
      res.status(500).json({ message: 'User retrieve failed', error: error });
    }
  }
  static async setTheme(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.body.tenantId;
      const theme = req.body.theme;
      await tenantRepository.setTheme(userId, theme);
      res.status(201).json({ message: 'Theme updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Theme update failed', error: error });
    }
  }
  private static readonly JWT_SECRET = 'your_secret_key';
  static async getToken(req: Request, res: Response): Promise<void> {
    try {
      const { tenant, role } = req.body;
      if (!tenant || !role) {
        res.status(400).json({ message: 'Tenant and role are required' });
        return;
      }
      const payload = {
        tenant,
        role,
        issuedAt: new Date().toISOString(),
      };

      const token = jwt.sign(payload, AuthController.JWT_SECRET, { expiresIn: '2h' });
      res.status(201).json({
        message: 'Token created successfully',
        token,
      });
    } catch (error) {
      console.error('Error generating token:', error);
      res.status(500).json({
        message: 'Token generation failed',
        error: error,
      });
    }
  }
}

export default AuthController;
