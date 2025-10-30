import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Avatar,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import {
  Search as SearchIcon,
  CardGiftcard as GiftIcon,
  SwapHoriz as SwapIcon,
  Favorite as HeartIcon,
  Add as AddIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import './UserDashboard.css';
import PostItem from './PostItem';

const UserDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null); // Store logged-in user info
  const [openPostModal, setOpenPostModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Track what's typed in search

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user")); // Get user from local storage
    if (storedUser) {
      setCurrentUser(storedUser); // Set user data in state
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token"); // Clear token on sign out
    localStorage.removeItem("user"); // Clear stored user info
    navigate('/'); // Return to home page
  };

  const handleOpenPostModal = () => setOpenPostModal(true);
  const handleClosePostModal = () => setOpenPostModal(false);

  // 🔍 Handle search submit
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  return (
    <Box className="dashboard-wrapper">
      {/* Header Bar */}
      <Box className="dashboard-header">
        <Box className="header-left">
          <Avatar className="owl-logo">🦉</Avatar>
          <Box>
            <Typography variant="h6" className="site-title">
              OwlExchange
            </Typography>
            <Typography variant="caption" className="site-subtitle">
              Community Donations, Trades & Sales
            </Typography>
          </Box>
        </Box>

        <Box className="header-center">
          <TextField
            placeholder="Search donations, trades, sales..."
            variant="outlined"
            size="small"
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearchKeyDown} // 👈 Navigate on Enter
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box className="header-right">

          {/* 🆕 Show only for admins */}
          {currentUser?.role === "admin" && (
            <Button
              variant="contained"
              className="back-admin-btn"
              startIcon={<AdminIcon />}
              onClick={handleBackToAdmin}
            >
              Back to Admin
            </Button>
          )}

          <Button
            variant="contained"
            className="post-item-btn"
            startIcon={<AddIcon />}
            onClick={handleOpenPostModal}
          >
            Post Item
          </Button>

          {/* User avatar with first letter of email */}
          <Avatar className="user-avatar">
            {currentUser ? currentUser.email.charAt(0).toUpperCase() : "?"}
          </Avatar>

          {/* Username before @ */}
          <Typography variant="body2" className="username">
            {currentUser ? currentUser.email.split("@")[0] : "Loading..."}
          </Typography>

          <Button
            variant="outlined"
            className="sign-out-btn"
            startIcon={<LogoutIcon />}
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="dashboard-content">
        <Container maxWidth="lg" className="main-content">
          {/* Welcome Section */}
          <Box className="welcome-section">
            <Typography variant="h2" className="welcome-title">
              Welcome to <span className="owl-highlight">OwlExchange</span>
            </Typography>
            <Typography variant="h6" className="welcome-subtitle">
              Your community platform for sharing, trading, and giving. Connect with
              neighbors to donate items, make sustainable swaps, and build a stronger
              local community.
            </Typography>
            <Button
              variant="contained"
              className="share-item-btn"
              startIcon={<GiftIcon />}
              onClick={handleOpenPostModal}
            >
              Share an Item
            </Button>
          </Box>

          {/* Feature Cards */}
          <Grid container spacing={3} className="feature-cards">
            <Grid item xs={12} sm={6} md={4}>
              <Card className="feature-card">
                <CardContent>
                  <Box className="icon-container green">
                    <GiftIcon className="feature-icon" />
                  </Box>
                  <Typography variant="h5" className="feature-title">
                    Donate & Share
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Give items a second life by donating to community members who need them.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card className="feature-card">
                <CardContent>
                  <Box className="icon-container purple">
                    <SwapIcon className="feature-icon" />
                  </Box>
                  <Typography variant="h5" className="feature-title">
                    Trade & Exchange
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Swap items you no longer need for things that bring you joy.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Card className="feature-card">
                <CardContent>
                  <Box className="icon-container blue">
                    <HeartIcon className="feature-icon" />
                  </Box>
                  <Typography variant="h5" className="feature-title">
                    Build Community
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Connect with neighbors and create lasting relationships through sharing.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Post Item Modal */}
      <PostItem open={openPostModal} onClose={handleClosePostModal} />
    </Box>
  );
};

export default UserDashboard;
