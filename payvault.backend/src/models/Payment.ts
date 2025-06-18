import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  bill: mongoose.Types.ObjectId;
  paymentNumber?: string;//order_id
  method: 'cash' | 'card' | 'upi' | 'netbanking'|'razorpay';
  paidAmount: number;
  paidDate: Date;
  status: 'failed'| "initiated" | "pending" |"verified" | "completed";
  remarks?: string;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  bill: { type: Schema.Types.ObjectId, ref: 'Bill', required: true },
  paymentNumber: { type: String, required: false, unique: true },
  method: {
    type: String,
    enum: ['cash', 'card', 'upi', 'netbanking','razorpay'],
    required: true,
  },
  paidAmount: { type: Number, required: true },
  paidDate: { type: Date, required: true },
  status: {
    type: String,
    enum: ['failed', 'initiated', 'pending', 'verified', 'completed', 'processing'],
    default: 'processing',
  },
  remarks: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
