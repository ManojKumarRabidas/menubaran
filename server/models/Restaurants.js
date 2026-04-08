import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true },
        tagline: { type: String, trim: true },
        address: { type: String, trim: true },
        logoPlaceholderColor: { type: String },
        subscriptionPlan: { type: String, enum: ['free', 'basic', 'pro'], default: 'free' },
        subscriptionStatus: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
        registrationDocument: { type: String },
    },
    { timestamps: true }
);

export default mongoose.model('Restaurant', restaurantSchema);