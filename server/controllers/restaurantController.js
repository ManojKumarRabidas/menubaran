// import Restaurant from '../models/Restaurants.js';
// import Table from '../models/Tables.js';
// const getRestaurantById = async (req, res) => {
//     const { _id } = req.params;
//     try {
//         const restaurant = await Restaurant.findById(_id);
//         if (!restaurant) {
//             return res.status(404).json({ error: 'Restaurant not found' });
//         }
//         res.json({ success: true, doc: restaurant });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

// const getRestaurantTablesById = async (req, res) => {
//     const { _id } = req.params;
//     try {
//         const tables = await Table.find({ restaurantId: _id });
//         res.json({ success: true, docs: tables });
//     } catch (e) {
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }
// export { getRestaurantById, getRestaurantTablesById };

import Restaurant from '../models/Restaurants.js';
import Order from '../models/Orders.js';
import MenuItem from '../models/MenuItems.js';

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