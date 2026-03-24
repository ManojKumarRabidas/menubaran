// Mock data for restaurant SaaS
// Each object follows the exact schema from the specification

export const restaurants = [
  {
    id: 'rest_1',
    slug: 'spice-garden',
    name: 'Spice Garden',
    tagline: 'Authentic Indian Cuisine',
    address: '123 Curry Lane, Flavor City',
    logoPlaceholderColor: 'from-amber-600 to-orange-500',
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active'
  },
  {
    id: 'rest_2',
    slug: 'pizza-palace',
    name: 'Pizza Palace',
    tagline: 'Classic Italian Pizzeria',
    address: '456 Dough Street, Cheese Town',
    logoPlaceholderColor: 'from-red-600 to-orange-500',
    subscriptionPlan: 'enterprise',
    subscriptionStatus: 'active'
  }
];

export const menuCategories = [
  { id: 'cat_1', restaurantId: 'rest_1', name: 'Appetizers', icon: '🥘', sortOrder: 1 },
  { id: 'cat_2', restaurantId: 'rest_1', name: 'Breads', icon: '🍞', sortOrder: 2 },
  { id: 'cat_3', restaurantId: 'rest_1', name: 'Main Course', icon: '🍛', sortOrder: 3 },
  { id: 'cat_4', restaurantId: 'rest_1', name: 'Biryani', icon: '🍚', sortOrder: 4 },
  { id: 'cat_5', restaurantId: 'rest_1', name: 'Desserts', icon: '🍮', sortOrder: 5 },
  
  { id: 'cat_6', restaurantId: 'rest_2', name: 'Pizzas', icon: '🍕', sortOrder: 1 },
  { id: 'cat_7', restaurantId: 'rest_2', name: 'Pasta', icon: '🍝', sortOrder: 2 },
  { id: 'cat_8', restaurantId: 'rest_2', name: 'Salads', icon: '🥗', sortOrder: 3 },
  { id: 'cat_9', restaurantId: 'rest_2', name: 'Appetizers', icon: '🥒', sortOrder: 4 },
  { id: 'cat_10', restaurantId: 'rest_2', name: 'Desserts', icon: '🍰', sortOrder: 5 }
];

