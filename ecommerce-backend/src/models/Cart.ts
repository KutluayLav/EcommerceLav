import mongoose, { Document, Schema } from 'mongoose';

export interface CartItem {
  _id?: Schema.Types.ObjectId;
  product: Schema.Types.ObjectId;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface CartDocument extends Document {
  user: Schema.Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const CartItemSchema = new Schema<CartItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, default: 1 },
  variant: {
    size: { type: String },
    color: { type: String },
  },
}, { _id: true });

const CartSchema = new Schema<CartDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: { type: [CartItemSchema], default: [] },
}, { timestamps: true });

export default mongoose.model<CartDocument>('Cart', CartSchema);
