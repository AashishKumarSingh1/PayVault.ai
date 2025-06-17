

import { Request, Response } from 'express';
import Payment from '../models/Payment';
import { connectDb } from '../utils/connectDb';

class TransactionController {
  static async getPastTransactions(req: Request, res: Response): Promise<void> {
    try {
      await connectDb();

      const status = req.query.status || 'success';
      const limit = parseInt(req.query.limit as string) || 20;
      const sort = req.query.sort === 'asc' ? 1 : -1;

      const transactions = await Payment.find({ status })
        .sort({ paidDate: sort })
        .limit(limit)
        .populate('bill');

      res.status(200).json({ success: true, transactions });
    } catch (error) {
      console.error('Failed to fetch past transactions:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
}

export default TransactionController;
