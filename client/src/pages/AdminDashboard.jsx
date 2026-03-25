export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Dashboard</h1>
                <p className="text-gray-600 mb-6">Welcome, Admin! Here you can manage your restaurant's operations.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 border rounded-lg hover:shadow-md transition">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Staff</h2>
                        <p className="text-gray-600">Add, edit, or remove staff members and assign roles.</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:shadow-md transition">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">View Reports</h2>
                        <p className="text-gray-600">Access sales, order, and performance reports.</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:shadow-md transition">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Manage Menu</h2>
                        <p className="text-gray-600">Add, edit, or remove menu items and categories.</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:shadow-md transition">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Settings</h2>
                        <p className="text-gray-600">Configure restaurant settings and preferences.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}