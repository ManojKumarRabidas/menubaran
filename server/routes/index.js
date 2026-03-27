// import express from 'express';
// const router = express.Router();
// import { adminLogin } from '../controllers/adminController.js';
// import { staffLogin } from '../controllers/staffController.js';
// import { getRestaurantById, getRestaurantTablesById } from '../controllers/restaurantController.js';
// import { get } from 'mongoose';
// // const authController = require('../controllers/authController');
// // const restaurantController = require('../controllers/restaurantController');
// // const orderController = require('../controllers/orderController');
// // const tableController = require('../controllers/tableController');
// // const menuController = require('../controllers/menuController');
// // const subscriptionController = require('../controllers/subscriptionController');
// // ════════════════════════════════════════
// // PUBLIC ROUTES (no auth required)
// // ════════════════════════════════════════


// router.post('/admin/login', adminLogin);
// router.post('/staff/login', staffLogin);
// router.get('/restaurants/:_id', getRestaurantById);
// router.get('/restaurant/:_id/tables', getRestaurantTablesById);

// router.get('/restaurant/:slug', async (req, res) => {
//   // TODO: const { slug } = req.params
//   // TODO: const restaurant = await Restaurant.findOne({ slug })
//   // TODO: res.json({ success: true, data: restaurant })
//   res.json({ success: true, data: null });
// });

// router.get('/menu/:restaurantSlug', async (req, res) => {
//   // TODO: const { restaurantSlug } = req.params
//   // TODO: const restaurant = await Restaurant.findOne({ slug: restaurantSlug })
//   // TODO: const items = await MenuItem.find({ restaurantId: restaurant?._id, isAvailable: true })
//   // TODO:   .populate('category')
//   // TODO: res.json({ success: true, data: items })
//   res.json({ success: true, data: [] });
// });

// router.get('/order/:orderId', async (req, res) => {
//   // TODO: const { orderId } = req.params
//   // TODO: const order = await Order.findById(orderId)
//   // TODO:   .populate('items')
//   // TODO: res.json({ success: true, data: order })
//   res.json({ success: true, data: null });
// });

// router.post('/orders', async (req, res) => {
//   // TODO: const { restaurantId, tableId, items, specialInstructions } = req.body
//   // TODO: validate items and amount
//   // TODO: const order = await Order.create({ ... })
//   // TODO: io.to(restaurantId).emit('order:new', { order, restaurantId })
//   // TODO: res.json({ success: true, data: order })
//   res.json({ success: true, data: null });
// });

// router.put('/orders/:orderId/request-bill', async (req, res) => {
//   // TODO: const { orderId } = req.params
//   // TODO: const order = await Order.findById(orderId)
//   // TODO: io.to(order.restaurantId).emit('table:requestBill', {
//   // TODO:   tableId: order.tableId,
//   // TODO:   tableNumber: order.tableNumber,
//   // TODO:   restaurantId: order.restaurantId
//   // TODO: })
//   // TODO: res.json({ success: true })
//   res.json({ success: true });
// });

// router.put('/tables/:tableId/request-water', async (req, res) => {
//   // TODO: const { tableId } = req.params
//   // TODO: const table = await Table.findById(tableId)
//   // TODO: io.to(table.restaurantId).emit('table:requestWater', {
//   // TODO:   tableId,
//   // TODO:   tableNumber: table.number,
//   // TODO:   restaurantId: table.restaurantId
//   // TODO: })
//   // TODO: res.json({ success: true })
//   res.json({ success: true });
// });

// // ════════════════════════════════════════
// // STAFF ROUTES (auth required)
// // ════════════════════════════════════════

// // TODO: Middleware to verify JWT token
// // const authenticateToken = (req, res, next) => {
// //   const token = req.headers['authorization']?.split(' ')[1]
// //   if (!token) return res.status(401).json({ error: 'Unauthorized' })
// //   try {
// //     const payload = JSON.parse(atob(token))
// //     if (payload.exp < Date.now()) return res.status(401).json({ error: 'Token expired' })
// //     req.user = payload
// //     next()
// //   } catch (e) {
// //     res.status(401).json({ error: 'Invalid token' })
// //   }
// // }

// router.post('/auth/login', async (req, res) => {
//   // TODO: const { email, password } = req.body
//   // TODO: const user = await Staff.findOne({ email })
//   // TODO: if (!user || !(await bcrypt.compare(password, user.hashedPassword)))
//   // TODO:   return res.status(401).json({ error: 'Invalid credentials' })
//   // TODO: const payload = { _id: user._id, name: user.name, role: user.role, restaurantId: user.restaurantId, exp: Date.now() + 24*60*60*1000 }
//   // TODO: const token = btoa(JSON.stringify(payload))
//   // TODO: res.json({ success: true, data: { token, staff: { ...payload } } })
//   res.json({ success: true, data: null });
// });


// router.get('/restaurant/:_id/tables', async (req, res) => {
//   // TODO: const { _id } = req.params
//   // TODO: const tables = await Table.find({ restaurantId: _id })
//   // TODO: res.json({ success: true, data: tables })
//   res.json({ success: true, data: [] });
// });

// router.get('/restaurant/:_id/orders', async (req, res) => {
//   // TODO: const { _id } = req.params
//   // TODO: const orders = await Order.find({ restaurantId: _id })
//   // TODO:   .populate('items')
//   // TODO:   .sort({ createdAt: -1 })
//   // TODO: res.json({ success: true, data: orders })
//   res.json({ success: true, data: [] });
// });

