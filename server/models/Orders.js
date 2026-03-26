import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
    {
        menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        name: { type: String, required: true },   // denormalized — survives menu edits
        price: { type: Number, required: true },   // denormalized — price at time of order
        qty: { type: Number, required: true, min: 1 },
        note: { type: String, default: '' },
    },
    { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
    {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
        tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
        tableNumber: { type: Number, required: true },  // denormalized for quick display
        items: [orderItemSchema],
        status: {
            type: String,
            enum: ['pending', 'cooking', 'ready', 'served', 'cancelled'],
            default: 'pending',
            index: true,
        },
        statusHistory: [statusHistorySchema],
        specialInstructions: { type: String, default: '' },
        totalAmount: { type: Number, required: true },
    },
    { timestamps: true }
);

export default mongoose.model('Order', orderSchema);