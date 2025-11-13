import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Grid,
  IconButton,
} from "@mui/material";
import {
  Search as SearchIcon,
  CardGiftcard as GiftIcon,
  SwapHoriz as SwapIcon,
  Favorite as HeartIcon,
  Add as AddIcon,
  Logout as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import "./UserDashboard.css";
import PostItem from "./PostItem";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifCount, setNotifCount] = useState(0);


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/"); // not logged in - back to landing
      return;
    }

    // Treat NULL / undefined account_type as "Buyer"
    const normalized = {
      ...storedUser,
      account_type: storedUser.account_type || "Buyer",
    };

    // persist the normalized value so next login is consistent
    localStorage.setItem("user", JSON.stringify(normalized));
    setCurrentUser(normalized);
  }, [navigate]);

 useEffect(() => {
  if (!currentUser) return;

  fetch(`http://localhost:5000/api/notifications/count/${currentUser.id}`)
    .then((res) => res.json())
    .then((data) => {
      console.log("NOTIF COUNT FROM SERVER:", data);
      setNotifCount(data.count);
    })
    .catch((err) => console.error("Notif count error:", err));
}, [currentUser]);


  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleOpenPostModal = () => setOpenPostModal(true);
  const handleClosePostModal = () => setOpenPostModal(false);

  const handleBecomeSeller = async () => {
    try {
      if (!currentUser) return;

      const response = await fetch(
        "http://localhost:5000/api/users/account-type",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentUser.id, account_type: "Seller" }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update account type");
      }

      const updatedUser = { ...currentUser, account_type: "Seller" };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);

      alert("You are now a Seller! You can post items.");
    } catch (err) {
      console.error("Error updating account type:", err);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchTerm.trim() !== "") {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleBackToAdmin = () => {
    navigate("/admin");
  };

  if (!currentUser) {
    return null; 
  }

  return (
    <Box className="dashboard-wrapper">
      {/* Header Bar */}
      <Box className="dashboard-header">
  {/* LEFT SECTION */}
  <Box className="header-left">
    <Avatar className="owl-logo">🦉</Avatar>

    <Box>
      <Typography variant="h6" className="site-title">OwlExchange</Typography>
      <Typography variant="caption" className="site-subtitle">
        Community Donations, Trades & Sales
      </Typography>
    </Box>

    <IconButton
  className="notifications-icon-btn"
  onClick={() => navigate("/notifications")}
>
  <NotificationsIcon />

  {notifCount > 0 && (
    <span className="notif-badge">{notifCount}</span>
  )}
</IconButton>

  </Box>

  {/* CENTER SECTION */}
  <Box className="header-center">
    <TextField
      placeholder="Search donations, trades, sales..."
      variant="outlined"
      size="small"
      className="search-bar"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onKeyDown={handleSearchKeyDown}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  </Box>

  {/* RIGHT SECTION */}
  <Box className="header-right">
    {currentUser?.role === "Admin" && (
      <Button
        variant="contained"
        className="back-admin-btn"
        startIcon={<AdminIcon />}
        onClick={handleBackToAdmin}
      >
        Admin Dashboard
      </Button>
    )}

    {currentUser?.account_type === "Seller" && (
      <Button
        variant="contained"
        className="post-item-btn"
        startIcon={<AddIcon />}
        onClick={handleOpenPostModal}
      >
        Post Item
      </Button>
    )}

    {currentUser?.account_type === "Buyer" && (
      <Button
        variant="outlined"
        className="post-item-btn"
        onClick={handleBecomeSeller}
      >
        Become a Seller
      </Button>
    )}

    <Avatar className="user-avatar">
      {currentUser ? currentUser.email.charAt(0).toUpperCase() : "?"}
    </Avatar>

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
              Your community platform for sharing, trading, and giving. Connect
              with neighbors to donate items, make sustainable swaps, and build
              a stronger local community.
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
                    Donate &amp; Share
                  </Typography>
                  <Typography variant="body1" className="feature-description">
                    Give items a second life by donating to community members
                    who need them.
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
                    Trade &amp; Exchange
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
                    Connect with neighbors and create lasting relationships
                    through sharing.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Floating Owl Zone (unchanged) */}
      <div className="owl-zone">
        <div className="owl owl-1" />
        <div className="owl owl-2" />
        <div className="owl owl-3" />
        <div className="owl owl-4" />
      </div>

      {/* Post Item Modal */}
      <PostItem open={openPostModal} onClose={handleClosePostModal} />
    </Box>
  );
};

export default UserDashboard;
