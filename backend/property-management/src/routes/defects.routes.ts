// routes/defect.routes.ts
import { Router } from 'express';
import DefectController from '../controllers/DefectController';
import multer from 'multer';
import { validateTokenMiddleware } from '../middlewares/verify.middleware';
const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/:parking', validateTokenMiddleware,DefectController.getAll);
router.get('/:parking/filteredByStatus/:status', validateTokenMiddleware,DefectController.getByStatus);
router.get('/:parking/filteredByLocation/:location', validateTokenMiddleware,DefectController.getByLocation);
router.get('/:parking/:id', validateTokenMiddleware,DefectController.getById);

router.post('/', upload.single('_image'), DefectController.create);

router.put('/:parking/:id', DefectController.update);
router.delete('/:parking/:id', DefectController.delete);

export default router;
