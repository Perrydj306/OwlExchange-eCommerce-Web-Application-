import React, { useState } from "react";
import "./AdminPage.css";

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
            email: "email@community.local",
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
        <div className="admin-dashboard">
            {/* Header */}
            <header>
                <div className="top-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div className="top-pill">
                            <div className="pill-icon">🦉</div>
                            <div>Admin Dashboard</div>
                        </div>
                    </div>

                    <div className="top-right-controls">
                        <button className="back-btn">
                            Back to Marketplace
                        </button>
                        <div className="flex items-center gap-2 user-area">
                            <div className="user-badge">
                                <span>AU</span>
                            </div>
                            <div className="user-details">
                                <div className="user-name">Admin User</div>
                                <div className="user-role">Admin</div>
                            </div>
                        </div>
                        <button onClick={handleLogout} className="sign-out-btn">
                            <span>🚪</span> Sign Out
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '32px 24px' }}>
                {/* Dashboard Overview */}
                <div className="dashboard-overview">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="overview-icon">
                            <span>🦉</span>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <h2 className="overview-title">OwlExchange Admin</h2>
                            <p className="overview-subtitle">Manage community donations, trades, and sales</p>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon gray"></div>
                                <span className="stat-emoji">📦</span>
                            </div>
                            <div className="stat-title">Total Items</div>
                            <div className="stat-value">5</div>
                            <div className="stat-subtitle">0 pending review</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon gray"></div>
                                <span className="stat-emoji">👥</span>
                            </div>
                            <div className="stat-title">Active Users</div>
                            <div className="stat-value">3</div>
                            <div className="stat-subtitle">0 flagged users</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon red"></div>
                                <span className="stat-emoji">🚩</span>
                            </div>
                            <div className="stat-title">Flagged Items</div>
                            <div className="stat-value red">0</div>
                            <div className="stat-subtitle">Require attention</div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon orange"></div>
                                <span className="stat-emoji">⚠️</span>
                            </div>
                            <div className="stat-title">Reports</div>
                            <div className="stat-value orange">3</div>
                            <div className="stat-subtitle">Pending review</div>
                        </div>
                    </div>

                    {/* Transaction Types */}
                    <div className="transaction-grid">
                        <div className="transaction-card">
                            <div className="transaction-header">
                                <div className="transaction-title">Donations</div>
                                <div className="stat-icon green"></div>
                            </div>
                            <div className="transaction-value">3</div>
                            <div className="transaction-subtitle">Free community items</div>
                            <span className="dot green"></span>
                        </div>

                        <div className="transaction-card">
                            <div className="transaction-header">
                                <div className="transaction-title">Trades</div>
                                <div className="stat-icon blue"></div>
                            </div>
                            <div className="transaction-value">1</div>
                            <div className="transaction-subtitle">Exchange-based items</div>
                            <span className="dot blue"></span>
                        </div>

                        <div className="transaction-card">
                            <div className="transaction-header">
                                <div className="transaction-title">Sales</div>
                                <div className="stat-icon purple"></div>
                            </div>
                            <div className="transaction-value">2</div>
                            <div className="transaction-subtitle">Paid transactions</div>
                            <span className="dot purple"></span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="table-container" style={{ marginBottom: '0' }}>
                    <div className="nav-tabs">
                        <button
                            onClick={() => setActiveTab("items")}
                            className={`nav-tab ${activeTab === "items" ? "active" : ""}`}
                        >
                            Items Management
                        </button>
                        <button
                            onClick={() => setActiveTab("users")}
                            className={`nav-tab ${activeTab === "users" ? "active" : ""}`}
                        >
                            User Management
                        </button>
                        <button
                            onClick={() => setActiveTab("reports")}
                            className={`nav-tab ${activeTab === "reports" ? "active" : ""}`}
                        >
                            Reports
                        </button>
                        <button
                            onClick={() => setActiveTab("complaints")}
                            className={`nav-tab ${activeTab === "complaints" ? "active" : ""}`}
                        >
                            Complaints
                            <span className="badge">1</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("activity")}
                            className={`nav-tab ${activeTab === "activity" ? "active" : ""}`}
                        >
                            Activity Log
                        </button>
                    </div>
                </div>

                {/* Item Management Content */}
                {activeTab === "items" && (
                    <div className="content-container">
                        <h2>Item Management</h2>
                        
                        {/* Search and Filter */}
                        <div className="search-filter-bar">
                            <div style={{ flex: 1, position: 'relative' }}>
                                <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}>
                                    🔍
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search items..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{ paddingLeft: '40px' }}
                                />
                            </div>
                            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option>All Items</option>
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Flagged</option>
                            </select>
                        </div>

                        {/* Items Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Seller</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Status</th>
                                        <th>Flags</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredItems.map((item) => (
                                        <tr key={item.id}>
                                            <td style={{ fontWeight: 600 }}>{item.title}</td>
                                            <td>{item.seller}</td>
                                            <td>{item.category}</td>
                                            <td>
                                                <span style={{ color: item.price === "FREE" ? "#4caf50" : "#1a1a1a", fontWeight: item.price === "FREE" ? 600 : 400 }}>
                                                    {item.price === "FREE" ? "FREE" : `$${item.price}`}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="status-badge status-active">
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td>{item.flags}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button className="btn-view" title="View">
                                                        <span>👁️</span>
                                                    </button>
                                                    <button className="btn-delete" title="Delete">
                                                        <span>🗑️</span>
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
                    <div className="content-container">
                        <h2>User Management</h2>
                        
                        {/* Users Table */}
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Student ID</th>
                                        <th>Items Posted</th>
                                        <th>Trust Score</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td style={{ fontWeight: 600 }}>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>{user.studentId}</td>
                                            <td>{user.itemsPosted}</td>
                                            <td>
                                                <span className="trust-score">
                                                    {user.trustScore}%
                                                </span>
                                            </td>
                                            <td>
                                                <span className="status-badge status-active">
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => handleEditUser(user.id)}
                                                        className="btn-edit"
                                                        title="Edit User"
                                                    >
                                                        🔗
                                                    </button>
                                                    <button
                                                        onClick={() => handleSuspendUser(user.id)}
                                                        className="btn-suspend"
                                                    >
                                                        Suspend
                                                    </button>
                                                    <button
                                                        onClick={() => handleBanUser(user.id)}
                                                        className="btn-ban"
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
                    <div className="content-container">
                        <h2>Reports & Flags</h2>
                        
                        {/* Reports List */}
                        <div className="space-y-4">
                            {reports.map((report) => (
                                <div key={report.id} className="report-card">
                                    <div className="report-header">
                                        <div style={{ flex: 1 }}>
                                            <h3 className="report-title">
                                                {report.itemTitle || report.userReported}
                                            </h3>
                                            <p className="report-meta">
                                                Reported by {report.reportedBy} • {report.date}
                                            </p>
                                        </div>
                                        <span className="badge-warning">
                                            {report.reason}
                                        </span>
                                    </div>
                                    
                                    <p className="report-description">{report.description}</p>
                                    
                                    <div className="report-actions">
                                        <button
                                            onClick={() => handleReviewReport(report.id)}
                                            className="btn-primary"
                                        >
                                            Review
                                        </button>
                                        <button
                                            onClick={() => handleDismissReport(report.id)}
                                            className="btn-secondary"
                                        >
                                            Dismiss
                                        </button>
                                        <button
                                            onClick={() => handleTakeAction(report.id)}
                                            className="btn-danger"
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
                    <div className="content-container text-center" style={{ padding: '48px 24px' }}>
                        <h2 style={{ marginBottom: '16px' }}>
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management
                        </h2>
                        <p className="text-secondary">This section is under development.</p>
                    </div>
                )}
            </main>
        </div>
    );
}