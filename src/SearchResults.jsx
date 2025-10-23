import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./SearchResults.css";

const categories = [
  "All",
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

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("q");

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTransactionType, setSelectedTransactionType] = useState("All");

  // Fetch items whenever filters or keyword change
  useEffect(() => {
    setLoading(true);

    let url = `http://localhost:5000/api/items/search?keyword=${keyword || ""}`;
    if (selectedCategory !== "All") {
      url += `&category=${encodeURIComponent(selectedCategory.toLowerCase())}`;
    }
    if (selectedTransactionType !== "All") {
      url += `&transactionType=${parseInt(selectedTransactionType)}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched items:", data);
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  }, [keyword, selectedCategory, selectedTransactionType]);

  return (
    <Box className="search-results-page">
      {/* Header */}
      <Box className="results-header">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/dashboard")}
          className="back-btn"
          variant="outlined"
        >
          Back to Dashboard
        </Button>

        <Typography variant="h4" className="results-title">
          Search Results for "{keyword}"
        </Typography>
      </Box>

      {/* Filter Bar */}
      <Box className="filter-bar">
        <Typography variant="body1" sx={{ marginRight: "10px" }}>
          Filter by:
        </Typography>

        {/* Category Filter */}
        <TextField
          select
          size="small"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ width: 200, marginRight: "15px" }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        {/* Transaction Type Filter */}
        <TextField
          select
          size="small"
          value={selectedTransactionType}
          onChange={(e) => setSelectedTransactionType(e.target.value)}
          sx={{ width: 200 }}
        >
          {transactionTypes.map((type) => (
            <MenuItem key={type.value} value={type.value}>
              {type.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Loader */}
      {loading ? (
        <Box className="loading-box">
          <CircularProgress />
          <Typography>Loading items...</Typography>
        </Box>
      ) : items.length > 0 ? (
        <Grid container spacing={3} className="results-grid">
          {items.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
               <Card
                  className="result-card"
                  onClick={() => navigate(`/item/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                {item.imageUrl ? (
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.imageUrl}
                    alt={item.title}
                    className="result-image"
                  />
                ) : (
                  <Box className="no-image">No Image</Box>
                )}

                <CardContent>
                  <Typography variant="h6" className="result-title">
                    {item.title}
                  </Typography>

                  <Typography variant="body2" className="result-category">
                    Category: {item.category}
                  </Typography>

                  {/* Colored Transaction Label */}
                  <div
                    className={`transaction-label ${
                      item.transactionType === 0
                        ? "transaction-sell"
                        : item.transactionType === 1
                        ? "transaction-trade"
                        : "transaction-donation"
                    }`}
                  >
                    {item.transactionType === 0
                      ? "For Sale"
                      : item.transactionType === 1
                      ? "Trade/Exchange"
                      : "Donation"}
                  </div>

                  <Typography
                    variant="body2"
                    className="result-description"
                  >
                    {item.description?.length > 100
                      ? item.description.substring(0, 100) + "..."
                      : item.description}
                  </Typography>

                  {item.price > 0 && (
                    <Typography variant="body2" className="result-price">
                      💲{item.price}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography className="no-results-text">
          No items found for this search.
        </Typography>
      )}
    </Box>
  );
};

export default SearchResults;
