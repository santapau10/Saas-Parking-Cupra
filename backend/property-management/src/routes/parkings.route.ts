// routes/defect.routes.ts
import { Router } from 'express';
import ParkingController from '../controllers/ParkingController';

import { AuthMiddleware } from '../middlewares/verify.middleware';
import multer from 'multer';


const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.get('/all', ParkingController.getAllParkings);
router.get('/all/:tenant_id', AuthMiddleware.verifyToken,ParkingController.getAllParkingsFromTenant);
router.post('/:tenant_id', AuthMiddleware.verifyToken,upload.single('picture'), ParkingController.createParking);

router.get('/:tenant_id/:parkingId', ParkingController.getById);

router.get('/byName/:parkingName', ParkingController.getByName);

router.post('/setCapacity/:tenant_id/:parking', AuthMiddleware.verifyToken,ParkingController.setCapacity)
router.post('/setBarriers/:tenant_id/:parking',  AuthMiddleware.verifyToken,ParkingController.setBarriers)
router.post('/setStatus/:tenant_id/:parking',  AuthMiddleware.verifyToken,ParkingController.setStatus)


router.get('/all/:tenant_id/test', ParkingController.getAllParkingsFromTenant);
router.post('/:tenant_id/test', upload.single('picture'), ParkingController.createParking);
router.post('/setCapacity/:tenant_id/:parking/test', ParkingController.setCapacity)
router.post('/setBarriers/:tenant_id/:parking/test',  ParkingController.setBarriers)
router.post('/setStatus/:tenant_id/:parking/test',  ParkingController.setStatus)

export default router;
