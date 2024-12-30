// routes/defect.routes.ts
import { Router } from 'express';
import ParkingController from '../controllers/ParkingController';
import { validateTokenMiddleware } from '../middlewares/verify.middleware';
import multer from 'multer';


const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/all/:tenant_id', ParkingController.getAllParkingsFromTenant);
// router.post('/:tenant_id', ParkingController.createParking);

router.post('/:tenant_id', upload.single('picture'), ParkingController.createParking);


router.get('/:id', ParkingController.getById);

router.post('/:parking/setCapacity/', validateTokenMiddleware,ParkingController.setCapacity)
router.post('/:parking/setBarriers/', validateTokenMiddleware,ParkingController.setBarriers)
router.post('/:parking/setStatus/', validateTokenMiddleware,ParkingController.setStatus)


export default router;
