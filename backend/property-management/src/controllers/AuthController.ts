// controllers/AuthController.ts

import { Request, Response } from 'express';
import FirestoreUserRepository from '../repositories/FirestoreUserRepository';
import { User } from '../models/user.model';
import jwt from 'jsonwebtoken';

const userRepository = new FirestoreUserRepository();
const jwtSecret = process.env.JWT_SECRET || 'your_jwt_secret';

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const newUser = new User(req.body._username, req.body._password)
      const userId = await userRepository.create(newUser);

      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      res.status(500).json({ message: 'Registration failed', error: error });
    }
  }

  // Inicio de sesión
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const username = req.body._username // declared for later use (doesnt work otherwise)
      const user = new User(username, req.body._password);

      // Verificar credenciales
      const isValidUser = await userRepository.login(user);
      if (!isValidUser) {
        res.status(401).json({ message: 'Invalid username or password' });
        return;
      }

      // Generar token JWT
      const token = jwt.sign({ username }, jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      res.status(500).json({ message: 'Login failed', error: error });
    }
  }

  // Cierre de sesión
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Logout failed', error: error });
    }
  }
}

export default AuthController;
