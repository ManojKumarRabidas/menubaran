import mongoose from 'mongoose';

const subscriptionPlanSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true, unique: true }, // human-readable _id e.g. 'plan_1'
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true },
        billingCycle: { type: String, enum: ['monthly', 'yearly'], default: 'monthly' },
        features: [{ type: String }],
        maxTables: { type: Number },
        maxStaff: { type: Number },
        isPopular: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model('SubscriptionPlan', subscriptionPlanSchema);