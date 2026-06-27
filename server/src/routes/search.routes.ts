import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { searchEventsController } from '../controllers/eventSearch.controller';

const router = Router();
router.use(authenticate);
router.get('/', searchEventsController);

export default router;
