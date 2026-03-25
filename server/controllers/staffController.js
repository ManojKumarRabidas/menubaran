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
        const token = jwt.sign({ id: authUser._id, email: authUser.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ success: true, doc: { token, staff: { id: authUser._id, email: authUser.email, name: authUser.name, role: authUser.role, restaurantId: authUser.restaurantId } } });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}
// }

export { staffLogin };