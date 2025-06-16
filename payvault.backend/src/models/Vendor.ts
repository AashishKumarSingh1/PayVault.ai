import mongoose, { Schema, Document } from 'mongoose';

export interface IVendor extends Document {
  name: string;
  contactInfo?: string;
  createdAt: Date;
}

const VendorSchema: Schema = new Schema({
  name: { type: String, required: true },
  contactInfo: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IVendor>('Vendor', VendorSchema);
