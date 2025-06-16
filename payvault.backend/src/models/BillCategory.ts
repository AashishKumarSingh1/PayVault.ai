import mongoose, { Schema, Document } from 'mongoose';

export interface IBillCategory extends Document {
  name: string;
  createdAt: Date;
}

const BillCategorySchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IBillCategory>('BillCategory', BillCategorySchema);
