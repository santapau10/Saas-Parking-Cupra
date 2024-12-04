import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/registerTenant', AuthController.registerUser);
router.post('/login', AuthController.login);
router.post('/registerUser', AuthController.registerUser);
router.post('/logout', AuthController.logout);

export default router;
