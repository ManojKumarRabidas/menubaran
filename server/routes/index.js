import express from 'express';
import { adminLogin } from '../controllers/adminController.js';
import { staffLogin, getStaffByRestaurant, createStaff, toggleStaffStatus, updateStaff, deleteStaff } from '../controllers/staffController.js';
import { getAllFeedback } from '../controllers/feedbackController.js';
import { getAllComplaints, resolveComplaint, markComplaintInProgress } from '../controllers/complaintController.js';
import {
  getRestaurantById,
  getRestaurantBySlug,
  getOwnerStats,
  getWeeklyRevenue,
  registerRestaurant,
  getPendingRestaurants,
  approveRestaurant,
  rejectRestaurant,
  getAllRestaurants,
  toggleLoginPermission,
  getAdminStats,
  updateRestaurant
} from '../controllers/restaurantController.js';
import { getUploader } from '../config/upload.js';
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
  createCategory,
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
import {
  getPendingRequestsByRestaurant,
  clearRequest,
  clearTableRequests,
} from '../controllers/requestController.js';

const router = express.Router();

// ── Auth ──────────────────────────────────────────────────────────────────────
router.post('/admin/login', adminLogin);
router.post('/staff/login', staffLogin);

// ── Restaurants ───────────────────────────────────────────────────────────────
router.patch('/restaurants/:_id', updateRestaurant);
router.get('/restaurants/:_id/staff', getStaffByRestaurant);
router.post('/restaurants/:_id/staff', createStaff);
router.patch('/staff/:_id/toggle', toggleStaffStatus);
router.patch('/staff/:_id', updateStaff);
router.delete('/staff/:_id', deleteStaff);

router.post('/restaurants/register', getUploader('restaurants').fields([
  { name: 'registrationDocument', maxCount: 1 },
  { name: 'fssaiCertificate', maxCount: 1 },
  { name: 'panCard', maxCount: 1 },
  { name: 'bankPassbook', maxCount: 1 },
  { name: 'shopPhoto', maxCount: 1 },
  { name: 'restaurantLogo', maxCount: 1 },
  // { name: 'menuImages', maxCount: 10 }
]), registerRestaurant);
router.get('/admin/stats', getAdminStats);
router.get('/admin/restaurants', getAllRestaurants);
router.get('/admin/restaurants/pending', getPendingRestaurants);
router.patch('/admin/restaurants/:_id/approve', approveRestaurant);
router.patch('/admin/restaurants/:_id/reject', rejectRestaurant);
router.patch('/admin/restaurants/:_id/toggle-login', toggleLoginPermission);

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
router.post('/categories', createCategory);

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

// ── Table Requests ────────────────────────────────────────────────────────────
router.get('/restaurants/:restaurantId/requests', getPendingRequestsByRestaurant);
router.patch('/requests/:_id/clear', clearRequest);
router.post('/tables/clear-requests', clearTableRequests);

// ── Feedback & Complaints (restaurant → MenuBaran platform) ──────────────────
router.get('/admin/feedback', getAllFeedback);
router.get('/admin/complaints', getAllComplaints);
router.patch('/admin/complaints/:_id/resolve', resolveComplaint);
router.patch('/admin/complaints/:_id/progress', markComplaintInProgress);

export default router;