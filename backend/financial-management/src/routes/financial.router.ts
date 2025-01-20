// routes/defect.routes.ts
import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/verify.middleware';
import FinancialController from '../controllers/FinancialController';


const router = Router();

router.get('/entriesFromParking/:tenant_id/:parking', AuthMiddleware.verifyToken,FinancialController.getEntriesFromParking);
router.get('/entriesFromTenant/:tenant_id/', AuthMiddleware.verifyToken,FinancialController.getEntriesFromTenant);

router.get('/paymentsFromParking/:tenant_id/:parking', AuthMiddleware.verifyToken,FinancialController.getPaymentsFromParking);
router.get('/paymentsFromTenant/:tenant_id/', AuthMiddleware.verifyToken,FinancialController.getPaymentsFromTenant);




export default router;
