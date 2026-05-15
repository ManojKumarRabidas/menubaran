import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
    restaurantId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    restaurantName: { type: String, required: true },
    ownerName:      { type: String, required: true },     // person who submitted
    category:       { type: String, enum: ['Technical', 'Billing', 'Feature', 'Account', 'Performance', 'Other'], default: 'Other' },
    issue:          { type: String, required: true, trim: true },
    status:         { type: String, enum: ['open', 'in-progress', 'resolved'], default: 'open' },
    resolvedAt:     { type: Date },
    adminNote:      { type: String, trim: true },         // note from MenuBaran team when resolving
}, { timestamps: true });

export default mongoose.model('Complaint', complaintSchema);
