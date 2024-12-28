import { Router } from 'express';
import { verifyToken } from '../controllers/gateway.controller';
import AuthController from '../controllers/AuthController';
import IpController from '../controllers/IPController';
const router = Router();


router.post("/verify-token", verifyToken);

router.post('/registerTenant', AuthController.registerUser);
router.post('/login', AuthController.login);
router.post('/registerUser', AuthController.registerUser);
router.post('/logout', AuthController.logout);


router.get('/api/:tenantId', IpController.getIp);

export default router;
