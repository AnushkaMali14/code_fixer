import express from 'express';
import { explainError, getStats, useExample } from '../controllers/explainController.js';

const router = express.Router();

router.post('/explain-error', explainError);
router.get('/stats', getStats);
router.post('/use-example', useExample);

export default router;
