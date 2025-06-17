import { Router } from 'express';
import TransactionController from '../controllers/transactionController';

const router = Router();

router.get('/past', TransactionController.getPastTransactions);

export default router;
