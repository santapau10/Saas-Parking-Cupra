// routes/defect.routes.ts
import { Router } from 'express';
import ParkingController from '../controllers/ParkingController';

const router = Router();

router.get('/all/:tenant_id', ParkingController.getAllParkingsFromTenant);
router.post('/:tenant_id', ParkingController.createParking);


router.get('/:id', ParkingController.getById);

router.post('/:parking/:setCapacity/', ParkingController.setCapacity)
router.post('/:parking/:setBarriers/', ParkingController.setBarriers)
router.post('/:parking/:setPicture/', ParkingController.setPicture)


export default router;
