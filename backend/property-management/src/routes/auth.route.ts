import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const router = Router();

router.post('/registerTenant', AuthController.register);
router.post('/loginTenant', AuthController.login);
router.post('/logoutTenant', AuthController.logout);
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);

export default router;
