import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description: string;
  image: string;
  active: boolean;
  sortOrder: number;
}

const CategorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<CategoryDocument>('Category', CategorySchema);
