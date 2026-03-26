import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
        categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuCategory', required: true, index: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        price: { type: Number, required: true, min: 0 },
        gradientFrom: { type: String },
        gradientTo: { type: String },
        isAvailable: { type: Boolean, default: true },
        isPopular: { type: Boolean, default: false },
        isVeg: { type: Boolean, default: false },
        tags: [{ type: String }],
        preparationTimeMinutes: { type: Number, default: 10 },
    },
    { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);