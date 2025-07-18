import mongoose, { Document, Schema } from 'mongoose';

export interface ReviewDocument extends Document {
  product: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<ReviewDocument>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  approved: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<ReviewDocument>('Review', ReviewSchema);
