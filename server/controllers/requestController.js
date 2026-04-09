import TableRequest from '../models/TableRequest.js';

export const getPendingRequestsByRestaurant = async (req, res) => {
    try {
        const docs = await TableRequest.find({
            restaurantId: req.params.restaurantId,
            status: 'pending'
        }).sort({ createdAt: -1 });
        return res.json({ success: true, docs });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const clearRequest = async (req, res) => {
    try {
        const doc = await TableRequest.findByIdAndUpdate(
            req.params._id,
            { status: 'cleared' },
            { new: true }
        );
        if (!doc) return res.status(404).json({ success: false, error: 'Request not found' });
        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const clearTableRequests = async (req, res) => {
    try {
        const { tableId } = req.body;
        await TableRequest.updateMany(
            { tableId, status: 'pending' },
            { status: 'cleared' }
        );
        return res.json({ success: true, message: 'Table requests cleared' });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};
