import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const staffSchema = new mongoose.Schema(
    {
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true, index: true },
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['owner', 'manager', 'waiter', 'cook'], required: true },
        avatarColor: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Strip password from any JSON response
staffSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// Compare password helper (use in login route)
staffSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

export default mongoose.model('Staff', staffSchema);