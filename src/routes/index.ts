import { Router } from 'express';
import uploadRoutes from './upload';
import statusRoutes from './status';

const router = Router();

router.use('/upload', uploadRoutes);
router.use('/status', statusRoutes);

export default router;
