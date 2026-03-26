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