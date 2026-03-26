import MenuItem from '../models/MenuItems.js';
import Restaurant from '../models/Restaurants.js';

export const getMenuByRestaurantId = async (req, res) => {
    try {
        const docs = await MenuItem.find({ restaurantId: req.params._id });
        return res.json({ success: true, docs });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getMenuBySlug = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ slug: req.params.slug });
        if (!restaurant) return res.status(404).json({ success: false, error: 'Restaurant not found' });
        const docs = await MenuItem.find({ restaurantId: restaurant._id });
        return res.json({ success: true, docs });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const addMenuItem = async (req, res) => {
    try {
        const doc = await MenuItem.create(req.body);
        return res.status(201).json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const updateMenuItem = async (req, res) => {
    try {
        const doc = await MenuItem.findByIdAndUpdate(
            req.params._id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!doc) return res.status(404).json({ success: false, error: 'Menu item not found' });
        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};