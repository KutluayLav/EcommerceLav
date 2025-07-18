import mongoose from 'mongoose';

const NewsletterSubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }
}, { timestamps: true });

export default mongoose.model('NewsletterSubscriber', NewsletterSubscriberSchema);
