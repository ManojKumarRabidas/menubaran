import bcrypt from 'bcryptjs';
import Restaurant from '../models/Restaurants.js'
import MenuCategory from '../models/MenuCategory.js';
import Staff from '../models/Staff.js';
import Admin from '../models/Admin.js';
import SubscriptionPlan from '../models/SubscriptionPlan.js';

// ── Helpers ──────────────────────────────────────────────────────────────────
const hash = (pwd) => bcrypt.hash(pwd, 10);
const skip = (label) => console.log(`[Seed] SKIP  — ${label} already exists`);
const done = (label) => console.log(`[Seed] ADDED — ${label}`);

// ── Seed Data ────────────────────────────────────────────────────────────────
const RESTAURANT = {
    slug: 'spice-garden',
    name: 'Spice Garden',
    tagline: 'Authentic Indian Cuisine',
    address: '123 Curry Lane, Flavor City',
    logoPlaceholderColor: 'from-amber-600 to-orange-500',
    subscriptionPlan: 'pro',
    subscriptionStatus: 'active',
};

const CATEGORIES = [
    { name: 'Appetizers', icon: '🥘', sortOrder: 1 },
    { name: 'Breads', icon: '🍞', sortOrder: 2 },
    { name: 'Main Course', icon: '🍛', sortOrder: 3 },
    { name: 'Biryani', icon: '🍚', sortOrder: 4 },
    { name: 'Desserts', icon: '🍮', sortOrder: 5 },
];

const STAFF = [
    { name: 'Raj Kumar', email: 'cook@spice-garden.com', role: 'cook', avatarColor: 'bg-orange-500' },
    { name: 'Priya Sharma', email: 'waiter@spice-garden.com', role: 'waiter', avatarColor: 'bg-blue-500' },
    { name: 'Anil Patel', email: 'owner@spice-garden.com', role: 'owner', avatarColor: 'bg-purple-500' },
];

const ADMIN = {
    name: 'Admin 1',
    email: 'admin1@menubaran.com',
    role: 'admin',
    avatarColor: 'bg-orange-500',
};

const PLAN = {
    _id: 'plan_1',
    name: 'Basic',
    price: 29,
    billingCycle: 'monthly',
    features: ['Up to 10 tables', 'Basic analytics', 'Email support'],
    maxTables: 10,
    maxStaff: 5,
    isPopular: false,
};

// ── Runner (exported for server.js + runnable standalone) ───────────────────
export async function runSeed() {
    console.log('[Seed] Starting...');

    // 1. Subscription Plan
    if (await SubscriptionPlan.exists({ _id: PLAN._id })) {
        skip('SubscriptionPlan');
    } else {
        await SubscriptionPlan.create(PLAN);
        done('SubscriptionPlan');
    }

    // 2. Restaurant
    let restaurant = await Restaurant.findOne({ slug: RESTAURANT.slug });
    if (restaurant) {
        skip('Restaurant');
    } else {
        restaurant = await Restaurant.create(RESTAURANT);
        done('Restaurant');
    }

    // 3. Menu Categories
    if (await MenuCategory.exists({ restaurantId: restaurant._id })) {
        skip('MenuCategories');
    } else {
        await MenuCategory.insertMany(
            CATEGORIES.map((c) => ({ ...c, restaurantId: restaurant._id }))
        );
        done(`MenuCategories (${CATEGORIES.length})`);
    }

    // 4. Staff
    if (await Staff.exists({ restaurantId: restaurant._id })) {
        skip('Staff');
    } else {
        const pwd = await hash('password123');
        await Staff.insertMany(
            STAFF.map((s) => ({ ...s, restaurantId: restaurant._id, password: pwd }))
        );
        done(`Staff (${STAFF.length})`);
    }

    // 5. Admin
    if (await Admin.exists({ email: ADMIN.email })) {
        skip('Admin');
    } else {
        await Admin.create({ ...ADMIN, password: await hash('password123') });
        done('Admin');
    }

    console.log('[Seed] Complete.');
}

// ── Standalone execution: `node seed.js` ─────────────────────────────────────
if (process.argv[1]?.endsWith('seed.js')) {
    import('mongoose').then(({ default: mongoose }) => {
        import('dotenv').then(({ default: dotenv }) => {
            dotenv.config();
            mongoose
                .connect(process.env.MONGO_URI)
                .then(async () => {
                    await runSeed();
                    await mongoose.disconnect();
                    process.exit(0);
                })
                .catch((err) => {
                    console.error('[Seed] Error:', err.message);
                    process.exit(1);
                });
        });
    });
}