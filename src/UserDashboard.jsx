import React, { useState } from 'react';
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
  const [openPostModal, setOpenPostModal] = useState(false);

  const handleSignOut = () => {
    // Add any sign out logic here (clear tokens, etc.)
    navigate('/');
  };

  const handleOpenPostModal = () => {
    setOpenPostModal(true);
  };

  const handleClosePostModal = () => {
    setOpenPostModal(false);
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
          <Button
            variant="contained"
            className="post-item-btn"
            startIcon={<AddIcon />}
            onClick={handleOpenPostModal}
          >
            Post Item
          </Button>
          <Avatar className="user-avatar">M</Avatar>
          <Typography variant="body2" className="username">
            milesmorales23
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