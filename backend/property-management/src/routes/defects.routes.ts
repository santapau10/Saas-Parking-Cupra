// routes/defect.routes.ts
import { Router } from 'express';
import DefectController from '../controllers/DefectController';
import multer from 'multer';
import { AuthMiddleware } from '../middlewares/verify.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/',DefectController.getAll);
//router.get('/:parking', validateTokenMiddleware,DefectController.getFromParking);

router.get('/:tenant_id/:parking', DefectController.getFromParking);
router.get('/filteredByStatus/:parking/:status', AuthMiddleware.verifyToken, DefectController.getByStatus);
// router.get('/:tenant_id/:parking/:id', AuthMiddleware.verifyToken,DefectController.getById);


router.post('/:tenant_id', upload.single('image'), DefectController.create);



router.put('/:id', AuthMiddleware.verifyToken,DefectController.update);
router.delete('/:id', AuthMiddleware.verifyToken,DefectController.delete);

export default router;
