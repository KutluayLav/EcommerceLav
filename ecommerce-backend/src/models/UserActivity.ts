import mongoose, { Document, Schema } from 'mongoose';

export interface ViewedProduct {
  product: Schema.Types.ObjectId;
  count: number;
}

export interface RecentView {
  product: Schema.Types.ObjectId;
  viewedAt: Date;
}

export interface PurchasedProduct {
  product: Schema.Types.ObjectId;
  purchasedAt: Date;
}

export interface UserActivityDocument extends Document {
  user: Schema.Types.ObjectId;
  viewedProducts: ViewedProduct[];
  recentViews: RecentView[];
  purchasedProducts: PurchasedProduct[];
}

const UserActivitySchema = new Schema<UserActivityDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  viewedProducts: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      count: { type: Number, default: 1 },
    },
  ],
  recentViews: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      viewedAt: { type: Date, default: Date.now },
    },
  ],
  purchasedProducts: [
    {
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      purchasedAt: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model<UserActivityDocument>('UserActivity', UserActivitySchema);
