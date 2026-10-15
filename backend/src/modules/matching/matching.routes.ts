import { Router } from 'express';
import { getCustomerMatches, logMatchAction } from './matching.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/:customerId/matches', getCustomerMatches);
router.post('/:customerId/log', logMatchAction);

export default router;
