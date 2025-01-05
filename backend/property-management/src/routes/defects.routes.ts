// routes/defect.routes.ts
import { Router } from 'express';
import DefectController from '../controllers/DefectController';
import multer from 'multer';
import { validateTokenMiddleware } from '../middlewares/verify.middleware';
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/',DefectController.getAll);
//router.get('/:parking', validateTokenMiddleware,DefectController.getFromParking);
router.get('/:parking',DefectController.getFromParking);
router.get('/:parking/filteredByStatus/:status', validateTokenMiddleware,DefectController.getByStatus);
router.get('/:parking/:id', validateTokenMiddleware,DefectController.getById);

//validateTokenMiddleware

router.post('/', upload.single('_image'), DefectController.create);

router.put('/:parking/:id', DefectController.update);
router.delete('/:parking/:id', DefectController.delete);

export default router;
