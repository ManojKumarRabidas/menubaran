# Restaurant SaaS Automation Prototype

A complete, production-ready restaurant management system built with React + Vite, Express, and Socket.io. Enables customers to browse menus, place orders, and track status in real-time, while staff manage kitchen operations and dining room service.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Restaurant SaaS                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐         ┌─────────────────────────┐   │
│  │   CUSTOMER      │         │    STAFF (Protected)    │   │
│  │  No Auth        │         │    JWT Auth             │   │
│  │                 │         │                         │   │
│  │  • Menu Browse  │         │ Roles:                  │   │
│  │  • Cart Mgmt    │         │ • Cook → Kitchen        │   │
│  │  • Ordering     │         │ • Waiter → Floor Mgmt   │   │
│  │  • Live Track   │         │ • Owner → Dashboard     │   │
│  └────────┬────────┘         └────────┬────────────────┘   │
│           │                           │                    │
│           └───────────┬───────────────┘                    │
│                       ▼                                     │
│           ┌──────────────────────┐                         │
│           │   React 18 + Vite    │                         │
│           │   - Context API      │                         │
│           │   - Socket.io Client │                         │
│           │   - React Router v6  │                         │
│           └──────────┬───────────┘                         │
│                      │                                     │
│    ┌─────────────────┼─────────────────┐                  │
│    ▼                 ▼                 ▼                  │
│  /api/          /api/auth/        /socket.io            │
│  (public)       (staff)           (realtime)            │
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │         Express Server (Port 5000)              │    │
│  │  - Mock JWT Auth                               │    │
│  │  - Socket.io Event Broadcasting                │    │
│  │  - Structured TODO Routes (ready for backend)  │    │
│  └──────────────────────────────────────────────────┘    │
│                                                           │
└─────────────────────────────────────────────────────────────┘
```

## Project Structure

```
restaurant-saas/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/     # UI components (common, customer, kitchen, waiter, owner)
│   │   ├── pages/          # Page components
│   │   ├── context/        # React Context (Auth, Cart, Order)
│   │   ├── hooks/          # Custom hooks (useSocket, useAuth)
│   │   ├── services/       # API layer
│   │   ├── data/           # Mock data
│   │   ├── App.jsx         # Router configuration
│   │   └── main.jsx        # Entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express + Socket.io backend
│   ├── index.js            # Server entry point
│   ├── routes.js           # API routes (with TODO comments)
│   └── package.json
├── package.json            # Root monorepo config
└── README.md
```

## Technology Stack

- **Frontend:** React 18 + Vite (dev server with hot reload)
- **Styling:** Tailwind CSS only
- **Routing:** react-router-dom v6
- **State:** React Context API + useReducer
- **Real-time:** Custom useSocket hook with EventBus mock (socket.io-compatible)
- **Authentication:** Mock JWT tokens (base64-encoded JSON)
- **Backend:** Express + Socket.io skeleton (routes defined, bodies empty with TODOs)
- **Package Manager:** npm

## Setup Instructions

### Prerequisites
- Node.js 16+ and npm

### 1. Install Dependencies

```bash
# Frontend
cd client
npm install

# Backend (from root or new terminal)
cd server
npm install
```

### 2. Start Development Servers

**Terminal 1 - Frontend (Vite dev server):**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

**Terminal 2 - Backend (Express server):**
```bash
cd server
npm run dev
# Backend runs on http://localhost:5000
```

The frontend automatically proxies `/api` requests to the backend.

### 3. Access the Application

- **Customer Menu:** http://localhost:5173/menu/spice-garden/table/table_1
- **Staff Login:** http://localhost:5173/staff/login
- **Kitchen Display:** http://localhost:5173/kitchen (after login as cook)
- **Waiter Floor:** http://localhost:5173/floor (after login as waiter)
- **Owner Dashboard:** http://localhost:5173/dashboard (after login as owner)

## Role Access Matrix

| Role  | URL Path              | Features                                    |
|-------|----------------------|---------------------------------------------|
| Cook  | `/kitchen`           | View pending orders, start cooking, mark ready, audio alerts |
| Waiter| `/floor`             | Manage tables, real-time notifications      |
| Owner | `/dashboard`         | KPI stats, menu pricing, popular dishes, recent orders |
| Customer | `/menu/:slug/table/:id` | Browse menu, customize items, cart, track orders |

## Mock Staff Credentials

Use these to test staff functionality:

```
Cook (Spice Garden):
Email: cook@spice-garden.com
Password: password123

