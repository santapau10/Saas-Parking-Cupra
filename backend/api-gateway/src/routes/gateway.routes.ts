import { Router } from 'express';
import { verifyToken } from '../controllers/gateway.controller';
import AuthController from '../controllers/AuthController';
import IpController from '../controllers/IpController';
import { AuthMiddleware } from '../middlewares/verify.middleware';
const router = Router();


// router.post("/verify-token", verifyToken);

router.post('/registerTenant', AuthController.registerTenant);
router.post('/registerUser', AuthMiddleware.verifyToken,AuthController.registerUser);
router.post('/logout', AuthController.logout);

router.get('/test', AuthController.test);

router.get('/getTenantInfo/:tenantId', AuthController.getTenantInfo);

router.get('/getTenantFromUser/:userId', AuthController.getTenantFromUser);
router.get('/getUser/:userId', AuthController.getUser);


router.post('/setTheme', AuthMiddleware.verifyToken,AuthController.setTheme);

router.get('/api/:tenantId', IpController.getIp);


router.post('/getToken', AuthController.getToken);

export default router;
