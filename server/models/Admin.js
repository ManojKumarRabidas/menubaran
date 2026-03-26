import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
        avatarColor: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

adminSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

adminSchema.methods.comparePassword = function (plain) {
    return bcrypt.compare(plain, this.password);
};

export default mongoose.model('Admin', adminSchema);