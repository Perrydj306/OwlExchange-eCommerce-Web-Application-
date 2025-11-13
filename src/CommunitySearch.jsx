import React, { useState, useEffect, useCallback } from 'react';
import './CommunitySearch.css';

const categories = [
  "All Categories",
  "Textbooks",
  "Electronics",
  "Dorm Essentials",
  "School Supplies",
  "Clothing",
  "Household",
  "Other",
];

const transactionTypes = [
  { label: "All Types", value: "All" },
  { label: "For Sale", value: 0 },
  { label: "Trade/Exchange", value: 1 },
  { label: "Donation", value: 2 },
];

const CommunitySearch = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [transactionType, setTransactionType] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get initial search term from URL query params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    if (query) {
      setSearchTerm(query);
    }
  }, []);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    
    try {
      // Build URL similar to SearchResults component
      let url = `http://localhost:5000/api/items/search?keyword=${searchTerm || ""}`;
      
      if (category !== "All Categories") {
        url += `&category=${encodeURIComponent(category.toLowerCase())}`;
      }
      
      if (transactionType !== "All") {
        url += `&transactionType=${parseInt(transactionType)}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }

      let data = await response.json();
      
      // Apply price filters on frontend
      if (minPrice || maxPrice) {
        data = data.filter(item => {
          const price = item.price || 0;
          if (minPrice && price < parseFloat(minPrice)) return false;
          if (maxPrice && price > parseFloat(maxPrice)) return false;
          return true;
        });
      }

      setItems(data);
    } catch (err) {
      console.error('Error fetching items:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category, transactionType, minPrice, maxPrice]);

  // Fetch items whenever filters change
  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      const newUrl = `${window.location.pathname}?q=${encodeURIComponent(searchTerm.trim())}`;
      window.history.pushState({}, '', newUrl);
      fetchItems();
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemClick = (itemId) => {
    window.location.href = `/item/${itemId}`;
  };

  const getTransactionLabel = (type) => {
    if (type === 0) return { label: 'For Sale', className: 'transaction-sell' };
    if (type === 1) return { label: 'Trade/Exchange', className: 'transaction-trade' };
    return { label: 'Donation', className: 'transaction-donation' };
  };

  const handleBackToLanding = () => {
    window.location.href = '/';
  };

  return (
    <div className="community-search-wrapper">
      <div className="community-search-card">
        {/* Back Button */}
        <button className="back-button" onClick={handleBackToLanding}>
          ← Back to Home
        </button>
        
        {/* Title */}
        <h1 className="page-title">Community Exchange</h1>
        
        {/* Search Bar */}
        <div className="search-row">
          <input
            type="text"
            placeholder="Search items, descriptions, tags..."
            className="search-input"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyDown={handleSearchKeyDown}
          />
        </div>

        {/* Filter Row */}
        <div className="filter-row">
          <select 
            className="filter-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select 
            className="filter-select"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            {transactionTypes.map((type) => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>

          <input 
            type="number" 
            placeholder="Min $" 
            className="filter-input"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Max $" 
            className="filter-input"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
            >
              ⬛
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="results-section">
          {loading && (
            <div className="loading-message">Loading items...</div>
          )}
          
          {!loading && items.length === 0 && (
            <div className="no-results">
              No items found. Try adjusting your filters.
            </div>
          )}
          
          {!loading && items.length > 0 && (
            <>
              <div className="results-count">
                {items.length} item{items.length !== 1 ? 's' : ''} found
              </div>
              
              <div className={`items-${viewMode}`}>
                {items.map((item) => {
                  const transaction = getTransactionLabel(item.transactionType);
                  return (
                    <div 
                      key={item.id} 
                      className="item-card"
                      onClick={() => handleItemClick(item.id)}
                    >
                      {item.imageUrl ? (
                        <img 
                          src={item.imageUrl} 
                          alt={item.title}
                          className="item-image"
                        />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                      <div className="item-details">
                        <h3 className="item-title">{item.title}</h3>
                        <p className="item-description">
                          {item.description?.length > 100
                            ? item.description.substring(0, 100) + "..."
                            : item.description}
                        </p>
                        <div className="item-meta">
                          <span className="item-category">{item.category}</span>
                          <span className={`item-transaction ${transaction.className}`}>
                            {transaction.label}
                          </span>
                          {item.price > 0 && (
                            <span className="item-price">${item.price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunitySearch;