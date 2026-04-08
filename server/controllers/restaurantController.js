import Restaurant from '../models/Restaurants.js';
import Order from '../models/Orders.js';
import MenuItem from '../models/MenuItems.js';
import Staff from '../models/Staff.js';
import bcrypt from 'bcryptjs';

export const getRestaurantById = async (req, res) => {
    try {
        const doc = await Restaurant.findById(req.params._id);
        if (!doc) return res.status(404).json({ success: false, error: 'Restaurant not found' });
        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getRestaurantBySlug = async (req, res) => {
    try {
        const doc = await Restaurant.findOne({ slug: req.params.slug });
        if (!doc) return res.status(404).json({ success: false, error: 'Restaurant not found' });
        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getOwnerStats = async (req, res) => {
    try {
        const { _id: restaurantId } = req.params;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [todayOrders, allOrders] = await Promise.all([
            Order.find({ restaurantId, createdAt: { $gte: startOfDay } }),
            Order.find({ restaurantId }).sort({ createdAt: -1 }).limit(10),
        ]);

        const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
        const avgOrderValue = todayOrders.length ? todayRevenue / todayOrders.length : 0;

        // Most popular item from today's orders
        const itemCounts = {};
        todayOrders.forEach(order =>
            order.items.forEach(item => {
                const key = item.menuItemId.toString();
                itemCounts[key] = (itemCounts[key] || { count: 0, name: item.name });
                itemCounts[key].count += item.qty;
            })
        );
        const topEntry = Object.entries(itemCounts).sort((a, b) => b[1].count - a[1].count)[0];
        const mostPopularItem = topEntry
            ? { _id: topEntry[0], name: topEntry[1].name, orderCount: topEntry[1].count }
            : null;

        return res.json({
            success: true,
            data: {
                todayRevenue: parseFloat(todayRevenue.toFixed(2)),
                totalOrders: todayOrders.length,
                avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
                mostPopularItem,
                allOrders,
            },
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getWeeklyRevenue = async (req, res) => {
    try {
        const { _id: restaurantId } = req.params;
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);

        const orders = await Order.find({
            restaurantId,
            createdAt: { $gte: sevenDaysAgo },
            status: { $ne: 'cancelled' },
        });

        // Group by day-of-week
        const grouped = {};
        orders.forEach(o => {
            const day = days[new Date(o.createdAt).getDay()];
            if (!grouped[day]) grouped[day] = { revenue: 0, orders: 0 };
            grouped[day].revenue += o.totalAmount;
            grouped[day].orders += 1;
        });

        // Return last 7 days in order
        const data = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const day = days[d.getDay()];
            return {
                day,
                revenue: parseFloat((grouped[day]?.revenue || 0).toFixed(2)),
                orders: grouped[day]?.orders || 0,
            };
        });

        return res.json({ success: true, data });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const registerRestaurant = async (req, res) => {
    try {
        const { restaurantName, ownerName, email, password, address } = req.body;
        const file = req.file;

        if (!restaurantName || !ownerName || !email || !password || !file) {
            return res.status(400).json({ success: false, error: 'All fields including document are required' });
        }

        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        const restaurant = new Restaurant({
            name: restaurantName,
            slug: slug,
            address,
            status: 'pending',
            registrationDocument: `/uploads/${file.filename}`
        });
        await restaurant.save();

        const hashedPassword = await bcrypt.hash(password, 10);
        const owner = new Staff({
            restaurantId: restaurant._id,
            name: ownerName,
            email,
            password: hashedPassword,
            role: 'owner',
            isActive: false
        });
        await owner.save();

        return res.json({ success: true, message: 'Registration submitted for approval' });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getPendingRestaurants = async (req, res) => {
    try {
        const pending = await Restaurant.find({ status: 'pending' }).sort({ createdAt: -1 });
        const pendingWithOwners = await Promise.all(pending.map(async (r) => {
            const owner = await Staff.findOne({ restaurantId: r._id, role: 'owner' });
            return {
                ...r.toObject(),
                ownerName: owner?.name,
                ownerEmail: owner?.email
            };
        }));
        return res.json({ success: true, data: pendingWithOwners });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const approveRestaurant = async (req, res) => {
    try {
        const { _id } = req.params;
        const restaurant = await Restaurant.findByIdAndUpdate(_id, { status: 'approved' }, { new: true });
        if (!restaurant) return res.status(404).json({ success: false, error: 'Not found' });
        
        await Staff.findOneAndUpdate(
            { restaurantId: _id, role: 'owner' },
            { isActive: true }
        );
        
        return res.json({ success: true, message: 'Restaurant approved successfully' });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const rejectRestaurant = async (req, res) => {
    try {
        const { _id } = req.params;
        const restaurant = await Restaurant.findByIdAndUpdate(_id, { status: 'rejected' }, { new: true });
        if (!restaurant) return res.status(404).json({ success: false, error: 'Not found' });
        
        return res.json({ success: true, message: 'Restaurant rejected successfully' });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};