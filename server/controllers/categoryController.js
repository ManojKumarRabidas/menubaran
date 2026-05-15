import MenuCategory from '../models/MenuCategory.js';
import Restaurant from '../models/Restaurants.js';

export const getCategoriesByRestaurantId = async (req, res) => {
    try {
        const docs = await MenuCategory.find({ restaurantId: req.params._id }).sort('sortOrder');
        return res.json({ success: true, docs });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getCategoriesBySlug = async (req, res) => {
    try {
        const restaurant = await Restaurant.findOne({ slug: req.params.slug });
        if (!restaurant) return res.status(404).json({ success: false, error: 'Restaurant not found' });
        const docs = await MenuCategory.find({ restaurantId: restaurant._id }).sort('sortOrder');
        return res.json({ success: true, docs });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const createCategory = async (req, res) => {
    try {
        const { restaurantId, name, icon } = req.body;
        if (!restaurantId || !name) {
            return res.status(400).json({ success: false, error: 'Restaurant ID and name are required' });
        }

        // Check if category with this exact name (case-insensitive) already exists for this restaurant
        const existing = await MenuCategory.findOne({
            restaurantId,
            name: { $regex: new RegExp(`^${name.trim()}$`, 'i') }
        });

        if (existing) {
            return res.json({ success: true, doc: existing, isNew: false });
        }

        // Get max sortOrder
        const highestCategory = await MenuCategory.findOne({ restaurantId }).sort('-sortOrder');
        const nextOrder = highestCategory ? highestCategory.sortOrder + 10 : 0;

        const newCat = await MenuCategory.create({
            restaurantId,
            name: name.trim(),
            icon: icon || '📁',
            sortOrder: nextOrder,
            isActive: true
        });

        return res.json({ success: true, doc: newCat, isNew: true });
    } catch (e) {
        console.error('Error creating category:', e);
        return res.status(500).json({ success: false, error: e.message });
    }
};