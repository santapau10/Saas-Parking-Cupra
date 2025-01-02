// routes/defect.routes.ts
import { Router } from 'express';
import ParkingController from '../controllers/ParkingController';


const router = Router();

router.get('/capacity/:parkingId', ParkingController.getParkingCapacity);

router.post('/registerEntry', ParkingController.registerEntry);
router.post('/registerExit', ParkingController.registerExit);
router.post('/registerPayment', ParkingController.registerPayment);



export default router;
