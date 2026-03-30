# Restaurant SaaS Automation Prototype

A complete, production-ready restaurant management system built with React + Vite, Express, and Socket.io. Enables customers to browse menus, place orders, and track status in real-time, while staff manage kitchen operations and dining room service.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Restaurant SaaS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐         ┌─────────────────────────┐    │
│  │   CUSTOMER      │         │    STAFF (Protected)    │    │
│  │  No Auth        │         │    JWT Auth             │    │
│  │                 │         │                         │    │
│  │  • Menu Browse  │         │ Roles:                  │    │
│  │  • Cart Mgmt    │         │ • Cook → Kitchen        │    │
│  │  • Ordering     │         │ • Waiter → Floor Mgmt   │    │
│  │  • Live Track   │         │ • Owner → Dashboard     │    │
│  └────────┬────────┘         └────────┬────────────────┘    │
│           │                           │                     │
│           └───────────┬───────────────┘                     │
│                       ▼                                     │
│           ┌──────────────────────┐                          │
│           │   React 18 + Vite    │                          │
│           │   - Context API      │                          │
│           │   - Socket.io Client │                          │
│           │   - React Router v6  │                          │
│           └──────────┬───────────┘                          │
│                      │                                      │
│    ┌─────────────────┼─────────────────┐                    │
│    ▼                 ▼                 ▼                    │
│  /api/          /api/auth/        /socket.io                │
│  (public)       (staff)           (realtime)                │
│                                                             │
│  ┌──────────────────────────────────────────────────┐       │
│  │         Express Server (Port 5000)               │       │
│  │  - JWT Auth                                      │       │
│  │  - Socket.io Event Broadcasting                  │       │
│  │  - Structured Routes                             │       │
│  └──────────────────────────────────────────────────┘       │
│                                                             │
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
│   ├── controllers         # backend logic controller
│   ├── models              # collection schema
│   ├── routes              # API routes
│   ├── scripts             # seeding codes for initial user creation
│   ├── server.js           # Server entry point
│   └── package.json
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
- MongoDB 

### 0. Create .env files
  i. Open both client and server
  ii. Create .env files in both folder
  iii. Copy the content from .env.example
  iv. Paste it to .env files


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

- **Customer Menu:** http://localhost:5173/menu/resturent_id/table/table_id
- **Staff Login:** http://localhost:5173/staff/login
- **Kitchen Display:** http://localhost:5173/kitchen (after login as cook)
- **Waiter Floor:** http://localhost:5173/floor (after login as waiter)
- **Owner Dashboard:** http://localhost:5173/dashboard (after login as owner)

## Role Access Matrix

| Role     | URL Path                | Features                                                     |
|----------|-------------------------|--------------------------------------------------------------|
| Cook     | `/kitchen`              | View pending orders, start cooking, mark ready, audio alerts |
| Waiter   | `/floor`                | Manage tables, real-time notifications                       |
| Owner    | `/dashboard`            | KPI stats, menu pricing, popular dishes, recent orders       |
| Customer | `/menu/:resturent_id/table/:id` | Browse menu, cart, track orders                      |

## Staff Credentials

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

```

## QR Code Simulation (Customer)

To simulate a real QR code-generated table link:

1. Start the frontend: http://localhost:5173
2. Log in as owner
3. Go to table tab
4. Click on any table
5. Click on generate QR
6. Visit the QR code/ Link given below the QR code

In production, a QR code would simply link to `/menu/{restaurant_id}/table/{table_id}`.

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

| Event                | Trigger                  | Consumers                                          |
|----------------------|--------------------------|----------------------------------------------------|
| `order:new`          | Customer places order    | Kitchen (alert + ding), Waiter (notification)      |
| `order:statusUpdate` | Cook marks step complete | Customer (stepper advances), Waiter (notification) |
| `table:requestBill`  | Customer requests bill   | Waiter (urgent red notification)                   |
| `table:requestWater` | Customer requests water  | Waiter (notification)                              |

All events include a 100-300ms network latency simulation.

## Demo Flow

1. **Customer Journey:**
   - Visit `/menu/resturent_id/table/table_1`
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

**Built with ❤️ for modern restaurant automation.**
