import mongoose from 'mongoose';

const tableRequestSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
        tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
        tableNumber: { type: Number, required: true },
        type: { type: String, enum: ['water', 'waiter', 'bill'], required: true },
        status: { type: String, enum: ['pending', 'cleared'], default: 'pending' },
    },
    { timestamps: true }
);

// Index for auto-cleanup and sorting
tableRequestSchema.index({ createdAt: 1 });
tableRequestSchema.index({ restaurantId: 1, status: 1 });

export default mongoose.model('TableRequest', tableRequestSchema);
