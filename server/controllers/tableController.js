import Table from '../models/Tables.js';

export const getTablesByRestaurant = async (req, res) => {
    try {
        const docs = await Table.find({ restaurantId: req.params._id }).sort('number');
        return res.json({ success: true, docs });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getTableById = async (req, res) => {
    try {
        const doc = await Table.findOne({
            _id: req.params.tableId,
            restaurantId: req.params.restaurantId,
        });
        if (!doc) return res.status(404).json({ success: false, error: 'Table not found' });
        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const addTable = async (req, res) => {
    try {
        const doc = await Table.create(req.body);
        return res.status(201).json({ success: true, doc });
    } catch (e) {
        // Duplicate table number in same restaurant
        if (e.code === 11000)
            return res.status(409).json({ success: false, error: 'Table number already exists' });
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const updateTable = async (req, res) => {
    try {
        const doc = await Table.findByIdAndUpdate(
            req.params._id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!doc) return res.status(404).json({ success: false, error: 'Table not found' });
        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};