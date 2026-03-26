import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
        number: { type: Number, required: true },
        status: { type: String, enum: ['available', 'occupied', 'reserved', 'inactive'], default: 'available' },
        currentOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: null },
    },
    { timestamps: true }
);

// A table number must be unique within a restaurant
tableSchema.index({ restaurantId: 1, number: 1 }, { unique: true });

export default mongoose.model('Table', tableSchema);