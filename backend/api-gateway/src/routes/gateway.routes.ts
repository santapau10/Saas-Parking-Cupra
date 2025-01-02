import { Router } from 'express';
import { verifyToken } from '../controllers/gateway.controller';
import AuthController from '../controllers/AuthController';
import IpController from '../controllers/IpController';
const router = Router();


router.post("/verify-token", verifyToken);

router.post('/registerTenant', AuthController.registerTenant);
router.post('/registerUser', AuthController.registerUser);
router.post('/logout', AuthController.logout);

router.get('/getTenantInfo/:tenantId', AuthController.getTenantInfo);

router.get('/getTenantFromUser/:userId', AuthController.getTenantFromUser);

router.get('/api/:tenantId', IpController.getIp);

export default router;
