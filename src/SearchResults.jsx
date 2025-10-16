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
  TextField
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
];

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const keyword = queryParams.get("q");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchResults = () => {
    setLoading(true);
    let url = `http://localhost:5000/api/items/search?keyword=${keyword || ""}`;
    if (selectedCategory !== "All") {
      url += `&category=${encodeURIComponent(selectedCategory.toLowerCase())}`;
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, selectedCategory]);

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

      {/* Category Filter */}
      <Box className="filter-bar">
        <Typography variant="body1" sx={{ marginRight: "10px" }}>
          Filter by Category:
        </Typography>
        <TextField
          select
          size="small"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ width: 200 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Loader */}
      {loading && (
        <Box className="loading-box">
          <CircularProgress />
          <Typography>Loading items...</Typography>
        </Box>
      )}

      {/* Results */}
      {!loading && (
        <>
          {items.length > 0 ? (
            <Grid container spacing={3} className="results-grid">
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} key={item.id}>
                  <Card className="result-card">
                    {item.image_url ? (
                      <CardMedia
                        component="img"
                        height="180"
                        image={item.image_url}
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
                      <Typography
                        variant="body2"
                        className="result-description"
                      >
                        {item.description?.length > 100
                          ? item.description.substring(0, 100) + "..."
                          : item.description}
                      </Typography>
                      {item.price >= 0 && (
                        <Typography
                          variant="body2"
                          className="result-price"
                        >
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
        </>
      )}
    </Box>
  );
};

export default SearchResults;
