import mongoose, { Document, Schema, Types } from 'mongoose';

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  label?: string;
  phone?: string;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: 'admin' | 'customer';
  firstName: string;
  lastName: string;
  phone?: string;
  emailVerified: boolean;
  addresses: Address[];
  favoriteCategories: string[];
  preferences: {
    [key: string]: any;
  };
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  emailVerificationToken?: string;
  wishlist: Types.ObjectId[];
}

const AddressSchema = new Schema<Address>({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
  label: { type: String },
  phone: { type: String },
}, { _id: true });

const UserSchema = new Schema<UserDocument>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'customer'], default: 'customer' },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String },
  emailVerified: { type: Boolean, default: false },
  addresses: { type: [AddressSchema], default: [] },
  favoriteCategories: { type: [String], default: [] },
  preferences: { type: Schema.Types.Mixed, default: {} },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  emailVerificationToken: { type: String },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product', default: [] }],
}, { timestamps: true });

export default mongoose.model<UserDocument>('User', UserSchema); 