export const menuItems = [
  // Spice Garden items
  { id: 'item_1', categoryId: 'cat_1', restaurantId: 'rest_1', name: 'Samosa', description: 'Crispy fried pastry with spiced potato filling', price: 4.99, gradientFrom: 'from-amber-300', gradientTo: 'to-orange-400', isAvailable: true, isPopular: true, isVeg: true, tags: ['veg', 'fried'], preparationTimeMinutes: 5 },
  { id: 'item_2', categoryId: 'cat_1', restaurantId: 'rest_1', name: 'Paneer Tikka', description: 'Grilled cottage cheese with tandoori spices', price: 7.99, gradientFrom: 'from-pink-300', gradientTo: 'to-red-300', isAvailable: true, isPopular: true, isVeg: true, tags: ['veg', 'tandoori'], preparationTimeMinutes: 10 },
  { id: 'item_3', categoryId: 'cat_1', restaurantId: 'rest_1', name: 'Chicken Tikka', description: 'Tender chicken with tandoori spices', price: 8.99, gradientFrom: 'from-orange-300', gradientTo: 'to-red-400', isAvailable: true, isPopular: false, isVeg: false, tags: ['non-veg', 'tandoori'], preparationTimeMinutes: 12 },
  
  { id: 'item_4', categoryId: 'cat_2', restaurantId: 'rest_1', name: 'Naan', description: 'Traditional Indian flatbread', price: 2.99, gradientFrom: 'from-amber-200', gradientTo: 'to-yellow-300', isAvailable: true, isPopular: true, isVeg: true, tags: ['bread', 'veg'], preparationTimeMinutes: 4 },
  { id: 'item_5', categoryId: 'cat_2', restaurantId: 'rest_1', name: 'Roti', description: 'Whole wheat flatbread', price: 1.99, gradientFrom: 'from-yellow-200', gradientTo: 'to-orange-200', isAvailable: true, isPopular: false, isVeg: true, tags: ['bread', 'veg'], preparationTimeMinutes: 3 },
  { id: 'item_6', categoryId: 'cat_2', restaurantId: 'rest_1', name: 'Garlic Naan', description: 'Naan with garlic and herbs', price: 3.99, gradientFrom: 'from-orange-200', gradientTo: 'to-yellow-300', isAvailable: true, isPopular: true, isVeg: true, tags: ['bread', 'veg'], preparationTimeMinutes: 5 },
  
  { id: 'item_7', categoryId: 'cat_3', restaurantId: 'rest_1', name: 'Butter Chicken', description: 'Creamy tomato-based chicken curry', price: 9.99, gradientFrom: 'from-red-300', gradientTo: 'to-orange-300', isAvailable: true, isPopular: true, isVeg: false, tags: ['non-veg', 'curry'], preparationTimeMinutes: 15 },
  { id: 'item_8', categoryId: 'cat_3', restaurantId: 'rest_1', name: 'Chole Bhature', description: 'Chickpea curry with fried bread', price: 6.99, gradientFrom: 'from-orange-400', gradientTo: 'to-yellow-400', isAvailable: true, isPopular: false, isVeg: true, tags: ['veg', 'curry'], preparationTimeMinutes: 12 },
  { id: 'item_9', categoryId: 'cat_3', restaurantId: 'rest_1', name: 'Palak Paneer', description: 'Spinach and cottage cheese curry', price: 7.99, gradientFrom: 'from-green-400', gradientTo: 'to-emerald-300', isAvailable: true, isPopular: true, isVeg: true, tags: ['veg', 'curry'], preparationTimeMinutes: 10 },
  
  { id: 'item_10', categoryId: 'cat_4', restaurantId: 'rest_1', name: 'Chicken Biryani', description: 'Fragrant rice with marinated chicken', price: 10.99, gradientFrom: 'from-yellow-300', gradientTo: 'to-orange-400', isAvailable: true, isPopular: true, isVeg: false, tags: ['non-veg', 'rice'], preparationTimeMinutes: 18 },
  { id: 'item_11', categoryId: 'cat_4', restaurantId: 'rest_1', name: 'Veg Biryani', description: 'Fragrant rice with mixed vegetables', price: 8.99, gradientFrom: 'from-yellow-300', gradientTo: 'to-green-400', isAvailable: true, isPopular: true, isVeg: true, tags: ['veg', 'rice'], preparationTimeMinutes: 16 },
  
  { id: 'item_12', categoryId: 'cat_5', restaurantId: 'rest_1', name: 'Gulab Jamun', description: 'Soft dough balls in sweet syrup', price: 3.99, gradientFrom: 'from-red-300', gradientTo: 'to-pink-300', isAvailable: true, isPopular: false, isVeg: true, tags: ['dessert', 'veg'], preparationTimeMinutes: 5 },
  { id: 'item_13', categoryId: 'cat_5', restaurantId: 'rest_1', name: 'Kheer', description: 'Rice pudding with condensed milk', price: 3.49, gradientFrom: 'from-amber-200', gradientTo: 'to-orange-200', isAvailable: true, isPopular: true, isVeg: true, tags: ['dessert', 'veg'], preparationTimeMinutes: 6 },
  
  // Pizza Palace items
  { id: 'item_14', categoryId: 'cat_6', restaurantId: 'rest_2', name: 'Margherita', description: 'Classic pizza with mozzarella and basil', price: 9.99, gradientFrom: 'from-red-400', gradientTo: 'to-orange-400', isAvailable: true, isPopular: true, isVeg: true, tags: ['pizza', 'veg'], preparationTimeMinutes: 12 },
  { id: 'item_15', categoryId: 'cat_6', restaurantId: 'rest_2', name: 'Pepperoni', description: 'Pizza topped with pepperoni slices', price: 11.99, gradientFrom: 'from-red-500', gradientTo: 'to-red-400', isAvailable: true, isPopular: true, isVeg: false, tags: ['pizza', 'non-veg'], preparationTimeMinutes: 13 },
  { id: 'item_16', categoryId: 'cat_6', restaurantId: 'rest_2', name: 'Veggie Supreme', description: 'Loaded with fresh vegetables', price: 10.99, gradientFrom: 'from-green-400', gradientTo: 'to-orange-400', isAvailable: true, isPopular: false, isVeg: true, tags: ['pizza', 'veg'], preparationTimeMinutes: 14 },
  
  { id: 'item_17', categoryId: 'cat_7', restaurantId: 'rest_2', name: 'Spaghetti Carbonara', description: 'Creamy pasta with bacon and cheese', price: 10.99, gradientFrom: 'from-yellow-300', gradientTo: 'to-orange-300', isAvailable: true, isPopular: true, isVeg: false, tags: ['pasta', 'non-veg'], preparationTimeMinutes: 11 },
  { id: 'item_18', categoryId: 'cat_7', restaurantId: 'rest_2', name: 'Penne Arrabbiata', description: 'Spicy tomato and garlic pasta', price: 9.99, gradientFrom: 'from-red-400', gradientTo: 'to-orange-400', isAvailable: true, isPopular: true, isVeg: true, tags: ['pasta', 'veg'], preparationTimeMinutes: 10 },
  
  { id: 'item_19', categoryId: 'cat_8', restaurantId: 'rest_2', name: 'Caesar Salad', description: 'Crisp romaine with parmesan and croutons', price: 7.99, gradientFrom: 'from-green-300', gradientTo: 'to-emerald-300', isAvailable: true, isPopular: false, isVeg: true, tags: ['salad', 'veg'], preparationTimeMinutes: 5 },
  
  { id: 'item_20', categoryId: 'cat_9', restaurantId: 'rest_2', name: 'Garlic Bread', description: 'Crusty bread with garlic and herbs', price: 4.99, gradientFrom: 'from-amber-300', gradientTo: 'to-yellow-300', isAvailable: true, isPopular: true, isVeg: true, tags: ['appetizer', 'veg'], preparationTimeMinutes: 5 },
  
  { id: 'item_21', categoryId: 'cat_10', restaurantId: 'rest_2', name: 'Tiramisu', description: 'Classic Italian dessert with mascarpone', price: 5.99, gradientFrom: 'from-amber-400', gradientTo: 'to-orange-400', isAvailable: true, isPopular: true, isVeg: true, tags: ['dessert', 'veg'], preparationTimeMinutes: 3 }
];

