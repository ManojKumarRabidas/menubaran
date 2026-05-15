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

export const updateRestaurant = async (req, res) => {
    try {
        const { name, tagline, address, logoPlaceholderColor } = req.body;
        const restaurant = await Restaurant.findById(req.params._id);
        if (!restaurant) return res.status(404).json({ success: false, error: 'Restaurant not found' });

        if (name !== undefined) restaurant.name = name;
        if (tagline !== undefined) restaurant.tagline = tagline;
        if (address !== undefined) restaurant.address = address;
        if (logoPlaceholderColor !== undefined) restaurant.logoPlaceholderColor = logoPlaceholderColor;

        await restaurant.save();
        return res.json({ success: true, doc: restaurant });
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
        const {
            restaurantName, ownerName, email, password, mobileNumber,
            cuisineType, gstin, fssaiLicense, businessPan,
            street, locality, cityPincode, mapPin, address,
            subscriptionPlan
        } = req.body;

        const files = req.files || {};
        const registrationDocument = files['registrationDocument'] ? files['registrationDocument'][0] : null;
        const fssaiCertificate = files['fssaiCertificate'] ? files['fssaiCertificate'][0] : null;
        const panCard = files['panCard'] ? files['panCard'][0] : null;
        const bankPassbook = files['bankPassbook'] ? files['bankPassbook'][0] : null;
        const shopPhoto = files['shopPhoto'] ? files['shopPhoto'][0] : null;
        const restaurantLogo = files['restaurantLogo'] ? files['restaurantLogo'][0] : null;
        // const menuImages = files['menuImages'] || [];

        if (!restaurantName || !ownerName || !email || !password || !mobileNumber) {
            return res.status(400).json({ success: false, error: 'Required Step 1 fields are missing' });
        }

        if (!gstin || !fssaiLicense || !businessPan || !street || !locality || !cityPincode || !mapPin) {
            return res.status(400).json({ success: false, error: 'Please provide all mandatory Legal Identifiers and Physical Address details.' });
        }

        const existingStaff = await Staff.findOne({ email });
        if (existingStaff) {
            return res.status(400).json({ success: false, error: 'Email already exists' });
        }

        const existingRestaurant = await Restaurant.findOne({ gstin });
        if (existingRestaurant) {
            return res.status(400).json({ success: false, error: "Restaurant already exists with the provided GST Number. If it's not you contact menubaran support." });
        }

        const slug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

        let parsedCuisineType = [];
        if (cuisineType) {
            try {
                parsedCuisineType = JSON.parse(cuisineType);
            } catch (e) {
                parsedCuisineType = Array.isArray(cuisineType) ? cuisineType : [cuisineType];
            }
        }

        const selectedPlan = subscriptionPlan || 'free';
        let planActivationDate = new Date();
        let planExpireDate = new Date();
        if (selectedPlan === 'free') {
            planExpireDate.setMonth(planExpireDate.getMonth() + 3);
        } else if (selectedPlan === 'gold') {
            planExpireDate.setMonth(planExpireDate.getMonth() + 6);
        } else if (selectedPlan === 'diamond') {
            planExpireDate.setMonth(planExpireDate.getMonth() + 12);
        }

        const restaurant = new Restaurant({
            name: restaurantName, slug: slug, address: address || street || '',
            addressDetails: { street, locality, cityPincode, mapPin },
            cuisineType: parsedCuisineType, gstin, fssaiLicense, businessPan,
            subscriptionPlan: selectedPlan, planActivationDate, planExpireDate, status: 'pending',
            registrationDocument: registrationDocument ? `/uploads/${registrationDocument.filename}` : null,
            fssaiCertificate: fssaiCertificate ? `/uploads/${fssaiCertificate.filename}` : null,
            panCard: panCard ? `/uploads/${panCard.filename}` : null,
            bankPassbook: bankPassbook ? `/uploads/${bankPassbook.filename}` : null,
            shopPhoto: shopPhoto ? `/uploads/${shopPhoto.filename}` : null,
            restaurantLogo: restaurantLogo ? `/uploads/${restaurantLogo.filename}` : null,
            // menuImages: menuImages.map(f => `/uploads/${f.filename}`)
        });
        await restaurant.save();

        const hashedPassword = await bcrypt.hash(password, 10);
        const owner = new Staff({
            restaurantId: restaurant._id,
            name: ownerName,
            email,
            mobileNumber,
            password: hashedPassword,
            role: 'owner',
            isActive: false
        });
        await owner.save();

        return res.json({ success: true, message: 'Registration submitted for approval' });
    } catch (e) {
        if (e.code === 11000) {
            if (e.keyPattern && e.keyPattern.slug) {
                return res.status(400).json({ success: false, error: 'A restaurant with this name is already registered. Please choose a different name.' });
            }
            if (e.keyPattern && e.keyPattern.email) {
                return res.status(400).json({ success: false, error: 'This email address is already in use.' });
            }
            if (e.keyPattern && e.keyPattern.gstin) {
                return res.status(400).json({ success: false, error: 'This gstin is already in use.' });
            }
            return res.status(400).json({ success: false, error: 'A record with these details already exists.' });
        }
        return res.status(500).json({ success: false, error: 'An unexpected error occurred. Please try again later.' });
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

export const getAllRestaurants = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = status && status !== 'all' ? { status } : {};
        const restaurants = await Restaurant.find(filter).sort({ createdAt: -1 });
        const withOwners = await Promise.all(restaurants.map(async (r) => {
            const owner = await Staff.findOne({ restaurantId: r._id, role: 'owner' });
            return {
                ...r.toObject(),
                ownerName: owner?.name,
                ownerEmail: owner?.email,
                ownerMobile: owner?.mobileNumber,
                ownerActive: owner?.isActive ?? false,
            };
        }));
        return res.json({ success: true, data: withOwners });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const toggleLoginPermission = async (req, res) => {
    try {
        const { _id } = req.params;
        const owner = await Staff.findOne({ restaurantId: _id, role: 'owner' });
        if (!owner) return res.status(404).json({ success: false, error: 'Owner not found' });
        owner.isActive = !owner.isActive;
        await owner.save();
        return res.json({ success: true, isActive: owner.isActive, message: `Login ${owner.isActive ? 'enabled' : 'disabled'} successfully` });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getAdminStats = async (req, res) => {
    try {
        const [pending, approved, rejected, totalOrders] = await Promise.all([
            Restaurant.countDocuments({ status: 'pending' }),
            Restaurant.countDocuments({ status: 'approved' }),
            Restaurant.countDocuments({ status: 'rejected' }),
            Order.countDocuments({}),
        ]);

        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const newThisMonth = await Restaurant.countDocuments({ createdAt: { $gte: startOfMonth } });

        return res.json({
            success: true,
            data: { pending, approved, rejected, totalOrders, newThisMonth }
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};