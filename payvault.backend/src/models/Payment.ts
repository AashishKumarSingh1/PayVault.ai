import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  bill: mongoose.Types.ObjectId;
  paymentNumber: string;
  method: 'cash' | 'card' | 'upi' | 'netbanking';
  paidAmount: number;
  paidDate: Date;
  status: 'success' | 'failed' | 'processing';
  remarks?: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  bill: { type: Schema.Types.ObjectId, ref: 'Bill', required: true },
  paymentNumber: { type: String, required: true, unique: true },
  method: {
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking'],
    required: true,
  },
  paidAmount: { type: Number, required: true },
  paidDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['success', 'failed', 'processing'],
    default: 'processing',
  },
  remarks: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
