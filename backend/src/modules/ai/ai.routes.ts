import { Router } from 'express';
import { scoreMatches, generateIntro } from './ai.controller';
import { authMiddleware } from '../../shared/middlewares/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.get('/:customerId/ai-matches', scoreMatches);
router.post('/:customerId/intro', generateIntro);

export default router;
