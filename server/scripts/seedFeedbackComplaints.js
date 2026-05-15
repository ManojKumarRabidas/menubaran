/**
 * Seed script: generates Feedback and Complaint records.
 *
 * Context:
 *   These are records submitted BY restaurants (clients) TO the MenuBaran team (system admin).
 *   A restaurant owner using the platform may submit:
 *     - Feedback / Review  → how they feel about the software, rating + comment
 *     - Complaint          → a problem they faced using the platform (billing, technical, etc.)
 *
 * Used in two ways:
 *   1. Auto-run on first server boot via server.js → runSeedFeedbackComplaints()
 *   2. Standalone CLI → node server/scripts/seedFeedbackComplaints.js
 */
import mongoose from 'mongoose';
import Feedback from '../models/Feedback.js';
import Complaint from '../models/Complaint.js';
import Restaurant from '../models/Restaurants.js';

// ── Helpers ──────────────────────────────────────────────────────────────────
const skip = (label) => console.log(`[SeedFC] SKIP  — ${label} already exists`);
const done  = (label) => console.log(`[SeedFC] ADDED — ${label}`);

// ── Feedback from restaurants about the MenuBaran platform ───────────────────
const FEEDBACK_DATA = [
    {
        ownerName: 'Rajesh Mehta',
        category:  'UX/Interface',
        rating: 5,
        comment: 'The dashboard is very intuitive. Our staff adapted to it in a single day. Excellent design!',
    },
    {
        ownerName: 'Priya Sharma',
        category:  'Performance',
        rating: 4,
        comment: 'Order notifications are near real-time. The kitchen display works smoothly during rush hours.',
    },
    {
        ownerName: 'Anand Joshi',
        category:  'Feature Request',
        rating: 4,
        comment: 'Would love a loyalty points module for repeat customers. Otherwise the system is great.',
    },
    {
        ownerName: 'Kavitha Nair',
        category:  'General',
        rating: 5,
        comment: 'Switching to MenuBaran was the best decision for our restaurant. Revenue visibility is amazing.',
    },
    {
        ownerName: 'Suresh Pillai',
        category:  'Billing',
        rating: 3,
        comment: 'The subscription invoice details could be clearer. Had confusion about GST breakup last month.',
    },
    {
        ownerName: 'Meera Reddy',
        category:  'Support',
        rating: 5,
        comment: 'Support team resolved our onboarding issue within 2 hours. Very professional and helpful.',
    },
    {
        ownerName: 'Vikrant Desai',
        category:  'UX/Interface',
        rating: 4,
        comment: 'Menu management is seamless. Bulk upload saved us hours compared to the previous system.',
    },
    {
        ownerName: 'Sunita Agarwal',
        category:  'Performance',
        rating: 3,
        comment: 'Occasional lag on the staff app during weekends. Otherwise a solid product.',
    },
    {
        ownerName: 'Kiran Bose',
        category:  'General',
        rating: 5,
        comment: 'Analytics section is brilliant. We identified our peak hours and optimised staffing accordingly.',
    },
    {
        ownerName: 'Deepak Choudhary',
        category:  'Feature Request',
        rating: 4,
        comment: 'Please add a WhatsApp notification integration for order confirmations. That would be a game changer.',
    },
];

// ── Complaints from restaurants about the MenuBaran platform ─────────────────
const COMPLAINT_DATA = [
    {
        ownerName: 'Ramesh Kumar',
        category:  'Technical',
        issue:     'QR code for Table 3 stopped working after the last update. Customers cannot scan and place orders.',
        status:    'open',
    },
    {
        ownerName: 'Anita Verma',
        category:  'Billing',
        issue:     'We were charged twice for the April subscription. Please refund or adjust in next billing cycle.',
        status:    'resolved',
        resolvedAt: new Date('2026-05-04T11:00:00Z'),
        adminNote:  'Duplicate charge confirmed. Credit applied to May invoice.',
    },
    {
        ownerName: 'Sanjay Patel',
        category:  'Account',
        issue:     'Unable to add a second staff account. The system throws an error when we try to save.',
        status:    'in-progress',
    },
    {
        ownerName: 'Lakshmi Iyer',
        category:  'Performance',
        issue:     'The revenue report for March 2026 is loading incorrectly — some orders are missing from totals.',
        status:    'open',
    },
    {
        ownerName: 'Harish Malhotra',
        category:  'Feature',
        issue:     'There is no way to mark an item as "Out of Stock" temporarily without deleting it from the menu.',
        status:    'resolved',
        resolvedAt: new Date('2026-05-07T09:30:00Z'),
        adminNote:  'Out-of-stock toggle has been added in v2.4. Update your app.',
    },
    {
        ownerName: 'Geeta Nanda',
        category:  'Other',
        issue:     'The mobile view of the owner dashboard cuts off the sidebar on smaller screens.',
        status:    'in-progress',
    },
];

// ── Runner (exported for server.js + runnable standalone) ───────────────────
export async function runSeedFeedbackComplaints() {
    console.log('[SeedFC] Starting...');

    // Check if data already exists — skip entirely to avoid duplicates
    const existingFeedback   = await Feedback.countDocuments();
    const existingComplaints = await Complaint.countDocuments();

    if (existingFeedback > 0 || existingComplaints > 0) {
        skip(`Feedback (${existingFeedback}) & Complaints (${existingComplaints})`);
        console.log('[SeedFC] Complete.');
        return;
    }

    // Need at least one approved restaurant to attach records to
    const restaurants = await Restaurant.find({ status: 'approved' }).select('_id name ownerName').lean();

    if (restaurants.length === 0) {
        console.log('[SeedFC] No approved restaurants found — skipping Feedback & Complaints seed.');
        console.log('[SeedFC] Complete.');
        return;
    }

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Seed feedback — each entry comes from a restaurant (the client)
    const feedbackToInsert = FEEDBACK_DATA.map(f => {
        const restaurant = pick(restaurants);
        return {
            ...f,
            restaurantId:   restaurant._id,
            restaurantName: restaurant.name,
            // Use seed ownerName as the submitter (override restaurant's ownerName for variety)
        };
    });
    await Feedback.insertMany(feedbackToInsert);
    done(`Feedback (${feedbackToInsert.length})`);

    // Seed complaints — each complaint comes from a restaurant about the platform
    const complaintsToInsert = COMPLAINT_DATA.map(c => {
        const restaurant = pick(restaurants);
        return {
            ...c,
            restaurantId:   restaurant._id,
            restaurantName: restaurant.name,
        };
    });
    await Complaint.insertMany(complaintsToInsert);
    done(`Complaints (${complaintsToInsert.length})`);

    console.log('[SeedFC] Complete.');
}

// ── Standalone execution: `node seedFeedbackComplaints.js` ───────────────────
if (process.argv[1]?.endsWith('seedFeedbackComplaints.js')) {
    import('dotenv').then(({ default: dotenv }) => {
        import('path').then(({ resolve, dirname }) => {
            import('url').then(({ fileURLToPath }) => {
                const __dirname = dirname(fileURLToPath(import.meta.url));
                dotenv.config({ path: resolve(__dirname, '../.env') });

                mongoose
                    .connect(process.env.MONGO_URI)
                    .then(async () => {
                        console.log('[SeedFC] Connected to MongoDB.');
                        await runSeedFeedbackComplaints();
                        await mongoose.disconnect();
                        process.exit(0);
                    })
                    .catch((err) => {
                        console.error('[SeedFC] Error:', err.message);
                        process.exit(1);
                    });
            });
        });
    });
}
