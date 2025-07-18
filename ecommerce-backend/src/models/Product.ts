import mongoose, { Document, Schema } from 'mongoose';

export interface ProductVariant {
  size?: string;
  color?: string;
  stock: number;
}

export interface ProductDocument extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  specifications: {
    [key: string]: string;
  };
  tags: string[];
  featured: boolean;
  popular: boolean;
  newArrival: boolean;
  variants: ProductVariant[];
}

const ProductVariantSchema = new Schema<ProductVariant>({
  size: { type: String },
  color: { type: String },
  stock: { type: Number, required: true, default: 0 },
});

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  stock: { type: Number, required: true },
  images: { type: [String], default: [] },
  specifications: { type: Schema.Types.Mixed, default: {} },
  tags: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  popular: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  variants: { type: [ProductVariantSchema], default: [] },
}, { timestamps: true });

export default mongoose.model<ProductDocument>('Product', ProductSchema);
