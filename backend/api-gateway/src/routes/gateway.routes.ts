import { Router } from 'express';
import { handleServiceRequest } from '../controllers/gateway.controller';

const router = Router();

router.all('/:service/:path', handleServiceRequest);

export default router;