Waiter (Spice Garden):
Email: waiter@spice-garden.com
Password: password123

Owner (Spice Garden):
Email: owner@spice-garden.com
Password: password123

Cook (Pizza Palace):
Email: cook@pizza-palace.com
Password: password123

Waiter (Pizza Palace):
Email: waiter@pizza-palace.com
Password: password123

Owner (Pizza Palace):
Email: owner@pizza-palace.com
Password: password123
```

## QR Code Simulation (Customer Testing)

To simulate a real QR code-generated table link:

1. Start the frontend: http://localhost:5173
2. Generate test URLs:
   - **Spice Garden Table 1:** http://localhost:5173/menu/spice-garden/table/table_1
   - **Spice Garden Table 2:** http://localhost:5173/menu/spice-garden/table/table_2
   - **Pizza Palace Table 1:** http://localhost:5173/menu/pizza-palace/table/table_7

In production, a QR code would simply link to `/menu/{restaurantSlug}/table/{tableId}`.

## File Structure

```
restaurant-saas/
├── client/
│   ├── src/
│   │   ├── main.jsx                    ← Entry point
│   │   ├── App.jsx                     ← All routes defined here
│   │   ├── index.css                   ← Tailwind directives
│   │   ├── data/data.js               ← Mock database
│   │   ├── services/api.js            ← API layer (swappable)
│   │   ├── hooks/
│   │   │   ├── useSocket.js           ← Mock socket wrapper
│   │   │   └── useAuth.js             ← Auth utilities
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── OrderContext.jsx
│   │   ├── components/
│   │   │   ├── common/                ← ProtectedRoute, Navbar, Spinner
│   │   │   ├── customer/              ← Menu, Cart, Order Tracking
│   │   │   ├── kitchen/               ← Order Tickets, Alerts
│   │   │   ├── waiter/                ← Table Cards, Notifications
│   │   │   └── owner/                 ← KPI Cards, Chart, Editor
│   │   └── pages/
│   │       ├── customer/              ← MenuPage, CartPage, OrderTrackingPage
│   │       ├── staff/                 ← LoginPage, KitchenPage, FloorPage, DashboardPage
│   │       └── NotFoundPage.jsx
│   ├── index.html
│   ├── vite.config.js                 ← API proxy configured
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── server/
│   ├── index.js                       ← Express + Socket.io wiring
│   ├── routes.js                      ← All routes with TODO bodies
│   └── package.json
└── README.md
```

## Real-Time Features (EventBus Mock)

The system uses a custom `useSocket` hook that mimics socket.io-client interface:

```javascript
const { socket } = useSocket();

// Listen
socket.on('order:new', (data) => {
  // Handle new order
});

// Emit
socket.emit('order:statusUpdate', {
  orderId: 'order_123',
  newStatus: 'cooking'
});

// Cleanup
socket.off('order:statusUpdate', handler);
```

### Pre-wired Events

| Event | Trigger | Consumers |
|-------|---------|-----------|
| `order:new` | Customer places order | Kitchen (alert + ding), Waiter (notification) |
| `order:statusUpdate` | Cook marks step complete | Customer (stepper advances), Waiter (notification) |
| `table:requestBill` | Customer requests bill | Waiter (urgent red notification) |
| `table:requestWater` | Customer requests water | Waiter (notification) |

All events include a 100-300ms network latency simulation.

## Converting to Real Backend

Follow these steps when you're ready to connect a real database and backend:

### 1. **Update `client/src/services/api.js`**

Replace the mock import with axios:

```javascript
// BEFORE
import { restaurants, menuItems } from '../data/data.js'

// AFTER
import axios from 'axios'
const BASE = import.meta.env.VITE_API_URL
```

Update each function body (callers stay unchanged):

```javascript
// BEFORE
export const getMenuByRestaurant = async (slug) => {
  const restaurant = restaurants.find(r => r.slug === slug)
  return Promise.resolve({ data: menuItems.filter(...) })
}

// AFTER
export const getMenuByRestaurant = async (slug) => {
  return axios.get(`${BASE}/api/menu/${slug}`)
}
```

### 2. **Implement `server/routes.js`**

Replace TODO comments with actual database logic. Example:

```javascript
// BEFORE (placeholder)
router.get('/menu/:slug', async (req, res) => {
  // TODO: const restaurant = await Restaurant.findOne({ slug })
  // TODO: const items = await MenuItem.find({ restaurantId: restaurant?.id })
})

