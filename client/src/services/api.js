const API_URL = import.meta.env.VITE_API_URL || "/api"
import {
  restaurants,
  menuCategories,
  menuItems,
  tables,
  orders,
  staff,
  admin
} from '../data/data.js';

/**
 * Retrieves a restaurant by its slug
 * @param {string} slug - The restaurant slug
 * @returns {Promise<{data: object}>}
 */
export const getRestaurantBySlug = async (slug) => {
  const restaurant = restaurants.find(r => r.slug === slug);
  return Promise.resolve({ data: restaurant });
};

/**
 * Retrieves a restaurant by its database ID
 * @param {string} id - The restaurant ID (e.g. 'rest_1')
 * @returns {Promise<{data: object}>}
 */
export const getRestaurantById = async (id) => {
  try {
    if (!id) {
      return Promise.resolve({ data: null });
    }
    const responce = await fetch(`${API_URL}/api/restaurants/${id}`, { method: 'GET' }).then(res => res.json());
    if (responce.success) {
      console.log("responce restaurant", responce)
      return Promise.resolve({ data: responce.doc });
    }
    return Promise.resolve({ data: null });
  } catch (e) {
    return Promise.resolve({ data: null });
  }
};

/**
 * Retrieves a table by its database ID
 * @param {string} id - The table ID (e.g. 'table_1')
 * @returns {Promise<{data: object}>}
 */
export const getTableById = async (id) => {
  const table = tables.find(t => t.id === id);
  return Promise.resolve({ data: table });
};

/**
 * Retrieves all menu items for a restaurant by restaurant ID
 * @param {string} restaurantId - The restaurant ID
 * @returns {Promise<{data: array}>}
 */
export const getMenuByRestaurantId = async (restaurantId) => {
  return Promise.resolve({
    data: menuItems.filter(i => i.restaurantId === restaurantId)
  });
};

/**
 * Retrieves all menu categories for a restaurant by restaurant ID
 * @param {string} restaurantId - The restaurant ID
 * @returns {Promise<{data: array}>}
 */
