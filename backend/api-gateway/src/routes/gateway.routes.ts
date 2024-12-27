import { Router } from 'express';
import { verifyToken } from '../controllers/gateway.controller';
import AuthController from '../controllers/AuthController';
const router = Router();


router.post("/verify-token", verifyToken);

router.post('/registerTenant', AuthController.registerUser);
router.post('/login', AuthController.login);
router.post('/registerUser', AuthController.registerUser);
router.post('/logout', AuthController.logout);

export default router;