// AFTER (real implementation)
router.get('/menu/:slug', async (req, res) => {
  const restaurant = await Restaurant.findOne({ slug })
  if (!restaurant) return res.status(404).json({ error: 'Restaurant not found' })
  const items = await MenuItem.find({ restaurantId: restaurant.id, isAvailable: true })
  res.json({ success: true, data: items })
})
```

### 3. **Connect Socket.io**

In `server/index.js`, implement socket event handlers:

```javascript
io.on('connection', (socket) => {
  socket.on('order:new', (data) => {
    // Broadcast to all staff in the restaurant
    io.to(data.restaurantId).emit('order:new', data)
  })

  socket.on('order:statusUpdate', (data) => {
    io.to(data.restaurantId).emit('order:statusUpdate', data)
  })
})
```

### 4. **Set Environment Variables**

Create a `.env` file in `client/`:

```
VITE_API_URL=http://localhost:5000
```

In `.env.production`:

```
VITE_API_URL=https://your-api-domain.com
```

### 5. **Database Schema**

Your backend needs these collections/tables:

- **restaurants** - { id, slug, name, tagline, address, subscriptionPlan, subscriptionStatus }
- **menuCategories** - { id, restaurantId, name, icon, sortOrder }
- **menuItems** - { id, categoryId, restaurantId, name, description, price, isAvailable, isPopular, isVeg, tags, preparationTimeMinutes }
- **tables** - { id, restaurantId, number, status, currentOrderId }
- **orders** - { id, restaurantId, tableId, tableNumber, items, status, statusHistory, specialInstructions, totalAmount, createdAt }
- **staff** - { id, restaurantId, name, email, hashedPassword, role }

### 6. **Authentication**

Replace mock JWT generation with real signing:

```javascript
// server/services/auth.js
import jwt from 'jsonwebtoken'

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, name: user.name, role: user.role, restaurantId: user.restaurantId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
}
```

## Code Quality Notes

- **JSDoc comments** on all exported functions in `api.js` and hooks
- **Cleanup functions** in all `useEffect` hooks that use sockets
- **Named exports** for components, default exports for pages
- **CartContext persists** to sessionStorage (cleared when tab closes)
- **No hardcoded strings** — constants defined at top of files
- **Mobile-first** design for customer and waiter views
- **Proper ARIA attributes** and semantic HTML throughout

## Troubleshooting

**Q: Frontend can't reach backend**
- Ensure backend is running on port 5000
- Check that vite.config.js proxy is configured correctly
- Look for CORS errors in browser console

**Q: Socket events not firing**
- Check browser console for errors
- Verify socket listeners are being registered in useEffect
- Ensure useEffect cleanup functions are called

**Q: Kitchen audio not working**
- Web Audio API requires user interaction first
- Try clicking a button on the page before opening kitchen display
- Some browsers block audio in certain contexts

**Q: Login not persisting**
- Check localStorage is enabled in browser
- Verify AuthProvider wraps entire app
- Token expiration check in decodeToken helper

## Demo Flow

1. **Customer Journey:**
   - Visit `/menu/spice-garden/table/table_1`
   - Browse menu by category
   - Add items to cart with customizations
   - View cart and checkout
   - Track order status in real-time

2. **Kitchen Staff:**
   - Login as cook at `/staff/login`
   - Redirects to `/kitchen`
   - Receive audio alert when new order placed
   - Start cooking and mark items ready
   - See elapsed time on each ticket

3. **Waiter:**
   - Login as waiter
   - See floor plan with table statuses
   - Receive notifications for bills, water, ready orders
   - Modal detail view of table orders

4. **Owner:**
   - Login as owner
   - View KPI metrics (revenue, orders, popular items)
   - Edit menu prices with save confirmation
   - View recent orders with status tracking

## Production Deployment

When ready to deploy:

1. Build frontend: `cd client && npm run build` → creates `dist/`
2. Serve frontend from backend or CDN
3. Deploy backend to hosting platform (Vercel, Railway, Heroku, etc.)
4. Set environment variables on hosting platform
5. Connect to production database
6. Update Socket.io CORS origin
7. Set JWT_SECRET in production

---

**Built with ❤️ for modern restaurant automation.**