// router.put('/orders/:orderId/status', async (req, res) => {
//   // TODO: const { orderId } = req.params
//   // TODO: const { newStatus } = req.body
//   // TODO: const order = await Order.findByIdAndUpdate(orderId, { status: newStatus }, { new: true })
//   // TODO: io.to(order.restaurantId).emit('order:statusUpdate', {
//   // TODO:   orderId,
//   // TODO:   newStatus,
//   // TODO:   tableNumber: order.tableNumber,
//   // TODO:   restaurantId: order.restaurantId
//   // TODO: })
//   // TODO: res.json({ success: true, data: order })
//   res.json({ success: true, data: null });
// });

// router.get('/restaurant/:_id/stats', async (req, res) => {
//   // TODO: const { _id } = req.params
//   // TODO: const today = new Date().toDateString()
//   // TODO: const todayOrders = await Order.find({
//   // TODO:   restaurantId: _id,
//   // TODO:   createdAt: { $gte: new Date(today), $lt: new Date(today + ' 23:59:59') }
//   // TODO: })
//   // TODO: const revenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0)
//   // TODO: const popularItem = ... (aggregation logic)
//   // TODO: res.json({ success: true, data: { todayRevenue: revenue, ... } })
//   res.json({ success: true, data: null });
// });

// // ════════════════════════════════════════
// // OWNER-ONLY ROUTES (auth + role check required)
// // ════════════════════════════════════════

// router.put('/menu-items/:_id/price', async (req, res) => {
//   // TODO: const { _id } = req.params
//   // TODO: const { newPrice } = req.body
//   // TODO: if (req.user.role !== 'owner')
//   // TODO:   return res.status(403).json({ error: 'Forbidden' })
//   // TODO: const item = await MenuItem.findByIdAndUpdate(_id, { price: newPrice }, { new: true })
//   // TODO: res.json({ success: true, data: item })
//   res.json({ success: true, data: null });
// });

// router.get('/restaurant/:_id/popular-items', async (req, res) => {
//   // TODO: const { _id } = req.params
//   // TODO: const items = await MenuItem.find({ restaurantId: _id })
//   // TODO:   .sort({ orderCount: -1 })
//   // TODO:   .limit(5)
//   // TODO: res.json({ success: true, data: items })
//   res.json({ success: true, data: [] });
// });

// router.get('/subscriptions/plans', async (req, res) => {
//   // TODO: const plans = await SubscriptionPlan.find()
//   // TODO: res.json({ success: true, data: plans })
//   res.json({ success: true, data: [] });
// });

// router.post('/subscriptions/subscribe', async (req, res) => {
//   // TODO: const { planId, restaurantId } = req.body
//   // TODO: if (req.user.role !== 'owner' || req.user.restaurantId !== restaurantId)
//   // TODO:   return res.status(403).json({ error: 'Forbidden' })
//   // TODO: const subscription = await Subscription.create({ ... })
//   // TODO: res.json({ success: true, data: subscription })
//   res.json({ success: true, data: null });
// });

// export default router;


import express from 'express';
import { adminLogin } from '../controllers/adminController.js';
import { staffLogin } from '../controllers/staffController.js';
import {
  getRestaurantById,
  getRestaurantBySlug,
  getOwnerStats,
  getWeeklyRevenue,
} from '../controllers/restaurantController.js';
import {
  getMenuByRestaurantId,
  getMenuBySlug,
  addMenuItem,
  updateMenuItem,
} from '../controllers/menuController.js';
import {
  getCategoriesByRestaurantId,
  getCategoriesBySlug,
} from '../controllers/categoryController.js';
import {
  getTablesByRestaurant,
  getTableById,
  addTable,
  updateTable,
} from '../controllers/tableController.js';
import {
  getOrderById,
  getOrdersByRestaurant,
  getOrdersByTable,
  placeOrder,
  updateOrderStatus,
  processPayment,
} from '../controllers/orderController.js';

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/admin/login', adminLogin);
router.post('/staff/login', staffLogin);

// ── Restaurants ───────────────────────────────────────────────────────────────
router.get('/restaurants/:_id', getRestaurantById);
router.get('/restaurants/slug/:slug', getRestaurantBySlug);
router.get('/restaurants/:_id/stats', getOwnerStats);
router.get('/restaurants/:_id/revenue/weekly', getWeeklyRevenue);

// ── Menu ──────────────────────────────────────────────────────────────────────
router.get('/restaurants/:_id/menu', getMenuByRestaurantId);
router.get('/restaurants/slug/:slug/menu', getMenuBySlug);
router.post('/menu-items', addMenuItem);
router.patch('/menu-items/:_id', updateMenuItem);

// ── Categories ────────────────────────────────────────────────────────────────
router.get('/restaurants/:_id/categories', getCategoriesByRestaurantId);
router.get('/restaurants/slug/:slug/categories', getCategoriesBySlug);

// ── Tables ────────────────────────────────────────────────────────────────────
router.get('/restaurants/:_id/tables', getTablesByRestaurant);
router.get('/restaurants/:restaurantId/tables/:tableId', getTableById);
router.post('/tables', addTable);
router.patch('/tables/:_id', updateTable);

// ── Orders ────────────────────────────────────────────────────────────────────
router.get('/restaurants/:_id/orders', getOrdersByRestaurant);
router.get('/tables/:tableId/orders', getOrdersByTable);
router.get('/orders/:_id', getOrderById);
router.post('/orders', placeOrder);
router.patch('/orders/:_id/status', updateOrderStatus);
router.post('/orders/:_id/payment', processPayment);

export default router;