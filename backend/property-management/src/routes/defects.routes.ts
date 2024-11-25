// routes/defect.routes.ts
import { Router } from 'express';
import DefectController from '../controllers/DefectController';
import multer from 'multer';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', DefectController.getAll);
router.get('/filteredByStatus/:status', DefectController.getByStatus);
router.get('/filteredByLocation/:location', DefectController.getByLocation);
router.get('/:id', DefectController.getById);
router.post('/', upload.single('_image'), DefectController.create);
router.put('/:id', DefectController.update);
router.delete('/:id', DefectController.delete);

export default router;