export const getCategoriesByRestaurantId = async (restaurantId) => {
  return Promise.resolve({
    data: menuCategories
      .filter(c => c.restaurantId === restaurantId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  });
};

/**
 * Retrieves all menu items for a restaurant (slug-based, kept for staff pages)
 * @param {string} restaurantSlug - The restaurant slug
 * @returns {Promise<{data: array}>}
 */
export const getMenuByRestaurant = async (restaurantSlug) => {
  const restaurant = restaurants.find(r => r.slug === restaurantSlug);
  if (!restaurant) return Promise.resolve({ data: [] });
  return Promise.resolve({
    data: menuItems.filter(i => i.restaurantId === restaurant.id)
  });
};

/**
 * Retrieves all menu categories for a restaurant (slug-based, kept for staff pages)
 * @param {string} restaurantSlug - The restaurant slug
 * @returns {Promise<{data: array}>}
 */
export const getCategoriesByRestaurant = async (restaurantSlug) => {
  const restaurant = restaurants.find(r => r.slug === restaurantSlug);
  if (!restaurant) return Promise.resolve({ data: [] });
  return Promise.resolve({
    data: menuCategories
      .filter(c => c.restaurantId === restaurant.id)
      .sort((a, b) => a.sortOrder - b.sortOrder)
  });
};

/**
 * Places a new order
 * @param {object} orderPayload - { restaurantSlug, tableId, items, specialInstructions }
 * @returns {Promise<{data: object}>}
 */
export const placeOrder = async (orderPayload) => {
  const { restaurantSlug, tableId, items, specialInstructions } = orderPayload;
  // Support both real restaurant ID (e.g. 'rest_1') and slug (e.g. 'spice-garden')
  const restaurant =
    restaurants.find(r => r.id === restaurantSlug) ||
    restaurants.find(r => r.slug === restaurantSlug);
  const table = tables.find(t => t.id === tableId);

  if (!restaurant || !table) return Promise.resolve({ data: null });

  const totalAmount = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const newOrder = {
    id: `order_${Date.now()}`,
    restaurantId: restaurant.id,
    tableId,
    tableNumber: table.number,
    items,
    status: 'pending',
    statusHistory: [{ status: 'pending', timestamp: new Date() }],
    specialInstructions,
    createdAt: new Date(),
    totalAmount
  };

  orders.push(newOrder);
  table.status = 'occupied';
  table.currentOrderId = newOrder.id;

  return Promise.resolve({ data: newOrder });
};

/**
 * Retrieves an order by ID
 * @param {string} orderId - The order ID
 * @returns {Promise<{data: object}>}
 */
export const getOrderById = async (orderId) => {
  const order = orders.find(o => o.id === orderId);
  return Promise.resolve({ data: order });
};

/**
 * Updates an order's status
 * @param {string} orderId - The order ID
 * @param {string} newStatus - The new status
 * @returns {Promise<{data: object}>}
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  const order = orders.find(o => o.id === orderId);
  if (!order) return Promise.resolve({ data: null });

  order.status = newStatus;
  order.statusHistory.push({ status: newStatus, timestamp: new Date() });

  return Promise.resolve({ data: order });
};

/**
 * Retrieves all tables for a restaurant
 * @param {string} restaurantId - The restaurant ID
 * @returns {Promise<{data: array}>}
 */
export const getTablesByRestaurant = async (restaurantId) => {
  return Promise.resolve({
    data: tables.filter(t => t.restaurantId === restaurantId)
  });
};

/**
 * Updates a table's status
 * @param {string} tableId - The table ID
 * @param {string} status - The new status
 * @returns {Promise<{data: object}>}
 */
export const updateTableStatus = async (tableId, status) => {
  const table = tables.find(t => t.id === tableId);
  if (!table) return Promise.resolve({ data: null });

  table.status = status;
  return Promise.resolve({ data: table });
};

/**
 * Retrieves all orders for a restaurant
 * @param {string} restaurantId - The restaurant ID
 * @returns {Promise<{data: array}>}
 */
export const getOrdersByRestaurant = async (restaurantId) => {
  return Promise.resolve({
    data: orders.filter(o => o.restaurantId === restaurantId)
  });
};

/**
 * Authenticates staff and returns a mock JWT token
 * @param {string} email - Staff email
 * @param {string} password - Staff password
 * @returns {Promise<{data: {token: string, staff: object}}>}
 */
export const staffLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/api/staff/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(res => res.json()
  )
  if (response) {
    const result = response
    console.log("result staff", result)
    if (!response.success) {
      return Promise.reject({ error: 'Invalid credentials' });
    }
    // Create mock JWT: base64-encoded JSON payload
    const payload = {
      id: result.doc.staff.id,
      name: result.doc.staff.name,
      role: result.doc.staff.role,
      restaurantId: result.doc.staff.restaurantId,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
    const token = btoa(JSON.stringify(payload));

    return Promise.resolve({
      data: {
        token,
        staff: {
          id: result.doc.staff.id,
          name: result.doc.staff.name,
          role: result.doc.staff.role,
          restaurantId: result.doc.staff.restaurantId
        }
      }
    });
  }
  return Promise.reject({ error: 'Invalid credentials' });

  // Create mock JWT: base64-encoded JSON payload
  // const payload = {
  //   id: user.id,
  //   name: user.name,
  //   role: user.role,
  //   restaurantId: user.restaurantId,
  //   exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  // };
  // const token = btoa(JSON.stringify(payload));

  // return Promise.resolve({
  //   data: {
  //     token,
  //     staff: {
  //       id: user.id,
  //       name: user.name,
  //       role: user.role,
  //       restaurantId: user.restaurantId
  //     }
  //   }
  // });
};

/**
 * Authenticates admin and returns a mock JWT token
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<{data: {token: string, admin: object}}>}
 */

export const adminLogin = async (email, password) => {
  const response = await fetch(`${API_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(res => res.json()
  )
  if (response) {
    const result = response
    if (!response.success) {
      return Promise.reject({ error: 'Invalid credentials' });
    }
    // Create mock JWT: base64-encoded JSON payload
    const payload = {
      id: result.doc.id,
      name: result.doc.name,
      role: result.doc.role,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    };
    const token = btoa(JSON.stringify(payload));

    return Promise.resolve({
      data: {
        token,
        staff: {
          id: result.doc.id,
          name: result.doc.name,
          role: result.doc.role
        }
      }
    });
  }

}

/**
 * Retrieves owner stats for a restaurant
 * @param {string} restaurantId - The restaurant ID
 * @returns {Promise<{data: object}>}
 */
export const getOwnerStats = async (restaurantId) => {
  const restaurantOrders = orders.filter(o => o.restaurantId === restaurantId);
  const todayOrders = restaurantOrders.filter(o => {
    const today = new Date();
    const orderDate = new Date(o.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = todayOrders.length > 0 ? todayRevenue / todayOrders.length : 0;

  // Calculate most popular item
  const itemCounts = {};
  restaurantOrders.forEach(order => {
    order.items.forEach(item => {
      itemCounts[item.menuItemId] = (itemCounts[item.menuItemId] || 0) + item.qty;
    });
  });

  let mostPopularItemId = null;
  let maxCount = 0;
  for (const [itemId, count] of Object.entries(itemCounts)) {
    if (count > maxCount) {
      maxCount = count;
      mostPopularItemId = itemId;
    }
  }

  const mostPopularItem = mostPopularItemId ? menuItems.find(i => i.id === mostPopularItemId) : null;

  return Promise.resolve({
    data: {
      todayRevenue: parseFloat(todayRevenue.toFixed(2)),
      totalOrders: todayOrders.length,
      avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
      mostPopularItem: mostPopularItem ? { id: mostPopularItem.id, name: mostPopularItem.name, orderCount: maxCount } : null,
      allOrders: restaurantOrders.slice(-10).reverse() // Last 10 orders
    }
  });
};

/**
 * Updates a menu item's price
 * @param {string} itemId - The menu item ID
 * @param {number} newPrice - The new price
 * @returns {Promise<{data: object}>}
 */
export const updateMenuItemPrice = async (itemId, newPrice) => {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return Promise.resolve({ data: null });

  item.price = parseFloat(newPrice);
  return Promise.resolve({ data: item });
};

/**
 * Updates a menu item's fields (name, price, image, availability)
 * @param {string} itemId
 * @param {object} updates - partial updates to apply
 */
export const updateMenuItem = async (itemId, updates) => {
  const item = menuItems.find(i => i.id === itemId);
  if (!item) return Promise.resolve({ data: null });
  Object.assign(item, updates);
  return Promise.resolve({ data: item });
};

/**
 * Adds a new menu item
 * @param {object} payload - { restaurantId, categoryId, name, price, emoji, description, isAvailable }
 */
export const addMenuItem = async (payload) => {
  const GRADIENTS = [
    ['from-orange-100', 'to-orange-200'],
    ['from-rose-100', 'to-rose-200'],
    ['from-emerald-100', 'to-emerald-200'],
    ['from-sky-100', 'to-sky-200'],
    ['from-purple-100', 'to-purple-200'],
    ['from-amber-100', 'to-amber-200'],
  ];
  const g = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
  const newItem = {
    id: `item_${Date.now()}`,
    restaurantId: payload.restaurantId,
    categoryId: payload.categoryId,
    name: payload.name,
    price: parseFloat(payload.price),
    emoji: payload.emoji || '🍽️',
    description: payload.description || '',
    isAvailable: payload.isAvailable !== false,
    gradientFrom: g[0],
    gradientTo: g[1],
    orderCount: 0,
  };
  menuItems.push(newItem);
  return Promise.resolve({ data: newItem });
};

/**
 * Updates a table's fields (number/name, status)
 * @param {string} tableId
 * @param {object} updates
 */
export const updateTable = async (tableId, updates) => {
  const table = tables.find(t => t.id === tableId);
  if (!table) return Promise.resolve({ data: null });
  Object.assign(table, updates);
  return Promise.resolve({ data: table });
};

/**
 * Adds a new table
 * @param {string} restaurantId
 * @param {number} number
 */
export const addTable = async (restaurantId, number) => {
  const newTable = {
    id: `table_${Date.now()}`,
    restaurantId,
    number,
    status: 'free',
    currentOrderId: null
  };
  tables.push(newTable);
  return Promise.resolve({ data: newTable });
};

/**
 * Processes a mock payment for an order
 * @param {string} orderId
 * @param {string} method - 'cash' | 'card' | 'upi'
 * @param {number} tip - tip amount
 */
export const processPayment = async (orderId, method, tip = 0) => {
  const order = orders.find(o => o.id === orderId);
  if (!order) return Promise.resolve({ data: null });

  order.paymentStatus = 'paid';
  order.paymentMethod = method;
  order.tipAmount = parseFloat(tip) || 0;
  order.paidAt = new Date();
  order.status = 'paid';
  order.statusHistory.push({ status: 'paid', timestamp: new Date() });

  // Free up the table
  const table = tables.find(t => t.id === order.tableId);
  if (table) {
    table.status = 'free';
    table.currentOrderId = null;
  }

  return Promise.resolve({ data: order });
};

/**
 * Returns simulated 7-day revenue data for a restaurant
 * @param {string} restaurantId
 */
export const getWeeklyRevenue = async (restaurantId) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = days.map((day, i) => ({
    day,
    revenue: Math.round((80 + Math.random() * 220) * 10) / 10,
    orders: Math.floor(Math.random() * 25) + 5
  }));
  return Promise.resolve({ data });
};

// Helper: Add orderCount to items for demo purposes
menuItems.forEach(item => {
  item.orderCount = Math.floor(Math.random() * 50) + 5;
});

// Helper: Add paymentStatus to existing orders
orders.forEach((order, i) => {
  if (!order.paymentStatus) {
    order.paymentStatus = order.status === 'served' && i % 2 === 0 ? 'paid' : 'unpaid';
    if (order.paymentStatus === 'paid') {
      order.paymentMethod = ['cash', 'card', 'upi'][i % 3];
      order.tipAmount = Math.round(order.totalAmount * 0.1 * 10) / 10;
    }
  }
});
