import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, unique: true, trim: true },
        name: { type: String, required: true, trim: true },
        tagline: { type: String, trim: true },
        address: { type: String, trim: true },
        addressDetails: {
            street: { type: String, required: true, trim: true },
            locality: { type: String, required: true, trim: true },
            cityPincode: { type: String, required: true, trim: true },
            mapPin: { type: String, required: true, trim: true }
        },
        cuisineType: [{ type: String }],
        gstin: { type: String, required: true, trim: true, unique: true, sparse: true },
        fssaiLicense: { type: String, required: true },
        businessPan: { type: String, required: true },
        logoPlaceholderColor: { type: String },
        subscriptionPlan: { type: String, enum: ['free', 'gold', 'diamond', 'basic', 'pro'], default: 'free' },
        planActivationDate: { type: Date },
        planExpireDate: { type: Date },
        subscriptionStatus: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'approved' },
        registrationDocument: { type: String },
        fssaiCertificate: { type: String, required: true },
        panCard: { type: String, required: true },
        bankPassbook: { type: String, required: true },
        shopPhoto: { type: String, required: true },
        restaurantLogo: { type: String },
        // menuImages: [{ type: String }],
    },
    { timestamps: true }
);

export default mongoose.model('Restaurant', restaurantSchema);