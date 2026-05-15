import Feedback from '../models/Feedback.js';

// GET /admin/feedback — all feedback submitted by restaurants about the platform
export const getAllFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({}).sort({ createdAt: -1 });
        const total = feedback.length;
        const avgRating = total
            ? parseFloat((feedback.reduce((s, f) => s + f.rating, 0) / total).toFixed(1))
            : 0;
        const positive = feedback.filter(f => f.rating >= 4).length;
        return res.json({
            success: true,
            data: feedback,
            stats: {
                total,
                avgRating,
                positivePercent: total ? Math.round((positive / total) * 100) : 0,
            },
        });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};
