

const API_URL = import.meta.env.VITE_API_URL || '';

// ── Shared fetch helper ───────────────────────────────────────────────────────
const api = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  return res.json();
};

// ── Restaurants ───────────────────────────────────────────────────────────────

export const getRestaurantBySlug = async (slug) => {
  try {
    if (!slug) return { data: null };
    const res = await api(`/api/restaurants/slug/${slug}`);
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const getRestaurantById = async (_id) => {
  try {
    if (!_id) return { data: null };
    const res = await api(`/api/restaurants/${_id}`);
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

// ── Menu ──────────────────────────────────────────────────────────────────────

export const getMenuByRestaurantId = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: [] };
    const res = await api(`/api/restaurants/${restaurantId}/menu`);
    return { data: res.success ? res.docs : [] };
  } catch {
    return { data: [] };
  }
};

export const getMenuByRestaurant = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: [] };
    const res = await api(`/api/restaurants/${restaurantId}/menu`);
    console.log("res menu", res)
    return { data: res.success ? res.docs : [] };
  } catch {
    return { data: [] };
  }
};

export const addMenuItem = async (payload) => {
  try {
    const res = await api(`/api/menu-items`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const updateMenuItem = async (itemId, updates) => {
  try {
    const res = await api(`/api/menu-items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const updateMenuItemPrice = async (itemId, newPrice) => {
  return updateMenuItem(itemId, { price: parseFloat(newPrice) });
};

// ── Categories ────────────────────────────────────────────────────────────────

export const getCategoriesByRestaurantId = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: [] };
    const res = await api(`/api/restaurants/${restaurantId}/categories`);
    return { data: res.success ? res.docs : [] };
  } catch {
    return { data: [] };
  }
};

export const getCategoriesByRestaurant = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: [] };
    const res = await api(`/api/restaurants/${restaurantId}/categories`);
    return { data: res.success ? res.docs : [] };
  } catch {
    return { data: [] };
  }
};

// ── Tables ────────────────────────────────────────────────────────────────────

export const getTablesByRestaurant = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: [] };
    const res = await api(`/api/restaurants/${restaurantId}/tables`);
    return { data: res.success ? res.docs : [] };
  } catch {
    return { data: [] };
  }
};

export const getTableById = async (restaurantId, tableId) => {
  try {
    if (!restaurantId || !tableId) return { data: null };
    const res = await api(`/api/restaurants/${restaurantId}/tables/${tableId}`);
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const addTable = async (restaurantId, number) => {
  try {
    const res = await api(`/api/tables`, {
      method: 'POST',
      body: JSON.stringify({ restaurantId, number }),
    });
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const updateTable = async (tableId, updates) => {
  try {
    const res = await api(`/api/tables/${tableId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const updateTableStatus = async (tableId, status) => {
  return updateTable(tableId, { status });
};

// ── Orders ────────────────────────────────────────────────────────────────────

export const placeOrder = async (orderPayload) => {
  try {
    const res = await api(`/api/orders`, {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const getOrderById = async (orderId) => {
  try {
    if (!orderId) return { data: null };
    const res = await api(`/api/orders/${orderId}`);
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const getOrdersByRestaurant = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: [] };
    const res = await api(`/api/restaurants/${restaurantId}/orders`);
    return { data: res.success ? res.docs : [] };
  } catch {
    return { data: [] };
  }
};

export const getTodaysOrdersByRestaurant = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: [] };
    const res = await api(`/api/restaurants/${restaurantId}/orders/today`);
    return { data: res.success ? res.docs : [] };
  } catch {
    return { data: [] };
  }
};

export const getOrdersByTable = async (tableId) => {
  try {
    if (!tableId) return { data: [] };
    const res = await api(`/api/tables/${tableId}/orders`);
    return { data: res.success ? res.docs : [] };
  } catch {
    return { data: [] };
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const res = await api(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: newStatus }),
    });
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

export const processPayment = async (orderId, method, tip = 0) => {
  try {
    const res = await api(`/api/orders/${orderId}/payment`, {
      method: 'POST',
      body: JSON.stringify({ method, tip: parseFloat(tip) || 0 }),
    });
    return { data: res.success ? res.doc : null };
  } catch {
    return { data: null };
  }
};

// ── Stats & Revenue ───────────────────────────────────────────────────────────

export const getOwnerStats = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: null };
    const res = await api(`/api/restaurants/${restaurantId}/stats`);
    return { data: res.success ? res.data : null };
  } catch {
    return { data: null };
  }
};

export const getWeeklyRevenue = async (restaurantId) => {
  try {
    if (!restaurantId) return { data: [] };
    const res = await api(`/api/restaurants/${restaurantId}/revenue/weekly`);
    return { data: res.success ? res.data : [] };
  } catch {
    return { data: [] };
  }
};

// ── Auth ──────────────────────────────────────────────────────────────────────

export const staffLogin = async (email, password) => {
  const res = await api(`/api/staff/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!res.success) return Promise.reject({ error: 'Invalid credentials' });

  const { staff } = res.doc;
  const payload = {
    _id: staff._id,
    name: staff.name,
    role: staff.role,
    restaurantId: staff.restaurantId,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };

  return {
    data: {
      token: btoa(JSON.stringify(payload)),
      staff: { _id: staff._id, name: staff.name, role: staff.role, restaurantId: staff.restaurantId },
    },
  };
};

export const adminLogin = async (email, password) => {
  const res = await api(`/api/admin/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  if (!res.success) return Promise.reject({ error: 'Invalid credentials' });

  const admin = res.doc;
  const payload = {
    _id: admin._id,
    name: admin.name,
    role: admin.role,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };

  return {
    data: {
      token: btoa(JSON.stringify(payload)),
      staff: { _id: admin._id, name: admin.name, role: admin.role },
    },
  };
};