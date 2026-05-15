import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
    restaurantId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    restaurantName: { type: String, required: true },
    ownerName:      { type: String, required: true },     // person who submitted
    category:       { type: String, enum: ['UX/Interface', 'Performance', 'Feature Request', 'Billing', 'Support', 'General'], default: 'General' },
    rating:         { type: Number, min: 1, max: 5, required: true },
    comment:        { type: String, required: true, trim: true },
}, { timestamps: true });

export default mongoose.model('Feedback', feedbackSchema);
