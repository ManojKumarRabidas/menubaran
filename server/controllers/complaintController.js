import Complaint from '../models/Complaint.js';

// GET /admin/complaints — all complaints submitted by restaurants about the platform
export const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({}).sort({ createdAt: -1 });
        return res.json({ success: true, data: complaints });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

// PATCH /admin/complaints/:_id/resolve — admin marks a complaint as resolved
export const resolveComplaint = async (req, res) => {
    try {
        const { adminNote } = req.body || {};
        const complaint = await Complaint.findByIdAndUpdate(
            req.params._id,
            {
                status: 'resolved',
                resolvedAt: new Date(),
                ...(adminNote ? { adminNote } : {}),
            },
            { new: true }
        );
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });
        return res.json({ success: true, data: complaint });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};

// PATCH /admin/complaints/:_id/progress — admin marks as in-progress
export const markComplaintInProgress = async (req, res) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(
            req.params._id,
            { status: 'in-progress' },
            { new: true }
        );
        if (!complaint) return res.status(404).json({ success: false, error: 'Complaint not found' });
        return res.json({ success: true, data: complaint });
    } catch (e) {
        return res.status(500).json({ success: false, error: e.message });
    }
};
