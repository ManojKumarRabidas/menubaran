import mongoose from 'mongoose';

const menuCategorySchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
        name: { type: String, required: true, trim: true },
        icon: { type: String },
        sortOrder: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model('MenuCategory', menuCategorySchema);