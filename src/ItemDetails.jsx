import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Card,
  Divider,
  CircularProgress,
  Avatar,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import VerifiedIcon from "@mui/icons-material/Verified";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ReportIcon from "@mui/icons-material/Report";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import "./ItemDetails.css";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);


  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching item:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <Box className="loading-box">
        <CircularProgress />
        <Typography>Loading item details...</Typography>
      </Box>
    );
  }

  if (!item) {
    return <Typography className="error-text">Item not found.</Typography>;
  }

  return (
    <Box className="item-details-page">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        className="back-button"
      >
        Back
      </Button>

        {/* Main Item Image with Click-to-Zoom */}
        <Card
          className="item-image-card"
          elevation={2}
          onClick={() => setShowModal(true)} // open modal when clicked
        >
          <img
            src={item.imageUrl || "/placeholder.png"}
            alt={item.title}
            className="item-image"
          />
        </Card>

        {/* Image Modal (click outside to close) */}
        {showModal && (
          <div className="image-modal" onClick={() => setShowModal(false)}>
            <img src={item.imageUrl || "/placeholder.png"} alt={item.title} />
          </div>
        )}


        {/* Main Info Container */}
        <Box className="item-main-info">


        {/* Right: Item Info */}
        <Box className="item-info-column">
          <Card className="item-info-card" elevation={3}>
            <Typography variant="h5" className="item-title">
              {item.title}
            </Typography>

            <Box className="item-tags-row">
              <Chip label={item.category || "Uncategorized"} />
              <Chip
                label={
                  item.condition
                    ? item.condition.charAt(0).toUpperCase() +
                      item.condition.slice(1)
                    : "Good"
                }
              />
              <Chip
                label="Available"
                color="success"
                sx={{ color: "#fff", fontWeight: 500 }}
              />
            </Box>

            <Box className="item-meta-row">
              <Typography variant="body2">
                <VisibilityIcon fontSize="small" /> 45 views
              </Typography>
              <Typography variant="body2">
                <CalendarTodayIcon fontSize="small" /> January 15, 2025
              </Typography>
              <Typography variant="body2">
                <PeopleOutlineIcon fontSize="small" /> 0 interested
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<ChatBubbleOutlineIcon />}
              className="contact-seller-btn"
            >
              Contact Seller
            </Button>

            <Box className="action-buttons">
              <Button
                startIcon={<FavoriteBorderIcon />}
                variant="outlined"
                color="inherit"
              >
                Save
              </Button>
              <Button
                startIcon={<ShareIcon />}
                variant="outlined"
                color="inherit"
              >
                Share
              </Button>
            </Box>

            <Button
              startIcon={<ReportIcon />}
              variant="text"
              color="error"
              className="report-btn"
            >
              Report Item
            </Button>

            <Divider sx={{ my: 2 }} />

            {item.price > 0 && (
              <Typography variant="h6" className="item-price">
                ${item.price}
              </Typography>
            )}

            <Typography variant="subtitle1" className="section-header">
              Description
            </Typography>
            <Typography variant="body2" className="item-description">
              {item.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" className="section-header">
              Tags
            </Typography>
            {item.tags ? (
              <Chip
                label={item.tags}
                variant="outlined"
                color="default"
                className="item-tag"
              />
            ) : (
              <Typography variant="body2" color="textSecondary">
                No tags provided
              </Typography>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle1" className="section-header">
              Contact Method
            </Typography>
            <Typography variant="body2">{item.contactMethod}</Typography>
          </Card>

          {/* Seller Information */}
          <Card className="seller-info-card" elevation={2}>
            <Typography variant="subtitle1" className="section-header">
              Seller Information
            </Typography>

            <Box className="seller-details">
              <Avatar sx={{ bgcolor: "#1976d2" }}>
                {item.sellerName ? item.sellerName.charAt(0).toUpperCase() : "?"}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  {item.sellerName || "Unknown Seller"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.sellerEmail || "No email provided"}
                </Typography>
              </Box>
            </Box>

            <Box className="seller-meta">
              <Typography variant="body2">
                <EmailIcon fontSize="small" /> Contact via listed email
              </Typography>
              <Typography variant="body2">
                <VerifiedIcon fontSize="small" /> Verified Seller
              </Typography>
              <Typography variant="body2">
                <CalendarMonthIcon fontSize="small" /> Member since 2025
              </Typography>
            </Box>
          </Card>


          {/* Safety Tips */}
          <Card className="safety-card" elevation={1}>
            <Typography variant="subtitle1" className="section-header">
              Safety Tips
            </Typography>
            <ul className="safety-list">
              <li>Meet in public places on campus</li>
              <li>Inspect items before purchasing</li>
              <li>Use secure payment methods</li>
              <li>Trust your instincts</li>
              <li>Report suspicious activity</li>
            </ul>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ItemDetails;
