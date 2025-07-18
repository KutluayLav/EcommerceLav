import mongoose, { Document, Schema } from 'mongoose';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered';

export interface OrderItem {
  product: Schema.Types.ObjectId;
  quantity: number;
  price: number;
  variant?: {
    size?: string;
    color?: string;
  };
}

export interface OrderDocument extends Document {
  user: Schema.Types.ObjectId;
  items: OrderItem[];
  totalPrice: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<OrderItem>({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  variant: {
    size: { type: String },
    color: { type: String },
  },
});

const OrderSchema = new Schema<OrderDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: { type: [OrderItemSchema], required: true },
  totalPrice: { type: Number, required: true },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
  },
  status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'delivered'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model<OrderDocument>('Order', OrderSchema);