export const tables = [
  // Spice Garden
  { id: 'table_1', restaurantId: 'rest_1', number: 1, status: 'free', currentOrderId: null },
  { id: 'table_2', restaurantId: 'rest_1', number: 2, status: 'occupied', currentOrderId: 'order_1' },
  { id: 'table_3', restaurantId: 'rest_1', number: 3, status: 'free', currentOrderId: null },
  { id: 'table_4', restaurantId: 'rest_1', number: 4, status: 'bill-requested', currentOrderId: 'order_2' },
  { id: 'table_5', restaurantId: 'rest_1', number: 5, status: 'water-requested', currentOrderId: 'order_3' },
  { id: 'table_6', restaurantId: 'rest_1', number: 6, status: 'free', currentOrderId: null },
  
  // Pizza Palace
  { id: 'table_7', restaurantId: 'rest_2', number: 1, status: 'free', currentOrderId: null },
  { id: 'table_8', restaurantId: 'rest_2', number: 2, status: 'occupied', currentOrderId: 'order_4' },
  { id: 'table_9', restaurantId: 'rest_2', number: 3, status: 'free', currentOrderId: null },
  { id: 'table_10', restaurantId: 'rest_2', number: 4, status: 'occupied', currentOrderId: 'order_5' },
  { id: 'table_11', restaurantId: 'rest_2', number: 5, status: 'bill-requested', currentOrderId: 'order_6' },
  { id: 'table_12', restaurantId: 'rest_2', number: 6, status: 'free', currentOrderId: null }
];

