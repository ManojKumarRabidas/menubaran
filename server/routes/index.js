import express from 'express';
import { adminLogin } from '../controllers/adminController.js';
import { staffLogin, getStaffByRestaurant, createStaff, toggleStaffStatus, updateStaff, deleteStaff } from '../controllers/staffController.js';
import {
  getRestaurantById,
  getRestaurantBySlug,
  getOwnerStats,
  getWeeklyRevenue,
  registerRestaurant,
  getPendingRestaurants,
  approveRestaurant,
  rejectRestaurant
} from '../controllers/restaurantController.js';
import upload from '../middleware/uploadMiddleware.js';
import {
  getMenuByRestaurantId,
  getMenuBySlug,
  addMenuItem,
  updateMenuItem,
  bulkUploadMenuItems,
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
  getTodaysOrdersByRestaurant,
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
router.get('/restaurants/:_id/staff', getStaffByRestaurant);
router.post('/restaurants/:_id/staff', createStaff);
router.patch('/staff/:_id/toggle', toggleStaffStatus);
router.patch('/staff/:_id', updateStaff);
router.delete('/staff/:_id', deleteStaff);

router.post('/restaurants/register', upload.single('registrationDocument'), registerRestaurant);
router.get('/admin/restaurants/pending', getPendingRestaurants);
router.patch('/admin/restaurants/:_id/approve', approveRestaurant);
router.patch('/admin/restaurants/:_id/reject', rejectRestaurant);

router.get('/restaurants/:_id', getRestaurantById);
router.get('/restaurants/slug/:slug', getRestaurantBySlug);
router.get('/restaurants/:_id/stats', getOwnerStats);
router.get('/restaurants/:_id/revenue/weekly', getWeeklyRevenue);

// ── Menu ──────────────────────────────────────────────────────────────────────
router.get('/restaurants/:_id/menu', getMenuByRestaurantId);
router.get('/restaurants/slug/:slug/menu', getMenuBySlug);
router.post('/menu-items', addMenuItem);
router.post('/menu-items/bulk', bulkUploadMenuItems);
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
router.get('/restaurants/:_id/orders/today', getTodaysOrdersByRestaurant);
router.get('/tables/:tableId/orders', getOrdersByTable);
router.get('/orders/:_id', getOrderById);
router.post('/orders', placeOrder);
router.patch('/orders/:_id/status', updateOrderStatus);
router.post('/orders/:_id/payment', processPayment);

export default router;