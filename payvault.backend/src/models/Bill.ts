import mongoose, { Schema, Document } from 'mongoose';

export interface IBill extends Document {
  category: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  billNumber?: string;
  amount: number;
  dueDate: Date;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: Date;
}

const BillSchema: Schema = new Schema({
  category: { type: Schema.Types.ObjectId, ref: 'BillCategory', required: true },
  vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  billNumber: { type: String, unique: true },
  status: {
    type: String,
    enum: ['pending', 'paid', 'overdue'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBill>('Bill', BillSchema);
