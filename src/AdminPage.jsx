import React, { useState } from "react";

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState("items");
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All Items");

    const handleLogout = () => {
        window.location.href = "/";
    };

    const items = [
        {
            id: 1,
            title: "Vintage Wooden Coffee Table",
            seller: "Sarah Johnson",
            category: "Furniture",
            price: "75",
            status: "active",
            flags: 0
        },
        {
            id: 2,
            title: "Free: Kids' Clothes & Toys Bundle",
            seller: "Mike Chen",
            category: "Kids & Baby",
            price: "FREE",
            status: "active",
            flags: 0
        },
        {
            id: 3,
            title: "Kitchen Appliances - Looking to Trade",
            seller: "Lisa Rodriguez",
            category: "Kitchen & Dining",
            price: "FREE",
            status: "active",
            flags: 0
        },
        {
            id: 4,
            title: "Garden Tools & Supplies",
            seller: "David Park",
            category: "Garden & Outdoor",
            price: "40",
            status: "active",
            flags: 0
        },
        {
            id: 5,
            title: "Free: Moving Boxes & Packing Supplies",
            seller: "Jessica Lee",
            category: "Home & Storage",
            price: "FREE",
            status: "active",
            flags: 0
        }
    ];

    const users = [
        {
            id: 1,
            name: "Sarah Johnson",
            email: "sarah.johnson@community.local",
            studentId: "CU001",
            itemsPosted: 5,
            trustScore: 95,
            status: "active"
        },
        {
            id: 2,
            name: "Mike Chen",
            email: "mike.chen@community.local",
            studentId: "CU002",
            itemsPosted: 3,
            trustScore: 87,
            status: "active"
        },
        {
            id: 3,
            name: "Lisa Rodriguez",
            email: "lisa.rodriguez@community.local",
            studentId: "CU003",
            itemsPosted: 8,
            trustScore: 92,
            status: "active"
        },
        {
            id: 4,
            name: "David Park",
            email: "david.park@community.local",
            studentId: "CU004",
            itemsPosted: 2,
            trustScore: 88,
            status: "active"
        },
        {
            id: 5,
            name: "Jessica Lee",
            email: "jessica.lee@community.local",
            studentId: "CU005",
            itemsPosted: 4,
            trustScore: 91,
            status: "active"
        }
    ];

    const reports = [
        {
            id: 1,
            itemTitle: "Vintage Wooden Coffee Table",
            reportedBy: "Anonymous User",
            date: "1/15/2024",
            reason: "Spam/Scam",
            description: "This item seems overpriced and the photos look like stock images",
            status: "pending"
        },
        {
            id: 2,
            userReported: "Mike Chen",
            reportedBy: "Community Member",
            date: "1/14/2024",
            reason: "Inappropriate behavior",
            description: "User was unresponsive and didn't show up for arranged pickup",
            status: "pending"
        },
        {
            id: 3,
            itemTitle: "Kitchen Appliances - Looking to Trade",
            reportedBy: "Sarah Johnson",
            date: "1/13/2024",
            reason: "Misleading information",
            description: "Item condition doesn't match description - appliances show significant wear",
            status: "pending"
        }
    ];

    const filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.seller.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSuspendUser = (userId) => {
        console.log("Suspend user:", userId);
    };

    const handleBanUser = (userId) => {
        console.log("Ban user:", userId);
    };

    const handleEditUser = (userId) => {
        console.log("Edit user:", userId);
    };

    const handleReviewReport = (reportId) => {
        console.log("Review report:", reportId);
    };

    const handleDismissReport = (reportId) => {
        console.log("Dismiss report:", reportId);
    };

    const handleTakeAction = (reportId) => {
        console.log("Take action on report:", reportId);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl font-bold">📦</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-600 hover:text-gray-900 font-medium">
                            Back to Marketplace
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-bold">AU</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-900">Admin User</div>
                                <div className="text-xs text-gray-500">Admin</div>
                            </div>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium"
                        >
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab("items")}
                            className={`px-6 py-4 font-medium ${
                                activeTab === "items"
                                    ? "text-gray-900 border-b-2 border-gray-900"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Items Management
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`px-6 py-4 font-medium ${
                                activeTab === "users"
                                    ? "text-gray-900 border-b-2 border-gray-900"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab("reports")}
                            className={`px-6 py-4 font-medium ${
                                activeTab === "reports"
                                    ? "text-gray-900 border-b-2 border-gray-900"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Reports
                        </button>
                        <button
                            onClick={() => setActiveTab("complaints")}
                            className={`px-6 py-4 font-medium relative ${
                                activeTab === "complaints"
                                    ? "text-gray-900 border-b-2 border-gray-900"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Complaints
                            <span className="absolute top-2 right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                1
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("activity")}
                            className={`px-6 py-4 font-medium ${
                                activeTab === "activity"
                                    ? "text-gray-900 border-b-2 border-gray-900"
                                    : "text-gray-600 hover:text-gray-900"
                            }`}
                        >
                            Activity Log
                        </button>
                    </div>
                </div>

                {/* Item Management Content */}
                {activeTab === "items" && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Item Management</h2>
                        
                        {/* Search and Filter */}
                        <div className="flex gap-4 mb-6">
                            <div className="flex-1 relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                            </div>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                <option>All Items</option>
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Flagged</option>
                            </select>
                        </div>

                        {/* Items Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Seller</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Category</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Flags</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4 font-medium text-gray-900">{item.title}</td>
                                            <td className="py-4 px-4 text-gray-700">{item.seller}</td>
                                            <td className="py-4 px-4 text-gray-700">{item.category}</td>
                                            <td className="py-4 px-4">
                                                <span className={item.price === "FREE" ? "text-green-600 font-medium" : "text-gray-900"}>
                                                    {item.price === "FREE" ? "FREE" : `$${item.price}`}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-3 py-1 bg-black text-white text-sm rounded-full">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-gray-700">{item.flags}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2">
                                                    <button className="p-2 hover:bg-gray-100 rounded-lg" title="View">
                                                        <span className="text-gray-600">👁️</span>
                                                    </button>
                                                    <button className="p-2 hover:bg-red-50 rounded-lg" title="Delete">
                                                        <span className="text-red-600">🗑️</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* User Management Content */}
                {activeTab === "users" && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">User Management</h2>
                        
                        {/* Users Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Name</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Email</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Student ID</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Items Posted</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Trust Score</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-gray-700 uppercase text-xs tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4 font-medium text-gray-900">{user.name}</td>
                                            <td className="py-4 px-4 text-gray-700">{user.email}</td>
                                            <td className="py-4 px-4 text-gray-700">{user.studentId}</td>
                                            <td className="py-4 px-4 text-gray-700">{user.itemsPosted}</td>
                                            <td className="py-4 px-4">
                                                <span className="px-3 py-1 bg-black text-white text-sm rounded-full font-semibold">
                                                    {user.trustScore}%
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className="px-3 py-1 bg-black text-white text-sm rounded-full font-semibold">
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex gap-2 items-center">
                                                    <button
                                                        onClick={() => handleEditUser(user.id)}
                                                        className="text-gray-600 hover:text-gray-900 p-1"
                                                        title="Edit User"
                                                    >
                                                        🔗
                                                    </button>
                                                    <button
                                                        onClick={() => handleSuspendUser(user.id)}
                                                        className="px-4 py-2 bg-white border border-gray-300 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50"
                                                    >
                                                        Suspend
                                                    </button>
                                                    <button
                                                        onClick={() => handleBanUser(user.id)}
                                                        className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
                                                    >
                                                        Ban
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Reports Content */}
                {activeTab === "reports" && (
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Reports & Flags</h2>
                        
                        {/* Reports List */}
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                {report.itemTitle || report.userReported}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Reported by {report.reportedBy} • {report.date}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                                            {report.reason}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-700 mb-4">{report.description}</p>
                                    
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleReviewReport(report.id)}
                                            className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800"
                                        >
                                            Review
                                        </button>
                                        <button
                                            onClick={() => handleDismissReport(report.id)}
                                            className="px-4 py-2 bg-white border border-gray-300 text-gray-900 text-sm font-medium rounded-lg hover:bg-gray-50"
                                        >
                                            Dismiss
                                        </button>
                                        <button
                                            onClick={() => handleTakeAction(report.id)}
                                            className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600"
                                        >
                                            Take Action
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Other Tabs Placeholder */}
                {activeTab !== "items" && activeTab !== "users" && activeTab !== "reports" && (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                        </h2>
                        <p className="text-gray-600">This section is under development.</p>
                    </div>
                )}
            </main>
        </div>
    );
}