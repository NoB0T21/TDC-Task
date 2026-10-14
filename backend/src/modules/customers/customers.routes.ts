import { Router } from 'express';
import { listCustomers, getCustomer, patchCustomer } from './customers.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', listCustomers);
router.get('/:id', getCustomer);
router.patch('/:id', patchCustomer);

export default router;
