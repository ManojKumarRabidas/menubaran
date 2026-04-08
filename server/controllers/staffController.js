import Staff from '../models/Staff.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// module.exports = {
const staffLogin = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    try {
        const password = req.body.password;
        const email = req.body.email;
        const authUser = await Staff.findOne({ email: email });
        if (!authUser) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (!authUser.isActive) {
            return res.status(400).json({ msg: 'Your account is deactivated. Please contact with admin for activation.' });
        }
        const isMatch = await bcrypt.compare(password, authUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log(authUser.restaurantId)
        const token = jwt.sign({ _id: authUser._id, email: authUser.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, doc: { token, staff: { _id: authUser._id, email: authUser.email, name: authUser.name, role: authUser.role, restaurantId: authUser.restaurantId } } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
// }

export const getStaffByRestaurant = async (req, res) => {
    try {
        const staff = await Staff.find({ restaurantId: req.params._id }).select('-password');
        res.json({ success: true, data: staff });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const createStaff = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        const { name, email, password, role } = req.body;

        const existing = await Staff.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newStaff = new Staff({
            restaurantId,
            name,
            email,
            password: hashedPassword,
            role,
            isActive: true
        });

        await newStaff.save();
        const staffData = newStaff.toObject();
        delete staffData.password;
        
        res.json({ success: true, data: staffData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const toggleStaffStatus = async (req, res) => {
    try {
        const staff = await Staff.findById(req.params._id);
        if (!staff) return res.status(404).json({ success: false, error: 'Staff not found' });

        staff.isActive = !staff.isActive;
        await staff.save();

        const staffData = staff.toObject();
        delete staffData.password;

        res.json({ success: true, data: staffData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const { name, email, role, avatarColor, password } = req.body;
        const staff = await Staff.findById(req.params._id);
        if (!staff) return res.status(404).json({ success: false, error: 'Staff not found' });

        if (email && email !== staff.email) {
            const existing = await Staff.findOne({ email });
            if (existing) return res.status(400).json({ success: false, error: 'Email already exists' });
            staff.email = email;
        }

        if (name) staff.name = name;
        if (role) staff.role = role;
        if (avatarColor) staff.avatarColor = avatarColor;
        if (password) staff.password = await bcrypt.hash(password, 10);

        await staff.save();
        const staffData = staff.toObject();
        delete staffData.password;

        res.json({ success: true, data: staffData });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const staff = await Staff.findByIdAndDelete(req.params._id);
        if (!staff) return res.status(404).json({ success: false, error: 'Staff not found' });
        res.json({ success: true, message: 'Staff deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export { staffLogin };