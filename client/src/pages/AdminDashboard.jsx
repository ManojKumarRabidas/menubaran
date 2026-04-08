import { useState, useEffect } from 'react';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';

export default function AdminDashboard() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const res = await fetch('/api/admin/restaurants/pending');
            const data = await res.json();
            if (data.success) {
                setPending(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch pending requests', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            const res = await fetch(`/api/admin/restaurants/${id}/${action}`, {
                method: 'PATCH',
            });
            const data = await res.json();
            if (data.success) {
                setPending(pending.filter(p => p._id !== id));
            }
        } catch (error) {
            console.error(`Failed to ${action} request`, error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                    <p className="text-gray-600 mt-2">Welcome, SuperAdmin! Manage your restaurant ecosystem here.</p>
                </div>

                <div className="mb-10">
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">Pending Registrations</h2>
                    {loading ? (
                        <div className="flex justify-center py-10"><LoadingSpinner /></div>
                    ) : pending.length === 0 ? (
                        <p className="text-gray-500 italic bg-gray-50 p-6 rounded-lg text-center">No pending registrations at the moment.</p>
                    ) : (
                        <div className="grid grid-cols-1 gap-6">
                            {pending.map(r => (
                                <div key={r._id} className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-white shadow-sm hover:shadow-md transition">
                                    <div className="mb-4 md:mb-0">
                                        <h3 className="text-lg font-bold text-gray-900">{r.name}</h3>
                                        <p className="text-sm text-gray-500">📍 {r.address}</p>
                                        <div className="mt-3 flex flex-col gap-1">
                                            <p className="text-sm text-gray-700"><span className="font-semibold">👤 Owner:</span> {r.ownerName}</p>
                                            <p className="text-sm text-gray-700"><span className="font-semibold">✉️ Email:</span> {r.ownerEmail}</p>
                                            <a href={`http://localhost:5000${r.registrationDocument}`} target="_blank" rel="noreferrer" className="text-amber-600 hover:text-amber-700 text-sm font-semibold mt-1 inline-flex items-center gap-1">
                                                📄 View Registration Document
                                            </a>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto">
                                        <button 
                                            onClick={() => handleAction(r._id, 'approve')}
                                            className="flex-1 md:flex-none px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => handleAction(r._id, 'reject')}
                                            className="flex-1 md:flex-none px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 font-semibold rounded-lg transition"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="text-xl font-bold text-gray-900 border-b pb-4 mb-4">Quick Links</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">Manage Staff</h2>
                            <p className="text-sm text-gray-500">System administrators</p>
                        </div>
                        <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">View Reports</h2>
                            <p className="text-sm text-gray-500">Platform-wide analytics</p>
                        </div>
                        <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">Restaurants</h2>
                            <p className="text-sm text-gray-500">Manage approved active venues</p>
                        </div>
                        <div className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition cursor-pointer">
                            <h2 className="text-lg font-semibold text-gray-800 mb-1">Settings</h2>
                            <p className="text-sm text-gray-500">Platform configuration</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}