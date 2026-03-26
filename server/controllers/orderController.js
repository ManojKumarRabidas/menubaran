import Order from '../models/Orders.js';
import Table from '../models/Tables.js';
import { io } from '../server.js';

export const getOrderById = async (req, res) => {
    try {
        const doc = await Order.findById(req.params._id);
        if (!doc) return res.status(404).json({ success: false, error: 'Order not found' });
        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getOrdersByRestaurant = async (req, res) => {
    try {
        const docs = await Order.find({ restaurantId: req.params._id }).sort({ createdAt: -1 });
        return res.json({ success: true, docs });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const getOrdersByTable = async (req, res) => {
    try {
        const docs = await Order.find({
            tableId: req.params.tableId,
            status: { $nin: ['cancelled', 'paid'] },
        }).sort({ createdAt: -1 });
        return res.json({ success: true, docs });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const placeOrder = async (req, res) => {
    try {
        const { restaurantId, tableId, items, specialInstructions, tableNumber } = req.body;

        const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);

        const doc = await Order.create({
            restaurantId,
            tableId,
            tableNumber,
            items,
            specialInstructions,
            totalAmount: parseFloat(totalAmount.toFixed(2)),
            status: 'pending',
            statusHistory: [{ status: 'pending', timestamp: new Date() }],
        });

        // Mark table as occupied
        await Table.findByIdAndUpdate(tableId, {
            status: 'occupied',
            currentOrderId: doc._id,
        });

        return res.status(201).json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const doc = await Order.findByIdAndUpdate(
            req.params._id,
            {
                status,
                $push: { statusHistory: { status, timestamp: new Date() } },
            },
            { new: true, runValidators: true }
        );
        if (!doc) return res.status(404).json({ success: false, error: 'Order not found' });

        // Broadcast to all connected clients so customer sees live update
        io.emit('order:statusUpdate', {
            orderId: doc._id,
            newStatus: status,
            tableId: doc.tableId,
            tableNumber: doc.tableNumber,
            restaurantId: doc.restaurantId,
        });

        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

export const processPayment = async (req, res) => {
    try {
        const { method, tip = 0 } = req.body;

        const doc = await Order.findByIdAndUpdate(
            req.params._id,
            {
                status: 'paid',
                paymentStatus: 'paid',
                paymentMethod: method,
                tipAmount: parseFloat(tip),
                paidAt: new Date(),
                $push: { statusHistory: { status: 'paid', timestamp: new Date() } },
            },
            { new: true }
        );
        if (!doc) return res.status(404).json({ success: false, error: 'Order not found' });

        // Free up the table
        await Table.findByIdAndUpdate(doc.tableId, {
            status: 'available',
            currentOrderId: null,
        });

        return res.json({ success: true, doc });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};