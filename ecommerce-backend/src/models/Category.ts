import mongoose, { Document, Schema } from 'mongoose';

export interface CategoryDocument extends Document {
  name: string;
  description: string;
  image?: string;
  active: boolean;
  sortOrder: number;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  featured?: boolean;
  parentCategory?: Schema.Types.ObjectId;
}

const CategorySchema = new Schema<CategoryDocument>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  image: { type: String },
  active: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  slug: { type: String, unique: true, sparse: true },
  metaTitle: { type: String },
  metaDescription: { type: String },
  featured: { type: Boolean, default: false },
  parentCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
}, { timestamps: true });

export default mongoose.model<CategoryDocument>('Category', CategorySchema);