export const orders = [
  {
    id: 'order_1',
    restaurantId: 'rest_1',
    tableId: 'table_2',
    tableNumber: 2,
    items: [
      { menuItemId: 'item_7', name: 'Butter Chicken', qty: 1, price: 9.99, note: 'Medium spicy' },
      { menuItemId: 'item_4', name: 'Naan', qty: 2, price: 2.99, note: '' }
    ],
    status: 'cooking',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 15 * 60000) },
      { status: 'cooking', timestamp: new Date(Date.now() - 5 * 60000) }
    ],
    specialInstructions: 'No onions please',
    createdAt: new Date(Date.now() - 20 * 60000),
    totalAmount: 15.97
  },
  {
    id: 'order_2',
    restaurantId: 'rest_1',
    tableId: 'table_4',
    tableNumber: 4,
    items: [
      { menuItemId: 'item_10', name: 'Chicken Biryani', qty: 1, price: 10.99, note: '' },
      { menuItemId: 'item_13', name: 'Kheer', qty: 1, price: 3.49, note: '' }
    ],
    status: 'served',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 45 * 60000) },
      { status: 'cooking', timestamp: new Date(Date.now() - 35 * 60000) },
      { status: 'ready', timestamp: new Date(Date.now() - 10 * 60000) },
      { status: 'served', timestamp: new Date(Date.now() - 5 * 60000) }
    ],
    specialInstructions: '',
    createdAt: new Date(Date.now() - 50 * 60000),
    totalAmount: 14.48
  },
  {
    id: 'order_3',
    restaurantId: 'rest_1',
    tableId: 'table_5',
    tableNumber: 5,
    items: [
      { menuItemId: 'item_8', name: 'Chole Bhature', qty: 2, price: 6.99, note: 'Extra chutney' }
    ],
    status: 'ready',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 20 * 60000) },
      { status: 'cooking', timestamp: new Date(Date.now() - 12 * 60000) },
      { status: 'ready', timestamp: new Date(Date.now() - 2 * 60000) }
    ],
    specialInstructions: '',
    createdAt: new Date(Date.now() - 25 * 60000),
    totalAmount: 13.98
  },
  {
    id: 'order_4',
    restaurantId: 'rest_2',
    tableId: 'table_8',
    tableNumber: 2,
    items: [
      { menuItemId: 'item_14', name: 'Margherita', qty: 1, price: 9.99, note: '' },
      { menuItemId: 'item_20', name: 'Garlic Bread', qty: 1, price: 4.99, note: '' }
    ],
    status: 'pending',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 8 * 60000) }
    ],
    specialInstructions: 'Extra basil',
    createdAt: new Date(Date.now() - 10 * 60000),
    totalAmount: 14.98
  },
  {
    id: 'order_5',
    restaurantId: 'rest_2',
    tableId: 'table_10',
    tableNumber: 4,
    items: [
      { menuItemId: 'item_15', name: 'Pepperoni', qty: 1, price: 11.99, note: '' },
      { menuItemId: 'item_17', name: 'Spaghetti Carbonara', qty: 1, price: 10.99, note: '' }
    ],
    status: 'cooking',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 12 * 60000) },
      { status: 'cooking', timestamp: new Date(Date.now() - 3 * 60000) }
    ],
    specialInstructions: '',
    createdAt: new Date(Date.now() - 15 * 60000),
    totalAmount: 22.98
  },
  {
    id: 'order_6',
    restaurantId: 'rest_2',
    tableId: 'table_11',
    tableNumber: 5,
    items: [
      { menuItemId: 'item_16', name: 'Veggie Supreme', qty: 1, price: 10.99, note: '' },
      { menuItemId: 'item_21', name: 'Tiramisu', qty: 1, price: 5.99, note: '' }
    ],
    status: 'served',
    statusHistory: [
      { status: 'pending', timestamp: new Date(Date.now() - 40 * 60000) },
      { status: 'cooking', timestamp: new Date(Date.now() - 28 * 60000) },
      { status: 'ready', timestamp: new Date(Date.now() - 8 * 60000) },
      { status: 'served', timestamp: new Date(Date.now() - 3 * 60000) }
    ],
    specialInstructions: '',
    createdAt: new Date(Date.now() - 45 * 60000),
    totalAmount: 16.98
  }
];

export const staff = [
  // Spice Garden
  { id: 'staff_1', restaurantId: 'rest_1', name: 'Raj Kumar', email: 'cook@spice-garden.com', password: 'password123', role: 'cook', avatarColor: 'bg-orange-500' },
  { id: 'staff_2', restaurantId: 'rest_1', name: 'Priya Sharma', email: 'waiter@spice-garden.com', password: 'password123', role: 'waiter', avatarColor: 'bg-blue-500' },
  { id: 'staff_3', restaurantId: 'rest_1', name: 'Anil Patel', email: 'owner@spice-garden.com', password: 'password123', role: 'owner', avatarColor: 'bg-purple-500' },
  
  // Pizza Palace
  { id: 'staff_4', restaurantId: 'rest_2', name: 'Marco Rossi', email: 'cook@pizza-palace.com', password: 'password123', role: 'cook', avatarColor: 'bg-red-500' },
  { id: 'staff_5', restaurantId: 'rest_2', name: 'Sofia Moretti', email: 'waiter@pizza-palace.com', password: 'password123', role: 'waiter', avatarColor: 'bg-sky-500' },
  { id: 'staff_6', restaurantId: 'rest_2', name: 'Giovanni Torrini', email: 'owner@pizza-palace.com', password: 'password123', role: 'owner', avatarColor: 'bg-indigo-500' }
];

export const subscriptionPlans = [
  {
    id: 'plan_1',
    name: 'Basic',
    price: 29,
    billingCycle: 'monthly',
    features: ['Up to 10 tables', 'Basic analytics', 'Email support'],
    maxTables: 10,
    maxStaff: 5,
    isPopular: false
  },
  {
    id: 'plan_2',
    name: 'Pro',
    price: 79,
    billingCycle: 'monthly',
    features: ['Up to 30 tables', 'Advanced analytics', 'Priority support', 'Custom menu'],
    maxTables: 30,
    maxStaff: 15,
    isPopular: true
  },
  {
    id: 'plan_3',
    name: 'Enterprise',
    price: 199,
    billingCycle: 'monthly',
    features: ['Unlimited tables', 'Custom integrations', '24/7 dedicated support', 'White label option'],
    maxTables: null,
    maxStaff: null,
    isPopular: false
  }
];
