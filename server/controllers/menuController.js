import MenuItem from '../models/MenuItems.js';
import Restaurant from '../models/Restaurants.js';
import MenuCategory from '../models/MenuCategory.js';

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

export const bulkUploadMenuItems = async (req, res) => {
    try {
        const { restaurantId, items } = req.body;
        if (!restaurantId || !items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, error: 'Missing restaurantId or items array' });
        }

        // 1. Get existing categories
        const existingCats = await MenuCategory.find({ restaurantId });
        const catMap = new Map(existingCats.map(c => [c.name.toLowerCase(), c._id]));

        const finalItems = [];
        const newCatsToCreate = new Set();

        // 2. Pre-process items and identify new categories
        for (const item of items) {
            const catName = item.category?.trim();
            if (catName && !catMap.has(catName.toLowerCase())) {
                newCatsToCreate.add(catName);
            }
        }

        // 3. Create new categories if they don't exist
        for (const catName of newCatsToCreate) {
            const newCat = await MenuCategory.create({
                restaurantId,
                name: catName,
                icon: '📁' // Default icon for auto-created categories
            });
            catMap.set(catName.toLowerCase(), newCat._id);
        }

        // 4. Prepare items for bulk insert
        for (const item of items) {
            const categoryId = catMap.get(item.category?.toLowerCase());
            if (!categoryId) continue; // Should not happen now

            finalItems.push({
                restaurantId,
                categoryId,
                name: item.name,
                price: parseFloat(item.price) || 0,
                description: item.description || '',
                emoji: item.emoji || '🍽️',
                isVeg: !!item.isVeg,
                // Set default gradients
                gradientFrom: 'from-amber-400',
                gradientTo: 'to-orange-500'
            });
        }

        if (finalItems.length === 0) {
            return res.status(400).json({ success: false, error: 'No valid items to upload' });
        }

        const docs = await MenuItem.insertMany(finalItems);
        return res.status(201).json({ success: true, count: docs.length, docs });
    } catch (e) {
        console.error('Bulk upload error:', e);
        return res.status(500).json({ success: false, error: e.message });
    }
};